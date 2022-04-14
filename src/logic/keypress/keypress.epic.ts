import { combineEpics } from 'redux-observable';
import { EMPTY, fromEventPattern, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { Color, HubUUID, MAX_SPEED, STEP } from '../hub/hub.model';
import { hubSlice } from '../hub/hub.slice';
import { KeyPress, keypress } from './keypress.api';
import { keyboardSlice } from './keypress.slice';

const initialize: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.initialize.match),
    tap(() => {
      keypress(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }),
    switchMap(() =>
      fromEventPattern<KeyPress>(
        (handler) => process.stdin.addListener('keypress', handler),
        (handler) => process.stdin.removeListener('keypress', handler)
      )
    ),
    // logKeyPress,
    map(([ch, chObj]) => ({ ...chObj, key: ch || chObj.name })),
    map(({ key }) => key),
    handleExit,
    map((key) => keyboardSlice.actions.key({ key }))
  );

const motor1: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.key.match),
    switchMap((action) => {
      switch (action.payload.key) {
        case 'right':
          return of(hubSlice.actions.changeSpeedBy({ hubId: HubUUID.One, by: STEP }));
        case 'left':
          return of(hubSlice.actions.changeSpeedBy({ hubId: HubUUID.One, by: -STEP }));
        case 'up':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.One, to: MAX_SPEED }));
        case 'down':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.One, to: -MAX_SPEED }));
        case ' ':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.One, to: 0 }));
      }
      return EMPTY;
    })
  );

const motor2: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.key.match),
    switchMap((action) => {
      switch (action.payload.key) {
        case '\\':
          return of(hubSlice.actions.changeSpeedBy({ hubId: HubUUID.Two, by: STEP }));
        case `'`:
          return of(hubSlice.actions.changeSpeedBy({ hubId: HubUUID.Two, by: -STEP }));
        case ']':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.Two, to: MAX_SPEED }));
        case '[':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.Two, to: -MAX_SPEED }));
        case '\r':
          return of(hubSlice.actions.changeSpeedTo({ hubId: HubUUID.Two, to: 0 }));
      }
      return EMPTY;
    })
  );

const light: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.key.match),
    switchMap((action) => {
      switch (action.payload.key) {
        case 'z':
          return of(
            hubSlice.actions.changeLamp({ hubId: HubUUID.One, color: Color.GREEN }),
            hubSlice.actions.changeLamp({ hubId: HubUUID.Two, color: Color.GREEN })
          );
        case 'p':
          return of(
            hubSlice.actions.changeLamp({ hubId: HubUUID.One, color: Color.ORANGE }),
            hubSlice.actions.changeLamp({ hubId: HubUUID.Two, color: Color.ORANGE })
          );
        case 'n':
          return of(
            hubSlice.actions.changeLamp({ hubId: HubUUID.One, color: Color.LIGHT_BLUE }),
            hubSlice.actions.changeLamp({ hubId: HubUUID.Two, color: Color.LIGHT_BLUE })
          );
      }
      return EMPTY;
    })
  );

const handleExit = tap<string>((key) => {
  if (key == 'q') process.exit();
});
const logKeyPress = tap(console.log);

export const keyboard = combineEpics(initialize, motor1, motor2, light);
