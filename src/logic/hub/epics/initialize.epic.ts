import { BaseHub } from 'node-poweredup';
import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, of } from 'rxjs';
import { filter, ignoreElements, mergeMap, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../../app/app.epics.type';
import { hubSlice } from '../hub.slice';
import { consoleLog } from '../../../utils/log';

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

const logState: RootEpic = (actions$, state$) =>
  actions$.pipe(
    filter(hubSlice.actions.logState.match),
    tap(() => consoleLog(state$.value)),
    ignoreElements()
  );

const connectHub = async (hub: BaseHub) => {
  await hub.connect();
  return hub;
};

export const initializeEpics = combineEpics(initialize, logState);
