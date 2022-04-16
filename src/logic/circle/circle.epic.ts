import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { MAX_SPEED } from '../hub/hub.model';
import { hubSlice } from '../hub/hub.slice';
import { getZoneKey, zoneControl } from './circle.logic';
import { whoWaitForZoneSelector } from './circle.selector';
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
        ...res.toRun.map((hubId) => hubSlice.actions.changeSpeedTo({ hubId, to: MAX_SPEED }))
      );
    })
    //   canEnter(state$.value.circle.whoBlocks, hubId, zoneKey)
    //     ? circleSlice.actions.enterZone({ hubId, zoneKey })
    //     : circleSlice.actions.waitForZone({ hubId, zoneKey })
    // )
  );

// const enterZone: RootEpic = (actions$, state$) =>
//   actions$.pipe(
//     filter(circleSlice.actions.enterZone.match),
//     pluck('payload'),
//     map((payload) => ({ ...payload, currentZone: state$.value.circle[payload.hubId].currentZone })),
//     switchMap(({ hubId, zoneKey, currentZone }) =>
//       of(
//         ...(currentZone
//           ? [
//               circleSlice.actions.unblockZone({
//                 hubId,
//                 zoneKey: currentZone,
//               }),
//             ]
//           : []),
//         circleSlice.actions.blockZone({ hubId, zoneKey }),
//         hubSlice.actions.changeSpeedTo({ hubId, to: MAX_SPEED })
//       )
//     )
//   );

// const unblockZone: RootEpic = (actions$, state$) =>
//   actions$.pipe(
//     filter(circleSlice.actions.unblockZone.match),
//     pluck('payload'),
//     switchMap(({ zoneKey }) =>
//       from(
//         whoWaitForZoneSelector(zoneKey)(state$.value).map((hubId) =>
//           circleSlice.actions.enterZone({ hubId, zoneKey })
//         )
//       )
//     )
//   );

// const waitForZone: RootEpic = (actions$) =>
//   actions$.pipe(
//     filter(circleSlice.actions.waitForZone.match),
//     pluck('payload'),
//     map(({ hubId }) => hubSlice.actions.changeSpeedTo({ hubId, to: 0 }))
//   );

export const circleEpics = combineEpics(
  colorDetected
  // enterZone,
  //  unblockZone,
  //  waitForZone
);
