import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { hubSlice } from '../hub.slice';

const changeLamp: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.changeLamp.match),
    managed(mergeMap(({ payload: { hubId, color } }) => from(hubApi.setLight(hubId, color)))),
    map(({ hubId, color }) => hubSlice.actions.setLampColor({ hubId, color }))
  );

export const lampEpics = combineEpics(changeLamp);
