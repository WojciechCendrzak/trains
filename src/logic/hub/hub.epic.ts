import { BaseHub } from 'node-poweredup';
import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, of, pipe } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { managed } from '../../operators/managed.operator';
import { Color, MAX_SPEED } from './hub.model';
import { hubSlice } from './hub.slice';

const initialize: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.initialize.match),
    switchMap(() =>
      fromEventPattern<BaseHub>(
        (handler) => {
          console.log('Scanning for Hubs...');

          const res = hubApi.poweredUP.addListener('discover', handler);
          hubApi.poweredUP.scan();
          return res;
        },
        (handler) => hubApi.poweredUP.removeListener('discover', handler)
      )
    ),
    tap((hub) => console.log(`discovered ${hub.uuid}`)),
    mergeMap((hub) => from(connectHub(hub))),
    tap((hub) => console.log(`Connected "${hub.name}", ${hub.uuid}`)),
    switchMap((hub) =>
      of(
        hubSlice.actions.addConnectedHub({ hubId: hub.uuid }),
        hubSlice.actions.initializeColorSensor({ hubId: hub.uuid })
      )
    )
  );

const initializeColorSensor: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.initializeColorSensor.match),
    managed(
      pipe(
        switchMap(({ payload: { hubId } }) =>
          from(hubApi.getColorSensorDevice(hubId)).pipe(
            switchMap((colorSensor) => {
              console.log(`initializing color sensor ${hubId}`);
              return fromEventPattern<{ color: Color }>(
                (handler) => colorSensor.addListener('color', handler),
                (handler) => colorSensor.removeListener('color', handler)
              );
            }),
            tap(({ color }) => console.log(`color detected ${color}`)),
            map(({ color }) => hubSlice.actions.setColorSensor({ hubId, color }))
          )
        )
      )
    )
  );

const connectHub = async (hub: BaseHub) => {
  await hub.connect();
  return hub;
};

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

const changeLamp: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.changeLamp.match),
    managed(mergeMap(({ payload: { hubId, color } }) => from(hubApi.setLight(hubId, color)))),
    map(({ hubId, color }) => hubSlice.actions.setLampColor({ hubId, color }))
  );

export const hubEpic = combineEpics(
  initialize,
  initializeColorSensor,
  changeSpeedBy,
  changeSpeedTo,
  changeLamp
);
