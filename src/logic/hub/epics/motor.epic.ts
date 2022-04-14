import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { MAX_SPEED } from '../hub.model';
import { hubSlice } from '../hub.slice';

const changeSpeedBy: RootEpic = (actions$, state$, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.changeSpeedBy.match),
    map(({ payload: { hubId, by } }) => ({ hubId, by })),
    map(({ hubId, by }) => ({ hubId, speed: add(state$.value.hub[hubId].speed, by) })),
    managed(mergeMap(({ hubId, speed }) => from(hubApi.setSepped(hubId, speed)))),
    map(({ hubId, speed }) => hubSlice.actions.setSpeed({ hubId, speed }))
  );

const add = (speed: number, by: number) => Math.min(Math.max(speed + by, -MAX_SPEED), MAX_SPEED);

const changeSpeedTo: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.changeSpeedTo.match),
    map(({ payload: { hubId, to } }) => ({ hubId, to })),
    managed(mergeMap(({ hubId, to }) => from(hubApi.setSepped(hubId, to)))),
    map(({ hubId, speed }) => hubSlice.actions.setSpeed({ hubId, speed }))
  );

export const motorEpics = combineEpics(changeSpeedBy, changeSpeedTo);
