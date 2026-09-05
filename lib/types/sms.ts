export interface SMSInboundRequest {
  sender?: string;
  message: string;
}

export interface SMSInboundResponse {
  recipient: string;
  query_type: 'PNR' | 'TRAIN_NUMBER' | 'HELP' | 'UNKNOWN';
  query_identifier: string;
  sms_text: string;
  character_count: number;
  segments: number;
  generated_at: string;
  data_payload: Record<string, any>;
}
