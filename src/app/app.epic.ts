import { combineEpics } from 'redux-observable';
import { keyboard } from '../logic/keypress/keypress.epic';
import { hubEpics } from '../logic/hub/hub.epic';
import { circleEpics } from '../logic/circle/circle.epic';

export const appEpic$ = combineEpics(keyboard, hubEpics, circleEpics);
