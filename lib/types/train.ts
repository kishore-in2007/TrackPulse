export interface Station {
  station_code: string;
  station_name: string;
  state: string;
  zone: string;
  latitude: number;
  longitude: number;
}

export interface TrainStop {
  station_code: string;
  station_name: string;
  stop_sequence: number;
  scheduled_arrival: string;
  scheduled_departure: string;
  distance_from_origin_km: number;
}

export interface Train {
  train_id: string;
  train_number: string;
  train_name: string;
  train_type: string;
  source_station: string;
  destination_station: string;
  zone: string;
  total_distance_km: number;
  total_stops: number;
}

export interface SectionStatistic {
  from_station: string;
  to_station: string;
  distance_km: number;
  sample_count: number;
  median_running_min: number;
  mean_running_min: number;
  p90_running_min: number;
  std_running_min: number;
  recovery_rate: number;
}

export type DependencyType = 
  | 'RAKE' 
  | 'CREW' 
  | 'PLATFORM' 
  | 'SCHEDULE' 
  | 'PASSENGER_CONNECTION' 
  | 'SECTION_CONGESTION';

export interface TrainDependency {
  dependency_id: string;
  incoming_train_id: string;
  incoming_train_name: string;
  outgoing_train_id: string;
  outgoing_train_name: string;
  station_code: string;
  station_name: string;
  dependency_type: DependencyType;
  minimum_turnaround_minutes: number;
  scheduled_incoming_arrival: string;
  scheduled_outgoing_departure: string;
  confidence: number;
  description: string;
}

export interface PNRRecord {
  pnr: string;
  passenger_name: string;
  train_id: string;
  train_number: string;
  train_name: string;
  source: string;
  destination: string;
  boarding_station: string;
  destination_station: string;
  booking_status: string;
  coach: string;
  berth: string;
  journey_date: string;
  scheduled_departure: string;
  scheduled_arrival: string;
}

export interface ReplayEvent {
  step: number;
  simulated_time: string;
  train_id: string;
  current_station: string;
  next_station: string;
  current_delay_min: number;
  distance_remaining_km: number;
  speed_kmh: number;
}
