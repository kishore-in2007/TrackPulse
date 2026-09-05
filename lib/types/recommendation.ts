import { DelayRisk, DelayRegime } from './eta';

export interface RecommendationWeights {
  arrival_quality: number; // default: 0.35
  reliability: number;     // default: 0.20
  punctuality: number;     // default: 0.15
  connection_safety: number; // default: 0.15
  user_preference: number; // default: 0.10
  delay_risk_inverse: number; // default: 0.05
}

export interface RecommendationRequest {
  source: string;
  destination: string;
  date?: string;
  departure_window_start?: string; // e.g. "06:00"
  departure_window_end?: string;   // e.g. "12:00"
  max_delay_minutes?: number;      // e.g. 30
  connection_required?: boolean;
  preference?: 'fastest' | 'most_reliable' | 'lowest_delay_risk' | 'balanced';
  custom_weights?: Partial<RecommendationWeights>;
}

export interface RecommendedTrain {
  train_id: string;
  train_number: string;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  predicted_arrival: string;
  eta_p10: string;
  eta_p50: string;
  eta_p90: string;
  current_delay_minutes: number;
  expected_delay_minutes: number;
  reliability: number;
  delay_risk: DelayRisk;
  regime: DelayRegime;
  connection_risk: DelayRisk;
  composite_score: number; // 0 to 100
  is_recommended: boolean;
  reasons: string[];
}

export interface RecommendationResponse {
  source: string;
  destination: string;
  query_date: string;
  total_options_found: number;
  weights_used: RecommendationWeights;
  recommended_train: RecommendedTrain | null;
  alternatives: RecommendedTrain[];
  summary: string;
}
