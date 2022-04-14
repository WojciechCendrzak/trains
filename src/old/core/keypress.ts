// @ts-ignore
import keypress from 'keypress';
import { fromEventPattern, map, tap } from 'rxjs';
import { GetInsideObservable } from '../model';

type KeyPress = [
  string | undefined,
  { name: string; ctrl: boolean; meta: boolean; shift: false; sequence: string }
];

const getKeypress = () => {
  keypress(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return fromEventPattern<KeyPress>(
    (handler) => process.stdin.addListener('keypress', handler),
    (handler) => process.stdin.removeListener('keypress', handler)
  );
};

export const keypress$ = getKeypress().pipe(
  // map(([ch, chObj]) => ({ ...chObj, key: ch || chObj.name }))
  map(([ch, chObj]) => ch || chObj.name)
);

export type KeyPressEvent = GetInsideObservable<typeof keypress$>;

export const logKeyPress = tap(console.log);
export const handleExit = tap<KeyPressEvent>((key) => {
  if (key == 'q') {
    process.exit();
  }
});
