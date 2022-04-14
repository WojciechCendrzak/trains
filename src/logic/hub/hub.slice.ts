import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color, HubUUID } from './hub.model';

const hubState = {
  speed: 0,
  color: 0,
  detectedColors: [] as Color[],
  detectedColorsPairs: [undefined, undefined] as (Color | undefined)[],
  status: '',
};

const initialState = {
  [HubUUID.One]: hubState,
  [HubUUID.Two]: hubState,
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
    // motor
    changeSpeedBy: (_state, _action: PayloadAction<{ hubId: HubUUID; by: number }>) => undefined,
    changeSpeedTo: (_state, _action: PayloadAction<{ hubId: HubUUID; to: number }>) => undefined,
    setSpeed: (state, action: PayloadAction<{ hubId: HubUUID; speed: number }>) => {
      const { hubId, speed } = action.payload;
      state[hubId].speed = speed;
    },
    // led
    changeLamp: (_state, _action: PayloadAction<{ hubId: HubUUID; color: Color }>) => undefined,
    setLampColor: (state, action: PayloadAction<{ hubId: HubUUID; color: Color }>) => {
      const { hubId, color } = action.payload;
      state[hubId].color = color;
    },
    // color sensor
    initializeColorSensor: (_state, _action: PayloadAction<{ hubId: string }>) => undefined,
    colorDetected: (_state, _action: PayloadAction<{ hubId: string; color: Color }>) => undefined,
    setColorSensor: (state, action: PayloadAction<{ hubId: string; color: Color }>) => {
      const { hubId, color } = action.payload;
      state[hubId as HubUUID].detectedColors.push(color);
    },
    setDetectedColorsPair: (
      state,
      action: PayloadAction<{ hubId: string; colorPair: (Color | undefined)[] }>
    ) => {
      const { hubId, colorPair } = action.payload;
      state[hubId as HubUUID].detectedColorsPairs = colorPair;
    },
  },
});
