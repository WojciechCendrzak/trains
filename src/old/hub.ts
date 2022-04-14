import PoweredUP, { BaseHub, Hub } from 'node-poweredup';
import { from, fromEventPattern, merge, mergeMap, tap } from 'rxjs';

export const poweredUP = new PoweredUP();

export const discoverHubs$ = () =>
  fromEventPattern<BaseHub>(
    (handler) => {
      console.log('Scanning for Hubs...');

      const res = poweredUP.addListener('discover', handler);
      poweredUP.scan();
      return res;
    },
    (handler) => poweredUP.removeListener('discover', handler)
  ).pipe(
    tap((hub) => console.log(`discovered ${hub.uuid}`)),
    mergeMap((hub) => from(connectHub(hub))),
    tap((hub) => console.log(`Connected "${hub.name}", ${hub.uuid}`))
  );

const connectHub = async (hub: BaseHub) => {
  await hub.connect();
  return hub;
};

