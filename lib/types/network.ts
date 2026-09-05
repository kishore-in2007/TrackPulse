import { TrainDependency, DependencyType } from './train';
import { DelayRisk, DelayRegime } from './eta';

export interface StationTrafficSummary {
  station_code: string;
  station_name: string;
  zone: string;
  incoming_count: number;
  outgoing_count: number;
  avg_incoming_delay: number;
  max_incoming_delay: number;
  turnaround_conflicts: number;
  congestion_risk: DelayRisk;
}

export interface IncomingTrainStatus {
  train_id: string;
  train_number: string;
  train_name: string;
  source_station: string;
  current_location: string;
  current_delay_min: number;
  scheduled_arrival: string;
  predicted_eta: string;
  eta_p10: string;
  eta_p50: string;
  eta_p90: string;
  reliability: number;
  risk: DelayRisk;
  regime: DelayRegime;
  connected_outgoing_trains: string[];
}

export interface OutgoingTrainStatus {
  train_id: string;
  train_number: string;
  train_name: string;
  destination_station: string;
  scheduled_departure: string;
  predicted_departure: string;
  departure_p10: string;
  departure_p50: string;
  departure_p90: string;
  required_turnaround_min: number;
  available_turnaround_min: number;
  turnaround_shortfall_min: number;
  propagated_delay_min: number;
  departure_risk: DelayRisk;
  incoming_dependency?: TrainDependency;
}

export interface NetworkAnalysisResponse {
  station_code: string;
  station_name: string;
  analysis_timestamp: string;
  summary: StationTrafficSummary;
  incoming: IncomingTrainStatus[];
  outgoing: OutgoingTrainStatus[];
  dependencies: TrainDependency[];
  turnaround_conflicts: {
    dependency_id: string;
    incoming_train_id: string;
    outgoing_train_id: string;
    dependency_type: DependencyType;
    available_turnaround_min: number;
    required_turnaround_min: number;
    shortfall_min: number;
    propagated_risk: DelayRisk;
    description: string;
  }[];
}
