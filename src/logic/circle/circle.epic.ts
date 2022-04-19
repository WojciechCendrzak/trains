import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, map, mergeMap, pluck, switchMap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { managed } from '../../operators/managed.operator';
import { Color } from '../hub/hub.model';
import { hubSlice } from '../hub/hub.slice';
import { getZoneKey, mapZoneKeyToColor, zoneControl } from './circle.logic';
import { circleSlice } from './circle.slice';

const circleControl: RootEpic = (actions$, state$) =>
  actions$.pipe(
    filter(hubSlice.actions.colorDetected.match),
    pluck('payload'),
    filter(({ color }) => color !== Color.RED),
    map((payload) => ({ ...payload, zoneKey: getZoneKey([payload.color]) })),
    switchMap(({ hubId, zoneKey }) => {
      const { whoBloks, whoWaits } = state$.value.circle;
      const res = zoneControl(whoBloks, whoWaits, { hub: hubId, key: zoneKey });

      return of(
        circleSlice.actions.setState({ whoBloks: res.whoBloks, whoWaits: res.whoWaits }),
        ...res.toStop.map((hubId) => hubSlice.actions.changeSpeedTo({ hubId, to: 0 })),
        ...res.toRun.map(({ hub }) =>
          hubSlice.actions.changeSpeedTo({
            hubId: hub,
            to: state$.value.hub.hubs[hub].lastSpeed,
          })
        ),
        ...res.onZoneChange.map(({ hub, key }) =>
          hubSlice.actions.changeLamp({
            hubId: hub,
            color: mapZoneKeyToColor(key),
          })
        )
      );
    })
  );

const stopOnRedDetected: RootEpic = (actions$, _, { hubApi }) =>
  actions$.pipe(
    filter(hubSlice.actions.colorDetected.match),
    pluck('payload'),
    filter(({ color }) => color === Color.RED),
    managed(mergeMap(({ hubId }) => from(hubApi.setSpeed(hubId, 0)))),
    map(({ hubId, speed }) => hubSlice.actions.setSpeed({ hubId, speed }))
  );

export const circleEpics = combineEpics(
  //
  circleControl,
  stopOnRedDetected
);
