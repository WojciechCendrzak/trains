import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorChain } from '../hub/hub.model';
import { HubKey, ZoneKey } from './circle.logic';

const initialState = {
  whoBloks: {} as Record<ZoneKey, HubKey>,
  whoWaits: {} as Record<ZoneKey, HubKey>,
};

export type CircleState = typeof initialState;

export const circleSlice = createSlice({
  name: 'circle',
  initialState: initialState,
  reducers: {
    colorChainDetected: (_state, _action: PayloadAction<{ hubId: string; colors: ColorChain }>) =>
      undefined,
    setState: (
      state,
      action: PayloadAction<{
        whoBloks: Record<ZoneKey, HubKey>;
        whoWaits: Record<ZoneKey, HubKey>;
      }>
    ) => {
      const { whoBloks, whoWaits } = action.payload;
      state.whoBloks = whoBloks;
      state.whoWaits = whoWaits;
    },
  },
});
