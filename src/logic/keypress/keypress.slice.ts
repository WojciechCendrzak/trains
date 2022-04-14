import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KeyboardSlice {}

export const initialAppState: KeyboardSlice = {};

export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState: initialAppState,
  reducers: {
    initialize: () => undefined,
    key: (_state, _action: PayloadAction<{ key: string }>) => undefined,
  },
});
