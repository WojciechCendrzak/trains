import { Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './app.reducers';
import { appEpic$ } from './app.epic';
import { EpicDependencies } from './app.epics.type';
import { hubApi } from '../logic/hub/hub.api';

const log = (store: any) => (next: any) => (action: any) => {
  console.log(`-> ${action.type} ${JSON.stringify(action.payload)} `);
  // console.log(action)
  next(action);
};

const epicDependencies: EpicDependencies = {
  hubApi,
};

const epicMiddleware = createEpicMiddleware<Action, Action>({
  dependencies: epicDependencies,
});

export const store = configureStore({
  reducer: reducers,
  middleware: [
    // log,
    epicMiddleware
  ],
});

epicMiddleware.run(appEpic$ as any);
