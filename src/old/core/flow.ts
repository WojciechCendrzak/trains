import {
  filter,
  from,
  map,
  merge,
  mergeMap,
  mergeScan,
  Observable,
  of,
  scan,
  switchScan,
  tap,
} from 'rxjs';
import { handleExit, keypress$, KeyPressEvent } from './keypress';

const initialState: number = 0;
const STEP = 15;
const MAX_SPEED = 100;

type State = typeof initialState;

type Epic = (actions: Observable<KeyPressEvent>, state: State) => Observable<State>;

const speedUp: Epic = (actions, state) =>
  actions.pipe(
    filter((keypress) => keypress === 'right'),
    map(() => Math.min(state + STEP, MAX_SPEED))
  );

const speedDown: Epic = (actions, state) =>
  actions.pipe(
    filter((keypress) => keypress === 'left'),
    map(() => Math.min(state - STEP, MAX_SPEED))
  );

const handlers = [speedUp, speedDown];

// keypress$
//   .pipe(
//     handleExit,
//     mergeMap((keypress) => merge(...handlers.map((f) => f(of(keypress), initialState)))),
//     scan((a, c) => c, initialState),
//     tap((state) => console.log(state))
//   )
//   .subscribe();

keypress$
  .pipe(
    handleExit,
    // mergeScan((acc, one) => of(acc + 1), initialState),
    switchScan((acc, key) => of(acc + 1, acc + 1), initialState),

    // mergeScan((state, keypress) => {
    //   // const r = merge(handlers.map((h) => h(of(keypress), state)));

    //   return r;
    // }, initialState),
    // mergeMap((data) => merge(...handlers.map((handler) => of(data).pipe(handler)))),

    // mergeScan((acc, keypress) => from(handlers.map((f) => f(of(keypress)))), initialState),
    tap((state) => console.log(state))
  )
  .subscribe();
