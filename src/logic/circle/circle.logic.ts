import { Color } from '../hub/hub.model';
import { Semaphores } from './circle.slice';

export const canEnter = (semaphores: Semaphores, hubId: string, color: Color) =>
  !semaphores[color] || semaphores[color] === hubId;
