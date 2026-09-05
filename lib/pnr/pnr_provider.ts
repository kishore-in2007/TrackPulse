import { PNRRecord } from '../types/train';
import { getPNR } from '../data/data_store';
import { calculateDynamicETA } from '../eta/dynamic_eta_engine';
import { DynamicETAResponse } from '../types/eta';

export interface PNRStatusResponse {
  pnr: string;
  masked_pnr: string;
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
  dynamic_eta: DynamicETAResponse;
  connection_risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function maskPNR(pnr: string): string {
  const clean = pnr.replace(/\D/g, '');
  if (clean.length <= 4) return '****';
  return '******' + clean.slice(-4);
}

export class MockPNRProvider {
  static getPNRStatus(pnrNumber: string): PNRStatusResponse | null {
    const raw = getPNR(pnrNumber);
    if (!raw) return null;

    const dynamicEta = calculateDynamicETA(raw.train_id);
    const masked = maskPNR(raw.pnr);

    console.log(`[PNR Lookup] Query processed for PNR: ${masked} on Train: ${raw.train_number}`);

    return {
      pnr: raw.pnr,
      masked_pnr: masked,
      passenger_name: raw.passenger_name,
      train_id: raw.train_id,
      train_number: raw.train_number,
      train_name: raw.train_name,
      source: raw.source,
      destination: raw.destination,
      boarding_station: raw.boarding_station,
      destination_station: raw.destination_station,
      booking_status: raw.booking_status,
      coach: raw.coach,
      berth: raw.berth,
      journey_date: raw.journey_date,
      scheduled_departure: raw.scheduled_departure,
      scheduled_arrival: raw.scheduled_arrival,
      dynamic_eta: dynamicEta,
      connection_risk: dynamicEta.risk
    };
  }
}
