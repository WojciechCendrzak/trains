import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, pipe } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { managed } from '../../../operators/managed.operator';
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
            map(({ color }) => hubSlice.actions.setColorSensor({ hubId, color }))
          )
        )
      )
    )
  );

export const colorSensorEpics = combineEpics(initializeColorSensor);
