import { SMSInboundRequest, SMSInboundResponse } from '../types/sms';
import { MockPNRProvider } from '../pnr/pnr_provider';
import { calculateDynamicETA } from '../eta/dynamic_eta_engine';
import { getTrain, getAllTrains } from '../data/data_store';

export class MockSMSProvider {
  /**
   * Processes inbound SMS from any keypad, mobile phone, or external SMS gateway
   */
  static processInboundSMS(req: SMSInboundRequest): SMSInboundResponse {
    const rawMsg = (req.message || '').trim();
    const sender = req.sender || '9876543210';
    const upper = rawMsg.toUpperCase();
    
    // 1. Check if PNR query (10 digits)
    const pnrMatch = rawMsg.match(/\b\d{10}\b/);
    if (pnrMatch || upper.startsWith('PNR')) {
      const pnrNum = pnrMatch ? pnrMatch[0] : rawMsg.replace(/\D/g, '');
      let pnrResult = MockPNRProvider.getPNRStatus(pnrNum);

      // If arbitrary 10-digit number entered from keypad, generate realistic dynamic journey
      if (!pnrResult && pnrNum.length === 10) {
        const sampleTrainIds = ['12675', '12007', '12622', '12842', '22626'];
        const seedIdx = (parseInt(pnrNum.slice(-2), 10) || 0) % sampleTrainIds.length;
        const trainId = sampleTrainIds[seedIdx];
        const dynamicEta = calculateDynamicETA(trainId);
        const masked = '******' + pnrNum.slice(-4);

        const text = `TRACKPULSE:\nPNR ${masked} | Train ${dynamicEta.train_number} ${dynamicEta.source_station}->${dynamicEta.destination_station}\nDelay: +${dynamicEta.current_delay_minutes}m @ ${dynamicEta.current_station}\nDynamic ETA: ${dynamicEta.eta} (${dynamicEta.eta_p10}-${dynamicEta.eta_p90})\nRel: ${Math.round(dynamicEta.reliability * 100)}% | Risk: ${dynamicEta.risk}`;
        return {
          recipient: sender,
          query_type: 'PNR',
          query_identifier: masked,
          sms_text: text,
          character_count: text.length,
          segments: Math.ceil(text.length / 160),
          generated_at: new Date().toISOString(),
          data_payload: { pnr: pnrNum, dynamic_eta: dynamicEta }
        };
      }

      if (pnrResult) {
        const text = `TRACKPULSE:\nPNR ${pnrResult.masked_pnr} | Train ${pnrResult.train_number} ${pnrResult.source}->${pnrResult.destination}\nDelay: +${pnrResult.dynamic_eta.current_delay_minutes}m @ ${pnrResult.dynamic_eta.current_station}\nDynamic ETA: ${pnrResult.dynamic_eta.eta} (${pnrResult.dynamic_eta.eta_p10}-${pnrResult.dynamic_eta.eta_p90})\nRel: ${Math.round(pnrResult.dynamic_eta.reliability * 100)}% | Risk: ${pnrResult.connection_risk}`;
        return {
          recipient: sender,
          query_type: 'PNR',
          query_identifier: pnrResult.masked_pnr,
          sms_text: text,
          character_count: text.length,
          segments: Math.ceil(text.length / 160),
          generated_at: new Date().toISOString(),
          data_payload: pnrResult
        };
      }
    }

    // 2. Check if Train Number query (4 or 5 digits)
    const trainMatch = rawMsg.match(/\b\d{4,5}\b/);
    if (trainMatch) {
      const trainId = trainMatch[0];
      const train = getTrain(trainId);
      const dynamicEta = calculateDynamicETA(trainId);
      
      const text = `TRACKPULSE:\nTrain ${train?.train_number || trainId} ${train?.train_name || 'Express'}\nDelay: +${dynamicEta.current_delay_minutes}m @ ${dynamicEta.current_station}\nDynamic ETA: ${dynamicEta.eta} (Range: ${dynamicEta.eta_p10}-${dynamicEta.eta_p90})\nRel: ${Math.round(dynamicEta.reliability * 100)}% | Risk: ${dynamicEta.risk}\nReason: ${dynamicEta.reasons[0]?.factor || 'Sectional telemetry nominal'}`;
      return {
        recipient: sender,
        query_type: 'TRAIN_NUMBER',
        query_identifier: trainId,
        sms_text: text,
        character_count: text.length,
        segments: Math.ceil(text.length / 160),
        generated_at: new Date().toISOString(),
        data_payload: dynamicEta
      };
    }

    // 3. Station enquiry (e.g. "STN MAS" or "MAS")
    if (upper.length === 3 || upper.startsWith('STN ')) {
      const stnCode = upper.replace('STN', '').trim();
      const text = `TRACKPULSE:\nStation ${stnCode} Control:\nActive Feeders: 5 inbound rakes.\nAvg Inbound Delay: +16m.\nTurnaround Shortfalls: 1 active.\nReply with train number for live ETA.`;
      return {
        recipient: sender,
        query_type: 'HELP',
        query_identifier: stnCode,
        sms_text: text,
        character_count: text.length,
        segments: 1,
        generated_at: new Date().toISOString(),
        data_payload: {}
      };
    }

    // Default Help Text
    const helpText = `TRACKPULSE SMS SERVICE\nSend "PNR <10-digit-number>" for dynamic arrival & connection risk.\nSend "<train-number>" (e.g. 12675) for dynamic ETA range.\nWorks on any phone keypad.`;
    return {
      recipient: sender,
      query_type: 'HELP',
      query_identifier: 'HELP',
      sms_text: helpText,
      character_count: helpText.length,
      segments: 1,
      generated_at: new Date().toISOString(),
      data_payload: {}
    };
  }

  /**
   * Generates TwiML XML for direct webhook integration with Twilio / standard SMS carriers
   */
  static generateTwiML(smsText: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>${smsText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message>\n</Response>`;
  }
}
