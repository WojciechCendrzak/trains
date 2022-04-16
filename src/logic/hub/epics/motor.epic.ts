import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { MAX_SPEED } from '../hub.model';
import { hubSlice } from '../hub.slice';

const changeSpeedBy: RootEpic = (actions$, state$) =>
  actions$.pipe(
    filter(hubSlice.actions.changeSpeedBy.match),
    pluck('payload'),
    map(({ hubId, by }) => ({ hubId, speed: add(state$.value.hub.hubs[hubId].currentSpeed, by) })),
    map(({ hubId, speed }) => hubSlice.actions.changeSpeedTo({ hubId, to: speed }))
  );

const add = (speed: number, by: number) => Math.min(Math.max(speed + by, -MAX_SPEED), MAX_SPEED);

const changeSpeedTo: RootEpic = (actions$, state$, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.changeSpeedTo.match),
    pluck('payload'),
    map(({ hubId, to }) => ({
      hubId,
      fromSpeed: state$.value.hub.hubs[hubId].lastSpeed,
      toSpeed: to,
    })),
    managed(
      mergeMap(({ hubId, fromSpeed, toSpeed }) => from(hubApi.rampSpeed(hubId, fromSpeed, toSpeed)))
      // managed(mergeMap(({ hubId, toSpeed }) => from(hubApi.setSpeed(hubId, toSpeed))))
    ),
    map(({ hubId, speed }) => hubSlice.actions.setSpeed({ hubId, speed }))
  );

export const motorEpics = combineEpics(changeSpeedBy, changeSpeedTo);
