import { TrainTechnicalDimensions } from '../data/railradar_client';

export type DelayRegime = 'NORMAL' | 'DELAYED' | 'DISRUPTED';
export type DelayRisk = 'LOW' | 'MEDIUM' | 'HIGH';
export type EvidenceClassification = 'OBSERVED' | 'HISTORICAL' | 'INFERRED' | 'NETWORK';

export interface PredictionReason {
  classification: EvidenceClassification;
  factor: string;
  impact_minutes: number;
  description: string;
}

export interface SectionForecast {
  from_station: string;
  from_station_name: string;
  to_station: string;
  to_station_name: string;
  distance_km: number;
  nominal_runtime_min: number;
  predicted_runtime_min: number;
  p10_runtime_min: number;
  p90_runtime_min: number;
  expected_arrival: string;
  expected_departure: string;
  delay_minutes: number;
}

export interface WeatherTelemetry {
  temperature_c: number;
  humidity_pct: number;
  fog_visibility_index: number;
  is_monsoon_rain: boolean;
  wind_speed_kmh: number;
  description: string;
}

export interface HistoricalRouteStats {
  route_ontime_pct: number;
  median_delay_minutes: number;
  p90_delay_minutes: number;
  recovery_capacity_minutes: number;
  station_congestion_level: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface DynamicETAResponse {
  train_id: string;
  train_number: string;
  train_name: string;
  train_type: string;
  source_station: string;
  source_station_name: string;
  destination_station: string;
  destination_station_name: string;
  current_station: string;
  current_station_name: string;
  next_station: string;
  next_station_name: string;
  status: DelayRegime;
  current_delay_minutes: number;
  scheduled_arrival: string;
  eta: string;
  eta_p10: string;
  eta_p50: string;
  eta_p90: string;
  predicted_remaining_minutes: number;
  p10_remaining_minutes: number;
  p50_remaining_minutes: number;
  p90_remaining_minutes: number;
  reliability: number; // 0.00 to 1.00
  regime: DelayRegime;
  risk: DelayRisk;
  delay_probability: number;
  distance_remaining_km: number;
  stops_remaining: number;
  reasons: PredictionReason[];
  section_timeline: SectionForecast[];
  technical_dimensions: TrainTechnicalDimensions;
  weather_telemetry: WeatherTelemetry;
  historical_route_stats: HistoricalRouteStats;
  is_fallback: boolean;
  data_mode: 'LIVE' | 'REPLAY' | 'HISTORICAL' | 'DEMO';
  source_provider: 'railradar_live' | 'cris_ntes' | 'dynamic_telemetry';
  last_updated: string;
}
