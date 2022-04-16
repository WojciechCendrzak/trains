import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, ignoreElements, mergeMap, pluck } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { hubSlice } from '../hub.slice';

const playSound: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.playSound.match),
    pluck('payload'),
    managed(mergeMap(({ hubId, sound }) => from(hubApi.playSound(hubId, sound)))),
    ignoreElements()
  );

const playTone: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.playTone.match),
    pluck('payload'),
    managed(mergeMap(({ hubId, tone }) => from(hubApi.playTone(hubId, tone)))),
    ignoreElements()
  );

export const soundEpics = combineEpics(playSound, playTone);
