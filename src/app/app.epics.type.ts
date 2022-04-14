import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { HubApi } from '../logic/hub/hub.api';
import { StoreState } from './app.reducers';

export type EpicDependencies = {
  hubApi: HubApi;
};

export type RootEpic = Epic<Action, Action, StoreState, EpicDependencies>;
