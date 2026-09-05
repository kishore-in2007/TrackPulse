import { DelayRisk } from './eta';
import { TrainDependency } from './train';

export interface SimulationRequest {
  train_id: string;
  delay_injection_minutes: number;
  simulation_horizon_hops?: number; // default: 3
}

export interface TrainSimulationDiff {
  train_id: string;
  train_number: string;
  train_name: string;
  baseline_arrival: string;
  scenario_arrival: string;
  baseline_delay_min: number;
  scenario_delay_min: number;
  delay_impact_min: number;
  baseline_risk: DelayRisk;
  scenario_risk: DelayRisk;
  p10_scenario: string;
  p50_scenario: string;
  p90_scenario: string;
  reason: string;
}

export interface SimulationResponse {
  simulation_id: string;
  trigger_train_id: string;
  trigger_train_name: string;
  delay_injected_min: number;
  timestamp: string;
  affected_trains_count: number;
  network_ripple_effect: 'MINIMAL' | 'MODERATE' | 'SEVERE';
  primary_diff: TrainSimulationDiff;
  propagated_diffs: TrainSimulationDiff[];
  affected_dependencies: TrainDependency[];
  passenger_impact_summary: {
    affected_connections: number;
    risk_escalations: number;
    high_risk_connections: string[];
  };
}
