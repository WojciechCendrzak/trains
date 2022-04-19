import { omitBy } from 'lodash';
import { ColorChain, getColorByName, getColorName } from '../hub/hub.model';

export const getZoneKey = (colors: ColorChain) =>
  colors.map((c) => (c !== undefined ? getColorName(c) : '_')).join('.');

export const mapZoneKeyToColor = (zoneKey: string) => {
  const parts = zoneKey.split('.');
  const lastPart = parts[parts.length - 1];
  return getColorByName(lastPart);
};

export interface ZoneHub {
  hub: string;
  key: string;
}

export type ZoneHubMap = Record<ZoneKey, HubKey>;
export type ZoneKey = string;
export type HubKey = string;

export const zoneControl = (whoBloks: ZoneHubMap, whoWaits: ZoneHubMap, zone: ZoneHub) => {
  let res = {
    whoBloks: { ...whoBloks },
    whoWaits: { ...whoWaits },
    toRun: [] as ZoneHub[],
    toStop: [] as HubKey[],
    onZoneChange: [] as ZoneHub[],
  };

  // skip when I enter zone blocked by me - circular zone or duplicated zone
  if (iAmBloking(whoBloks, zone)) {
    return res;
  }

  // can not enter
  if (isBlocked(whoBloks, zone) && !iAmBloking(whoBloks, zone)) {
    res.whoWaits = wait(whoWaits, zone);
    res.toStop.push(zone.hub);
    return res;
  }

  // can enter
  if (!isBlocked(whoBloks, zone)) {
    res = blockZoneRecursive(
      res.whoBloks,
      res.whoWaits,
      zone,
      res.toRun,
      res.toStop,
      res.onZoneChange
    );

    return res;
  }

  return res;
};

const blockZoneRecursive = (
  whoBloks: ZoneHubMap,
  whoWaits: ZoneHubMap,
  zone: ZoneHub,
  toRun: ZoneHub[],
  toStop: HubKey[],
  onZoneChange: ZoneHub[]
) => {
  let res = {
    whoBloks: { ...whoBloks },
    whoWaits: { ...whoWaits },
    toRun: [...toRun],
    toStop: [...toStop],
    onZoneChange: [...onZoneChange],
  };

  res.whoBloks = unBlockAllMyZones(whoBloks, zone);
  res.whoBloks = blockZone(res.whoBloks, zone);
  res.onZoneChange.push(zone);

  const zoneBlockedByMe = getZoneKeyBlockedByMe(whoBloks, zone);
  const waitingHub = zoneBlockedByMe && whoWaits[zoneBlockedByMe];

  if (zoneBlockedByMe && waitingHub) {
    res.whoWaits = unWait(whoWaits, waitingHub);
    res.toRun.push({ hub: waitingHub, key: zoneBlockedByMe });
    res = blockZoneRecursive(
      res.whoBloks,
      res.whoWaits,
      {
        key: zoneBlockedByMe,
        hub: waitingHub,
      },
      res.toRun,
      res.toStop,
      res.onZoneChange
    );
  }

  return res;
};

export const isBlocked = (whoBloks: ZoneHubMap, zone: ZoneHub) => !!whoBloks[zone.key];
export const iAmBloking = (whoBloks: ZoneHubMap, zone: ZoneHub) => whoBloks[zone.key] === zone.hub;

export const blockZone = (whoBloks: ZoneHubMap, zone: ZoneHub) => ({
  ...whoBloks,
  [zone.key]: zone.hub,
});

export const wait = (whoWaits: ZoneHubMap, zone: ZoneHub) => ({
  ...whoWaits,
  [zone.key]: zone.hub,
});

export const getZoneKeyBlockedByMe = (whoBlocks: ZoneHubMap, zone: ZoneHub) =>
  Object.entries(whoBlocks).find(([_, hubKye]) => hubKye === zone.hub)?.[0];

export const unBlockAllMyZones = (whoBloks: ZoneHubMap, zone: ZoneHub) =>
  omitBy(whoBloks, (hubKye) => hubKye === zone.hub);

export const unWait = (whoWaits: ZoneHubMap, waitingHub: HubKey) =>
  omitBy(whoWaits, (hubKye) => hubKye === waitingHub);
