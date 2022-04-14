import { KeyboardSlice, keyboardSlice } from '../logic/keypress/keypress.slice';
import { hubSlice, HubState } from '../logic/hub/hub.slice';
import { circleSlice, CircleState } from '../logic/circle/circle.slice';

export interface StoreState {
  hub: HubState;
  keyboard: KeyboardSlice;
  circle: CircleState;
}

export const reducers = {
  hub: hubSlice.reducer,
  keyboard: keyboardSlice.reducer,
  circle: circleSlice.reducer,
};
