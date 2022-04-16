import { store } from './app.store';
import { keyboardSlice } from '../logic/keypress/keypress.slice';
import { hubSlice } from '../logic/hub/hub.slice';
import { diff } from 'deep-object-diff';
import isEmpty from 'lodash/isEmpty';
import { consoleLog } from '../utils/log';

export const start = () => {
  consoleLog('App started');
  let prevState = store.getState();
  consoleLog(prevState);

  store.subscribe(() => {
    const newState = store.getState();
    const d = diff(prevState, newState);
    if (!isEmpty(d)) {
      consoleLog(d);
    }
    prevState = newState;
  });
  store.dispatch(keyboardSlice.actions.initialize());
  store.dispatch(hubSlice.actions.initialize());
};
