import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, pipe } from 'rxjs';
import { filter, groupBy, map, mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
import { Color, getColorName } from '../hub.model';
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
            tap(({ color }) => console.log(`color detected ${getColorName(color)} (${color})`)),
            map(({ color }) => hubSlice.actions.colorDetected({ hubId, color }))
          )
        )
      )
    )
  );

// const detectColorPairs: RootEpic = (actions$) =>
//   actions$.pipe(
//     filter(hubSlice.actions.colorDetected.match),
//     map(({ payload }) => payload),
//     groupBy((p) => p.hubId),
//     mergeMap((group$) =>
//       group$.pipe(
//         scan(([_, curr], { color }) => [curr, color], [undefined, undefined] as (
//           | Color
//           | undefined
//         )[]),
//         map((colorPair) => ({ hubId: group$.key, colorPair }))
//       )
//     ),
//     log('pair detected'),
//     map(({ hubId, colorPair }) => hubSlice.actions.colorPairsDetected({ hubId, colorPair }))
//   );

// const colorPairsDetected: RootEpic = (actions$) =>
//   actions$.pipe(
//     filter(hubSlice.actions.colorDetected.match),
//     map(({ payload }) => payload),
//     map(({ hubId, color }) => circleSlice.actions.colorChainDetected({ hubId, colors: [color] }))
//   );

// const colorPairsDetected: RootEpic = (actions$) =>
//   actions$.pipe(
//     filter(hubSlice.actions.colorPairsDetected.match),
//     map(({ payload }) => payload),
//     map(({ hubId, colorPair }) =>
//       circleSlice.actions.colorChainDetected({ hubId, colors: colorPair })
//     )
//   );

export const colorSensorEpics = combineEpics(
  initializeColorSensor
  // detectColorPairs,
  // colorPairsDetected
);
