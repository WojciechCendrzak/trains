import { HubTypeNames, Color, DuploTrainBaseSound } from 'node-poweredup/dist/node/consts';

export { HubTypeNames, Color, DuploTrainBaseSound };

export enum HubUUID {
  One = '10a90a2d2745f9efff0b0aee88750666',
  Two = '97b483a4c1d62207779404fa1d1e9bfd',
}

export const STEP = 15;
export const MAX_SPEED = 100;

export enum Devies {
  DuploTrainBaseMotor = 0,
  DuploTrainBaseSpeaker = 1,
  HubLED = 2,
  DuploTrainBaseColorSensor = 3,
  DuploTrainBaseSpeedometer = 4,
  VoltageSensor = 5,
}
