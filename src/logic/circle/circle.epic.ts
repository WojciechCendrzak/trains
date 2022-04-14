import { combineEpics } from 'redux-observable';
import { from, fromEventPattern, pipe } from 'rxjs';
import { filter, groupBy, map, mergeMap, pluck, scan, switchMap, tap } from 'rxjs/operators';
import { RootEpic } from '../../app/app.epics.type';
import { canEnter } from './circle.logic';
import { circleSlice } from './circle.slice';

const colorDetected: RootEpic = (actions$, state$) =>
  actions$.pipe(
    filter(circleSlice.actions.colorDetected.match),
    pluck('payload'),
    map(({ hubId, color }) =>
      canEnter(state$.value.circle.semaphors, hubId, color)
        ? circleSlice.actions.enter({ hubId, color })
        : circleSlice.actions.waitFor({ hubId, color })
    )
  );

export const circleEpics = combineEpics(colorDetected);
