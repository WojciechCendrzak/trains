import PoweredUP, {
  DuploTrainBaseColorSensor,
  DuploTrainBaseMotor,
  DuploTrainBaseSpeaker,
  HubLED,
} from 'node-poweredup';
import { Color, DuploTrainBaseSound } from 'node-poweredup/dist/node/consts';
import { Devies } from './hub.model';

const poweredUP = new PoweredUP();

export const hubApi = {
  setSepped: async (hubId: string, speed: number) => {
    await getMotor(hubId)?.setPower(speed);
    return { hubId, speed };
  },
  setLight: async (hubId: string, color: Color) => {
    await getHubLED(hubId)?.setColor(color);
    return { hubId, color };
  },
  getColorSensorDevice: async (hubId: string) => {
    return getColorSensor(hubId);
  },
  playSound: async (hubId: string, sound: DuploTrainBaseSound) => {
    await getSoundDevice(hubId)?.playSound(sound);
  },
  playTone: async (hubId: string, tone: number) => {
    await getSoundDevice(hubId)?.playTone(tone);
  },
  poweredUP,
};

const getMotor = (hubId: string): DuploTrainBaseMotor => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.DuploTrainBaseMotor] as DuploTrainBaseMotor;
};

const getHubLED = (hubId: string): HubLED => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.HubLED] as HubLED;
};

const getSoundDevice = (hubId: string): DuploTrainBaseSpeaker => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.DuploTrainBaseSpeaker] as DuploTrainBaseSpeaker;
};

const getColorSensor = (hubId: string): DuploTrainBaseColorSensor => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.DuploTrainBaseColorSensor] as DuploTrainBaseColorSensor;
};

export type HubApi = typeof hubApi;
