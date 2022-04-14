import { KeyboardSlice, keyboardSlice } from '../logic/keypress/keypress.slice';
import { hubSlice, HubState } from '../logic/hub/hub.slice';

export interface StoreState {
  hub: HubState;
  keyboard: KeyboardSlice;
}

export const reducers = {
  hub: hubSlice.reducer,
  keyboard: keyboardSlice.reducer,
};
