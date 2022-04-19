import { HubTypeNames, DuploTrainBaseSound } from 'node-poweredup/dist/node/consts';
import { mapEnumToName, reverseObject } from '../../utils/enum';
import { consoleLog } from '../../utils/log';

export enum Color {
  BLACK = 0,
  PINK = 1,
  PURPLE = 2,
  BLUE = 3,
  LIGHT_BLUE = 4,
  CYAN = 5,
  GREEN = 6,
  YELLOW = 7,
  ORANGE = 8,
  RED = 9,
  WHITE = 10,
  NONE = 255,
}

export { HubTypeNames, DuploTrainBaseSound };

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

const colorToNameMap = mapEnumToName(Color);
const colorNameToColorMap = reverseObject(colorToNameMap);

export const getColorName = (color: Color) => colorToNameMap[color];
export const getColorByName = (name: string) => colorNameToColorMap[name];

export type ColorChain = (Color | undefined)[];
