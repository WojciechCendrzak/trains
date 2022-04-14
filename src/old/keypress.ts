// @ts-ignore
import keypress from 'keypress';
import { fromEventPattern, map, tap } from 'rxjs';

export type KeyPressEvent = [
  string | undefined,
  { name: string; ctrl: boolean; meta: boolean; shift: false; sequence: string }
];


const getKeypress = () => {
  keypress(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return fromEventPattern<KeyPressEvent>(
    (handler) => process.stdin.addListener('keypress', handler),
    (handler) => process.stdin.removeListener('keypress', handler)
  );
};

export const keypress$ = getKeypress().pipe(map(([ch, chObj]) => [ch || chObj.name, chObj] as KeyPressEvent));

// export type GetKeypress = GetInsideObservable<typeof keypress$>;

export const logKeyPress = tap(console.log);
export const handleExit = tap<KeyPressEvent>(([ch]) => {
  if (ch == 'q') {
    process.exit();
  }
});
