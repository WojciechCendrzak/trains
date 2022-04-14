import { ColorChain, getColorName } from '../hub/hub.model';
import { Semaphores } from './circle.slice';

export const canEnter = (semaphores: Semaphores, hubId: string, zoneKey: string) =>
  !semaphores[zoneKey] || semaphores[zoneKey] === hubId;

export const getZoneKey = (colors: ColorChain) =>
  colors.map((c) => (c !== undefined ? getColorName(c) : '_')).join('.');
