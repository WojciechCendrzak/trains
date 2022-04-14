import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, pipe } from 'rxjs';
import { filter, groupBy, map, mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { log } from '../../../utils/log';
import { Color } from '../hub.model';
import { hubSlice } from '../hub.slice';

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
            map(({ color }) => hubSlice.actions.colorDetected({ hubId, color }))
          )
        )
      )
    )
  );

const colorDetected: RootEpic = (actions$) =>
  actions$.pipe(
    filter(hubSlice.actions.colorDetected.match),
    map(({ payload: { hubId, color } }) => hubSlice.actions.setColorSensor({ hubId, color }))
  );

const detectColorPairs: RootEpic = (actions$) =>
  actions$.pipe(
    filter(hubSlice.actions.colorDetected.match),
    map(({ payload }) => payload),
    groupBy((p) => p.hubId),
    mergeMap((group$) =>
      group$.pipe(
        scan(([_, curr], { color }) => [curr, color], [undefined, undefined] as (
          | Color
          | undefined
        )[]),
        map((colorPair) => ({ hubId: group$.key, colorPair }))
      )
    ),
    log('pair detected'),
    map(({ hubId, colorPair }) => hubSlice.actions.colorPairsDetected({ hubId, colorPair }))
  );

const colorPairsDetected: RootEpic = (actions$) =>
  actions$.pipe(
    filter(hubSlice.actions.colorPairsDetected.match),
    map(({ payload }) => payload),
    map(({ hubId, colorPair }) => hubSlice.actions.setDetectedColorsPair({ hubId, colorPair }))
  );

export const colorSensorEpics = combineEpics(
  initializeColorSensor,
  colorDetected,
  detectColorPairs,
  colorPairsDetected
);
