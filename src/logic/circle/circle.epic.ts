import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { hubSlice } from '../hub/hub.slice';
import { getZoneKey, zoneControl } from './circle.logic';
import { circleSlice } from './circle.slice';

const colorDetected: RootEpic = (actions$, state$) =>
  actions$.pipe(
    filter(hubSlice.actions.colorDetected.match),
    pluck('payload'),
    map((payload) => ({ ...payload, zoneKey: getZoneKey([payload.color]) })),
    switchMap(({ hubId, zoneKey }) => {
      const { whoBloks, whoWaits } = state$.value.circle;
      const res = zoneControl(whoBloks, whoWaits, { hub: hubId, key: zoneKey });

      return of(
        circleSlice.actions.setState({ whoBloks: res.whoBloks, whoWaits: res.whoWaits }),
        ...res.toStop.map((hubId) => hubSlice.actions.changeSpeedTo({ hubId, to: 0 })),
        ...res.toRun.map((hubId) =>
          hubSlice.actions.changeSpeedTo({ hubId, to: state$.value.hub.hubs[hubId].lastSpeed })
        )
      );
    })
  );

export const circleEpics = combineEpics(colorDetected);
