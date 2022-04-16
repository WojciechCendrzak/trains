import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorChain } from '../hub/hub.model';
import { HubKey, ZoneKey } from './circle.logic';

// export type Semaphores = Record<string, string>;

// const hub = {
//   currentZone: undefined as string | undefined,
//   waitForZone: undefined as string | undefined,
// };

const initialState = {
  whoBloks: {} as Record<ZoneKey, HubKey>,
  whoWaits: {} as Record<ZoneKey, HubKey>,
  // whoBlocks: {} as Semaphores,
  // whoWaits: {} as Semaphores,
  // [HubUUID.One.toString()]: hub,
  // [HubUUID.Two.toString()]: hub,
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
    // enterZone: (_state, _action: PayloadAction<{ hubId: string; zoneKey: string }>) => undefined,
    // waitForZone: (state, action: PayloadAction<{ hubId: string; zoneKey: string }>) => {
    //   const { hubId, zoneKey } = action.payload;
    //   state.whoWaits[zoneKey] = hubId;
    //   state[hubId].waitForZone = zoneKey;
    // },
    // unWaitForZone: (state, action: PayloadAction<{ hubId: string; zoneKey: string }>) => {
    //   const { zoneKey, hubId } = action.payload;
    //   delete state.whoWaits[zoneKey];
    //   state[hubId].waitForZone = undefined;
    // },
    // blockZone: (state, action: PayloadAction<{ hubId: string; zoneKey: string }>) => {
    //   const { hubId, zoneKey } = action.payload;
    //   state.whoBlocks[zoneKey] = hubId;
    //   state[hubId].currentZone = zoneKey;
    // },
    // unblockZone: (state, action: PayloadAction<{ hubId: string; zoneKey: string }>) => {
    //   const { zoneKey, hubId } = action.payload;
    //   delete state.whoBlocks[zoneKey];
    //   state[hubId].currentZone = undefined;
    // },
  },
});
