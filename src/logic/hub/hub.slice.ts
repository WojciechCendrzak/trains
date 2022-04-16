import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color, DuploTrainBaseSound, HubUUID } from './hub.model';

const hubState = {
  currentSpeed: 0,
  lastSpeed: 0,
};

const initialState = {
  hubs: {
    [HubUUID.One.toString()]: hubState,
    [HubUUID.Two.toString()]: hubState,
  },
  connected: {} as Record<string, boolean>,
};

export type HubState = typeof initialState;

export const hubSlice = createSlice({
  name: 'hub',
  initialState: initialState,
  reducers: {
    // hub
    initialize: () => undefined,
    addConnectedHub: (state, action: PayloadAction<{ hubId: string }>) => {
      const { hubId } = action.payload;
      state.connected[hubId] = true;
    },
    logState: () => undefined,
    // motor
    changeSpeedBy: (_state, _action: PayloadAction<{ hubId: string; by: number }>) => undefined,
    changeSpeedTo: (_state, _action: PayloadAction<{ hubId: string; to: number }>) => undefined,
    setSpeed: (state, action: PayloadAction<{ hubId: string; speed: number }>) => {
      const { hubId, speed } = action.payload;
      state.hubs[hubId].lastSpeed = speed || state.hubs[hubId].lastSpeed;
      state.hubs[hubId].currentSpeed = speed;
    },
    // led
    changeLamp: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
    // color sensor
    initializeColorSensor: (_state, _action: PayloadAction<{ hubId: string }>) => undefined,
    colorDetected: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
    colorPairsDetected: (
      _state,
      _action: PayloadAction<{ hubId: string; colorPair: (Color | undefined)[] }>
    ) => undefined,
    playSound: (_state, _action: PayloadAction<{ hubId: string; sound: DuploTrainBaseSound }>) =>
      undefined,
    playTone: (_state, _action: PayloadAction<{ hubId: string; tone: number }>) =>
      undefined,
  },
});
