import PoweredUP, { DuploTrainBaseColorSensor, DuploTrainBaseMotor, HubLED } from 'node-poweredup';
import { Color, Devies, HubUUID } from './hub.model';

const poweredUP = new PoweredUP();

export const hubApi = {
  setSepped: async (hubId: HubUUID, speed: number) => {
    // getMotor(hubId)?.setPower(speed);
    return { hubId, speed };
  },
  setLight: async (hubId: HubUUID, color: Color) => {
    getHubLED(hubId)?.setColor(color);
    return { hubId, color };
  },
  getColorSensorDevice: async (hubId: string) => {
    return getColorSensor(hubId);
  },
  poweredUP,
};

const getMotor = (hubId: HubUUID): DuploTrainBaseMotor => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.DuploTrainBaseMotor] as DuploTrainBaseMotor;
};

const getHubLED = (hubId: HubUUID): HubLED => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.HubLED] as HubLED;
};

const getColorSensor = (hubId: string): DuploTrainBaseColorSensor => {
  const hub = poweredUP.getHubByUUID(hubId);
  if (!hub) throw `no hub ${hubId}`;
  return hub?.getDevices()[Devies.DuploTrainBaseColorSensor] as DuploTrainBaseColorSensor;
};

export type HubApi = typeof hubApi;
