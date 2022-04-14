import { store } from './app.store';
import { keyboardSlice } from '../logic/keypress/keypress.slice';
import { hubSlice } from '../logic/hub/hub.slice';

export const start = () => {
  console.log('App started');

  store.subscribe(() => console.log(JSON.stringify(store.getState(), null, 2)));
  store.dispatch(keyboardSlice.actions.initialize());
  store.dispatch(hubSlice.actions.initialize());
};
