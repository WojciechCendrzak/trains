import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { keyboard } from '../logic/keypress/keypress.epic';
import { hubEpic } from '../logic/hub/hub.epic';

export const appEpic$ = combineEpics(keyboard, hubEpic);
