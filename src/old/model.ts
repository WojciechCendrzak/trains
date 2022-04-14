export enum HubUUID {
  One = '10a90a2d2745f9efff0b0aee88750666',
  Two = '97b483a4c1d62207779404fa1d1e9bfd',
}

import { HubTypeNames, Color, DuploTrainBaseSound } from 'node-poweredup/dist/node/consts';
import { Observable } from 'rxjs';

export { HubTypeNames, Color, DuploTrainBaseSound };

export enum Devies {
  DuploTrainBaseMotor = 0,
  DuploTrainBaseSpeaker = 1,
  HubLED = 2,
  DuploTrainBaseColorSensor = 3,
  DuploTrainBaseSpeedometer = 4,
  VoltageSensor = 5,
}

export type GetInsideObservable<X> = X extends Observable<infer I> ? I : never;

