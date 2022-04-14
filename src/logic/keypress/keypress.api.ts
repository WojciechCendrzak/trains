// @ts-ignore
import keypress from 'keypress';

export type KeyPress = [
  string | undefined,
  { name: string; ctrl: boolean; meta: boolean; shift: false; sequence: string }
];

export { keypress };
