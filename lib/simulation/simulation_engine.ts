import { SimulationRequest, SimulationResponse, TrainSimulationDiff } from '../types/simulation';
import { analyzeStationNetwork } from '../propagation/propagation_engine';
import { getDependenciesForTrain, getTrain } from '../data/data_store';
import { calculateDynamicETA } from '../eta/dynamic_eta_engine';

export function runWhatIfSimulation(req: SimulationRequest): SimulationResponse {
  const trainId = req.train_id.trim();
  const injectedDelay = Math.max(0, req.delay_injection_minutes);
  const train = getTrain(trainId);
  const trainName = train?.train_name || `Train ${trainId}`;

  // 1. Calculate Primary Trigger Train Diff
  const baselineTriggerETA = calculateDynamicETA(trainId);
  const scenarioTriggerETA = calculateDynamicETA(trainId, {
    overrideCurrentDelay: baselineTriggerETA.current_delay_minutes + injectedDelay
  });

  const primaryDiff: TrainSimulationDiff = {
    train_id: trainId,
    train_number: trainId,
    train_name: trainName,
    baseline_arrival: baselineTriggerETA.eta,
    scenario_arrival: scenarioTriggerETA.eta,
    baseline_delay_min: baselineTriggerETA.current_delay_minutes,
    scenario_delay_min: scenarioTriggerETA.current_delay_minutes,
    delay_impact_min: injectedDelay,
    baseline_risk: baselineTriggerETA.risk,
    scenario_risk: scenarioTriggerETA.risk,
    p10_scenario: scenarioTriggerETA.eta_p10,
    p50_scenario: scenarioTriggerETA.eta_p50,
    p90_scenario: scenarioTriggerETA.eta_p90,
    reason: `Injected +${injectedDelay} min simulated operational disruption at current block.`
  };

  // 2. Evaluate Station Network Cascading Ripple
  const baselineNetwork = analyzeStationNetwork('MAS');
  const scenarioNetwork = analyzeStationNetwork('MAS', {
    delayOverrides: {
      [trainId]: baselineTriggerETA.current_delay_minutes + injectedDelay
    }
  });

  const propagatedDiffs: TrainSimulationDiff[] = [];
  const deps = getDependenciesForTrain(trainId);
  const affectedDependencies = deps.outgoing;

  for (const scenOut of scenarioNetwork.outgoing) {
    const baseOut = baselineNetwork.outgoing.find(o => o.train_id === scenOut.train_id);
    if (!baseOut) continue;

    const delayImpact = scenOut.propagated_delay_min - baseOut.propagated_delay_min;
    if (delayImpact > 0 || scenOut.train_id === trainId) {
      propagatedDiffs.push({
        train_id: scenOut.train_id,
        train_number: scenOut.train_number,
        train_name: scenOut.train_name,
        baseline_arrival: baseOut.predicted_departure,
        scenario_arrival: scenOut.predicted_departure,
        baseline_delay_min: baseOut.propagated_delay_min,
        scenario_delay_min: scenOut.propagated_delay_min,
        delay_impact_min: delayImpact,
        baseline_risk: baseOut.departure_risk,
        scenario_risk: scenOut.departure_risk,
        p10_scenario: scenOut.departure_p10,
        p50_scenario: scenOut.departure_p50,
        p90_scenario: scenOut.departure_p90,
        reason: `Turnaround shortfall increased to ${scenOut.turnaround_shortfall_min}m due to late incoming feeder ${trainId}.`
      });
    }
  }

  // 3. Passenger Connection Risk Assessment
  const highRiskConnections: string[] = [];
  let riskEscalations = 0;

  for (const diff of propagatedDiffs) {
    if (diff.scenario_risk === 'HIGH' && diff.baseline_risk !== 'HIGH') {
      riskEscalations++;
      highRiskConnections.push(`Connection to ${diff.train_name} (${diff.train_id}) escalated from ${diff.baseline_risk} to HIGH risk (+${diff.delay_impact_min}m departure push).`);
    }
  }

  let rippleEffect: 'MINIMAL' | 'MODERATE' | 'SEVERE' = 'MINIMAL';
  if (propagatedDiffs.length >= 2 || injectedDelay >= 30) {
    rippleEffect = 'SEVERE';
  } else if (propagatedDiffs.length >= 1 || injectedDelay >= 15) {
    rippleEffect = 'MODERATE';
  }

  return {
    simulation_id: `SIM-${Date.now()}`,
    trigger_train_id: trainId,
    trigger_train_name: trainName,
    delay_injected_min: injectedDelay,
    timestamp: new Date().toISOString(),
    affected_trains_count: 1 + propagatedDiffs.length,
    network_ripple_effect: rippleEffect,
    primary_diff: primaryDiff,
    propagated_diffs: propagatedDiffs,
    affected_dependencies: affectedDependencies,
    passenger_impact_summary: {
      affected_connections: propagatedDiffs.length,
      risk_escalations: riskEscalations,
      high_risk_connections: highRiskConnections
    }
  };
}
