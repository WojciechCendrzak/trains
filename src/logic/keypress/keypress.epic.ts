import { combineEpics } from 'redux-observable';
import { EMPTY, fromEventPattern, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { Color, DuploTrainBaseSound, HubUUID, MAX_SPEED, STEP } from '../hub/hub.model';
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
            hubSlice.actions.changeLamp({ hubId: HubUUID.One, color: Color.BLUE }),
            hubSlice.actions.changeLamp({ hubId: HubUUID.Two, color: Color.BLUE })
          );
        case 'b':
          return of(
            hubSlice.actions.changeLamp({ hubId: HubUUID.One, color: Color.YELLOW }),
            hubSlice.actions.changeLamp({ hubId: HubUUID.Two, color: Color.YELLOW })
          );
      }
      return EMPTY;
    })
  );

const other: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.key.match),
    mergeMap((action) => {
      switch (action.payload.key) {
        case 'l':
          return of(hubSlice.actions.logState());
      }
      return EMPTY;
    })
  );

const sounds: RootEpic = (actions$) =>
  actions$.pipe(
    filter(keyboardSlice.actions.key.match),
    switchMap((action) => {
      switch (action.payload.key) {
        case 'o':
          return of(
            hubSlice.actions.playSound({
              hubId: HubUUID.One,
              sound: DuploTrainBaseSound.STATION_DEPARTURE,
            }),
            hubSlice.actions.playSound({
              hubId: HubUUID.Two,
              sound: DuploTrainBaseSound.STATION_DEPARTURE,
            })
          );
        case 's':
          return of(
            hubSlice.actions.playSound({
              hubId: HubUUID.One,
              sound: DuploTrainBaseSound.STEAM,
            }),
            hubSlice.actions.playSound({
              hubId: HubUUID.Two,
              sound: DuploTrainBaseSound.STEAM,
            })
          );
        case 'h':
          return of(
            hubSlice.actions.playSound({
              hubId: HubUUID.One,
              sound: DuploTrainBaseSound.HORN,
            }),
            hubSlice.actions.playSound({
              hubId: HubUUID.Two,
              sound: DuploTrainBaseSound.HORN,
            })
          );
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          return of(
            hubSlice.actions.playTone({
              hubId: HubUUID.One,
              tone: parseInt(action.payload.key, 10),
            }),
            hubSlice.actions.playTone({
              hubId: HubUUID.One,
              tone: parseInt(action.payload.key, 10),
            })
          );
      }
      return EMPTY;
    })
  );

// const test: RootEpic = (actions$) =>
//   actions$.pipe(
//     filter(keyboardSlice.actions.key.match),
//     mergeMap((action) => {
//       switch (action.payload.key) {
//         case 'e':
//           return of(hubSlice.actions.colorDetected({ hubId: HubUUID.One, color: Color.GREEN }));
//         case 'r':
//           return of(hubSlice.actions.colorDetected({ hubId: HubUUID.One, color: Color.BLUE }));
//         case 'd':
//           return of(hubSlice.actions.colorDetected({ hubId: HubUUID.Two, color: Color.GREEN }));
//         case 'f':
//           return of(hubSlice.actions.colorDetected({ hubId: HubUUID.Two, color: Color.BLUE }));
//       }
//       return EMPTY;
//     })
//   );

const handleExit = tap<string>((key) => {
  if (key == 'q') process.exit();
});
const logKeyPress = tap(console.log);

export const keyboard = combineEpics(
  initialize,
  motor1,
  motor2,
  light,
  //  test,
  other,
  sounds
);
