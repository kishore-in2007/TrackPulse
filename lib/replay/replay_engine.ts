import { ReplayEvent } from '../types/train';
import { getAllReplayEvents } from '../data/data_store';
import { calculateDynamicETA } from '../eta/dynamic_eta_engine';
import { DynamicETAResponse } from '../types/eta';

export interface ReplayState {
  current_step: number;
  total_steps: number;
  simulated_time: string;
  is_playing: boolean;
  playback_speed: number;
  active_trains: {
    train_id: string;
    event: ReplayEvent;
    dynamic_eta: DynamicETAResponse;
  }[];
}

export class ReplayEngine {
  static getReplayState(stepIndex: number = 0, isPlaying: boolean = false, speed: number = 1): ReplayState {
    const allEvents = getAllReplayEvents();
    const distinctSteps = Array.from(new Set(allEvents.map(e => e.step))).sort((a, b) => a - b);
    const validStep = Math.max(0, Math.min(stepIndex, distinctSteps.length - 1));
    const stepEvents = allEvents.filter(e => e.step === validStep);
    
    const simTime = stepEvents[0]?.simulated_time || '18:00';
    
    const activeTrains = stepEvents.map(ev => {
      const etaRes = calculateDynamicETA(ev.train_id, {
        overrideCurrentStation: ev.current_station,
        overrideCurrentDelay: ev.current_delay_min,
        simulatedCurrentTime: ev.simulated_time,
        dataMode: 'REPLAY'
      });
      return {
        train_id: ev.train_id,
        event: ev,
        dynamic_eta: etaRes
      };
    });

    return {
      current_step: validStep,
      total_steps: distinctSteps.length,
      simulated_time: simTime,
      is_playing: isPlaying,
      playback_speed: speed,
      active_trains: activeTrains
    };
  }
}
