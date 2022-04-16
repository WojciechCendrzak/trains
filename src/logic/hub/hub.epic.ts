import { combineEpics } from 'redux-observable';
import { colorSensorEpics } from './epics/color-sensor.epic';
import { initializeEpics } from './epics/initialize.epic';
import { lampEpics } from './epics/lamp.epic';
import { motorEpics } from './epics/motor.epic';
import { soundEpics } from './epics/sound.epic';

export const hubEpics = combineEpics(
  initializeEpics,
  motorEpics,
  colorSensorEpics,
  lampEpics,
  soundEpics
);
