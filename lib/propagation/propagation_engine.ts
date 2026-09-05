import { NetworkAnalysisResponse, IncomingTrainStatus, OutgoingTrainStatus, StationTrafficSummary } from '../types/network';
import { DelayRisk, DelayRegime } from '../types/eta';
import { getStation, getDependenciesForStation, getAllTrains } from '../data/data_store';
import { calculateDynamicETA } from '../eta/dynamic_eta_engine';

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length >= 2) {
    return (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)) % 1440;
  }
  return 0;
}

function formatMinutesToTime(totalMin: number): string {
  const norm = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function analyzeStationNetwork(
  stationCode: string,
  options?: {
    timeWindowMinutes?: number;
    delayOverrides?: Record<string, number>;
  }
): NetworkAnalysisResponse {
  const normCode = stationCode.trim().toUpperCase();
  const station = getStation(normCode) || {
    station_code: normCode,
    station_name: `${normCode} Junction`,
    state: 'Tamil Nadu',
    zone: 'SR',
    latitude: 13.0827,
    longitude: 80.2707
  };

  const dependencies = getDependenciesForStation(normCode);
  
  // Default incoming trains for demo station (e.g. MAS)
  const incomingTrainConfigs = [
    { id: '12675', name: 'Kovai Express', from: 'CBE', sched: '18:20', delay: 18 },
    { id: '12007', name: 'Mysore Shatabdi', from: 'MYS', sched: '18:30', delay: 6 },
    { id: '12622', name: 'Tamil Nadu Express', from: 'NDLS', sched: '18:40', delay: 32 },
    { id: '12842', name: 'Coromandel Express', from: 'HWH', sched: '17:50', delay: 14 },
    { id: '22626', name: 'Bangalore Double Decker', from: 'SBC', sched: '19:15', delay: 8 }
  ];

  // Default outgoing trains for demo station
  const outgoingTrainConfigs = [
    { id: '12676', name: 'Kovai Return Express', to: 'CBE', sched: '18:50', minTurnaround: 45, depType: 'RAKE', linkedIncoming: '12675' },
    { id: '12008', name: 'Mysore Shatabdi Return', to: 'MYS', sched: '19:10', minTurnaround: 30, depType: 'CREW', linkedIncoming: '12007' },
    { id: '12674', name: 'Cheran Express', to: 'CBE', sched: '19:05', minTurnaround: 20, depType: 'PASSENGER_CONNECTION', linkedIncoming: '12622' },
    { id: '12840', name: 'Howrah Mail', to: 'HWH', sched: '19:40', minTurnaround: 35, depType: 'PLATFORM', linkedIncoming: '12842' },
    { id: '12602', name: 'Mangalore Mail', to: 'MAQ', sched: '20:15', minTurnaround: 25, depType: 'SCHEDULE', linkedIncoming: '22626' }
  ];

  const incomingStatuses: IncomingTrainStatus[] = [];
  const etaMap: Record<string, any> = {};

  for (const inc of incomingTrainConfigs) {
    const delay = options?.delayOverrides?.[inc.id] !== undefined 
      ? options.delayOverrides[inc.id] 
      : inc.delay;
      
    const etaRes = calculateDynamicETA(inc.id, {
      overrideCurrentDelay: delay,
      overrideCurrentStation: inc.from
    });
    
    etaMap[inc.id] = etaRes;

    const connectedOutgoing = outgoingTrainConfigs
      .filter(o => o.linkedIncoming === inc.id)
      .map(o => o.id);

    incomingStatuses.push({
      train_id: inc.id,
      train_number: inc.id,
      train_name: inc.name,
      source_station: inc.from,
      current_location: etaRes.current_station,
      current_delay_min: delay,
      scheduled_arrival: inc.sched,
      predicted_eta: etaRes.eta,
      eta_p10: etaRes.eta_p10,
      eta_p50: etaRes.eta_p50,
      eta_p90: etaRes.eta_p90,
      reliability: etaRes.reliability,
      risk: etaRes.risk,
      regime: etaRes.regime,
      connected_outgoing_trains: connectedOutgoing
    });
  }

  const outgoingStatuses: OutgoingTrainStatus[] = [];
  const turnaroundConflicts: NetworkAnalysisResponse['turnaround_conflicts'] = [];

  for (const out of outgoingTrainConfigs) {
    const schedDepMin = parseTimeToMinutes(out.sched);
    const linkedInc = incomingStatuses.find(i => i.train_id === out.linkedIncoming);
    
    let requiredTurnaround = out.minTurnaround;
    let availableTurnaround = 60;
    let shortfall = 0;
    let propagatedDelay = 0;
    let depRisk: DelayRisk = 'LOW';
    let depP10 = out.sched;
    let depP50 = out.sched;
    let depP90 = out.sched;

    if (linkedInc) {
      const predArrMin = parseTimeToMinutes(linkedInc.predicted_eta);
      const predArrP10Min = parseTimeToMinutes(linkedInc.eta_p10);
      const predArrP90Min = parseTimeToMinutes(linkedInc.eta_p90);
      
      availableTurnaround = (schedDepMin - predArrMin + 1440) % 1440;
      // If arrival is later than scheduled departure
      if (schedDepMin < predArrMin && (predArrMin - schedDepMin) < 720) {
        availableTurnaround = -(predArrMin - schedDepMin);
      }

      if (availableTurnaround < requiredTurnaround) {
        shortfall = requiredTurnaround - availableTurnaround;
        propagatedDelay = shortfall;
        
        const depMinP50 = schedDepMin + shortfall;
        const depMinP10 = Math.max(schedDepMin, (parseTimeToMinutes(linkedInc.eta_p10) + requiredTurnaround));
        const depMinP90 = Math.max(depMinP50, (parseTimeToMinutes(linkedInc.eta_p90) + requiredTurnaround + 5));

        depP50 = formatMinutesToTime(depMinP50);
        depP10 = formatMinutesToTime(depMinP10);
        depP90 = formatMinutesToTime(depMinP90);

        depRisk = shortfall > 20 ? 'HIGH' : (shortfall > 5 ? 'MEDIUM' : 'LOW');

        turnaroundConflicts.push({
          dependency_id: `DEP-${normCode}-${out.linkedIncoming}-${out.id}`,
          incoming_train_id: out.linkedIncoming,
          outgoing_train_id: out.id,
          dependency_type: out.depType as any,
          available_turnaround_min: availableTurnaround,
          required_turnaround_min: requiredTurnaround,
          shortfall_min: shortfall,
          propagated_risk: depRisk,
          description: `Incoming Train ${out.linkedIncoming} predicted arrival (${linkedInc.predicted_eta}) leaves only ${availableTurnaround}m turnaround (needed ${requiredTurnaround}m). Propagating +${shortfall}m departure delay.`
        });
      }
    }

    const matchingDep = dependencies.find(d => d.outgoing_train_id === out.id);

    outgoingStatuses.push({
      train_id: out.id,
      train_number: out.id,
      train_name: out.name,
      destination_station: out.to,
      scheduled_departure: out.sched,
      predicted_departure: depP50,
      departure_p10: depP10,
      departure_p50: depP50,
      departure_p90: depP90,
      required_turnaround_min: requiredTurnaround,
      available_turnaround_min: availableTurnaround,
      turnaround_shortfall_min: shortfall,
      propagated_delay_min: propagatedDelay,
      departure_risk: depRisk,
      incoming_dependency: matchingDep
    });
  }

  // Summary Metrics
  const avgDelay = incomingStatuses.length > 0 
    ? Math.round(incomingStatuses.reduce((acc, i) => acc + i.current_delay_min, 0) / incomingStatuses.length) 
    : 0;
  const maxDelay = incomingStatuses.length > 0 
    ? Math.max(...incomingStatuses.map(i => i.current_delay_min)) 
    : 0;

  const trafficSummary: StationTrafficSummary = {
    station_code: normCode,
    station_name: station.station_name,
    zone: station.zone || 'SR',
    incoming_count: incomingStatuses.length,
    outgoing_count: outgoingStatuses.length,
    avg_incoming_delay: avgDelay,
    max_incoming_delay: maxDelay,
    turnaround_conflicts: turnaroundConflicts.length,
    congestion_risk: turnaroundConflicts.length > 1 || maxDelay > 30 ? 'HIGH' : (turnaroundConflicts.length > 0 ? 'MEDIUM' : 'LOW')
  };

  return {
    station_code: normCode,
    station_name: station.station_name,
    analysis_timestamp: new Date().toISOString(),
    summary: trafficSummary,
    incoming: incomingStatuses,
    outgoing: outgoingStatuses,
    dependencies: dependencies,
    turnaround_conflicts: turnaroundConflicts
  };
}
