import { StoreState } from '../../app/app.reducers';

export const whoWaitForZoneSelector = (zoneKey: string | undefined) => (state: StoreState) =>
  Object.entries(state.circle.whoWaits)
    .filter(([key]) => key === zoneKey)
    .map(([_, value]) => value);
