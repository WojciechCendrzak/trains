

import { HubUUID } from './model';

export const KeyMapping = {
  [HubUUID.One]: {
    speedForwardMax: 'up',
    speedBackwardMax: 'down',
    speedUp: 'right',
    speedDown: 'left',
    stop: 'space',
  },
  [HubUUID.Two]: {
    speedForwardMax: ']',
    speedBackwardMax: '[',
    speedUp: '\\',
    speedDown: "'",
    stop: 'return',
  },
};
