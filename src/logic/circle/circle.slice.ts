import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color, HubUUID } from '../hub/hub.model';

export type Semaphores = Record<Color, string>;
const initialState = {
  semaphors: {} as Semaphores,
};

export type CircleState = typeof initialState;

export const circleSlice = createSlice({
  name: 'circle',
  initialState: initialState,
  reducers: {
    colorDetected: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
    enter: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
    waitFor: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
  },
});
