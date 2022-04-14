import { BaseHub } from 'node-poweredup';
import { filter, from, map, merge, mergeMap, of, pipe, tap } from 'rxjs';
import { discoverHubs$, poweredUP } from './hub';
import { keypress$, handleExit, logKeyPress, KeyPressEvent } from './keypress';
import { GetInsideObservable } from './model';

export const start = () => {
  keypress$
    .pipe(
      // logKeyPress,
      handleExit
    )
    .subscribe();

  hubs$
    .pipe(mergeMap((data) => merge(...handlers.map((handler) => of(data).pipe(handler)))))
    .subscribe();
};

const discoverHubsMock$ = () => of('hub1', 'hub2');

const state = {
  hub1: 0,
  hub2: 0,
}

const hubs$ = discoverHubsMock$().pipe(
  mergeMap((hub) => keypress$.pipe(map((keypressEvent) => ({ hub, keypressEvent, state }))))
);

type Hubs = GetInsideObservable<typeof hubs$>;

const handleForward = pipe(
  filter<Hubs>(({ hub, keypressEvent }) => {
    const [key] = keypressEvent;
    return key === 'up';
  }),
  tap(() => {
    console.log('up pressed');
  })
);

const handleBack = pipe(
  filter<Hubs>(({ hub, keypressEvent }) => {
    const [key] = keypressEvent;
    return key === 'down';
  }),
  tap(() => {
    console.log('down pressed');
  })
);

const handleStepForward = pipe(
  filter<Hubs>(({ hub, keypressEvent }) => {
    const [key] = keypressEvent;
    return key === 'right';
  }),
  tap(() => {
    console.log('rigth pressed');
  })
);

const handlers = [handleForward, handleBack, handleStepForward];
