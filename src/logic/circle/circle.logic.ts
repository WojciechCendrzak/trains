import { omitBy } from 'lodash';
import { ColorChain, getColorName } from '../hub/hub.model';

export const getZoneKey = (colors: ColorChain) =>
  colors.map((c) => (c !== undefined ? getColorName(c) : '_')).join('.');

interface Zone {
  hub: string;
  key: string;
}

export type ZoneHubMap = Record<ZoneKey, HubKey>;
export type ZoneKey = string;
export type HubKey = string;

export const zoneControl = (whoBloks: ZoneHubMap, whoWaits: ZoneHubMap, zone: Zone) => {
  let res = {
    whoBloks: { ...whoBloks },
    whoWaits: { ...whoWaits },
    toRun: [] as HubKey[],
    toStop: [] as HubKey[],
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
    res = blockZoneRecursive(res.whoBloks, res.whoWaits, zone, res.toRun, res.toStop);

    return res;
  }

  return res;
};

const blockZoneRecursive = (
  whoBloks: ZoneHubMap,
  whoWaits: ZoneHubMap,
  zone: Zone,
  toRun: HubKey[],
  toStop: HubKey[]
) => {
  let res = {
    whoBloks: { ...whoBloks },
    whoWaits: { ...whoWaits },
    toRun: [...toRun],
    toStop: [...toStop],
  };

  res.whoBloks = unBlockAllMyZones(whoBloks, zone);
  res.whoBloks = blockZone(res.whoBloks, zone);

  const zoneBlockedByMe = getZoneKeyBlockedByMe(whoBloks, zone);
  const waitingHub = zoneBlockedByMe && whoWaits[zoneBlockedByMe];

  if (zoneBlockedByMe && waitingHub) {
    res.whoWaits = unWait(whoWaits, waitingHub);
    res.toRun.push(waitingHub);
    res = blockZoneRecursive(
      res.whoBloks,
      res.whoWaits,
      {
        key: zoneBlockedByMe,
        hub: waitingHub,
      },
      res.toRun,
      res.toStop
    );
  }

  return res;
};

export const isBlocked = (whoBloks: ZoneHubMap, zone: Zone) => !!whoBloks[zone.key];
export const iAmBloking = (whoBloks: ZoneHubMap, zone: Zone) => whoBloks[zone.key] === zone.hub;

export const blockZone = (whoBloks: ZoneHubMap, zone: Zone) => ({
  ...whoBloks,
  [zone.key]: zone.hub,
});

export const wait = (whoWaits: ZoneHubMap, zone: Zone) => ({
  ...whoWaits,
  [zone.key]: zone.hub,
});

export const getZoneKeyBlockedByMe = (whoBlocks: ZoneHubMap, zone: Zone) =>
  Object.entries(whoBlocks).find(([_, hubKye]) => hubKye === zone.hub)?.[0];

export const unBlockAllMyZones = (whoBloks: ZoneHubMap, zone: Zone) =>
  omitBy(whoBloks, (hubKye) => hubKye === zone.hub);

export const unWait = (whoWaits: ZoneHubMap, waitingHub: HubKey) =>
  omitBy(whoWaits, (hubKye) => hubKye === waitingHub);
