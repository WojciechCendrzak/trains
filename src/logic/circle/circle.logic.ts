import { omitBy } from 'lodash';
import { ColorChain, getColorName } from '../hub/hub.model';
import { Semaphores } from './circle.slice';

export const canEnter = (semaphores: Semaphores, hubId: string, zoneKey: string) =>
  !semaphores[zoneKey] || semaphores[zoneKey] === hubId;

export const getZoneKey = (colors: ColorChain) =>
  colors.map((c) => (c !== undefined ? getColorName(c) : '_')).join('.');

interface Zone {
  hub: string;
  key: string;
}

export type ZoneHubMap = Record<ZoneKey, HubKey>;
export type ZoneKey = string;
export type HubKey = string;

export const zoneControl = (whoBloks: ZoneHubMap, whoWait: ZoneHubMap, zone: Zone) => {
  const res = {
    whoBloks: { ...whoBloks },
    whoWait: { ...whoWait },
    toRun: [] as HubKey[],
    toStop: [] as HubKey[],
  };

  // skip when I enter zone blocked by me - circular zone or duplicated zone
  if (iAmBloking(whoBloks, zone)) {
    return res;
  }
  // can enter
  if (!isBlocked(whoBloks, zone)) {
    res.whoBloks = unBlockAllMyZones(whoBloks, zone);
    res.whoBloks = block(res.whoBloks, zone);
    return res;
  }

  // can not enter
  if (isBlocked(whoBloks, zone) && !iAmBloking(whoBloks, zone)) {
    res.whoWait = wait(whoWait, zone);
    res.toStop.push(zone.hub);
    return res;
  }

  return res;
};

export const isBlocked = (whoBloks: ZoneHubMap, zone: Zone) => !!whoBloks[zone.key];
export const iAmBloking = (whoBloks: ZoneHubMap, zone: Zone) => whoBloks[zone.key] === zone.hub;

export const block = (whoBloks: ZoneHubMap, zone: Zone) => ({
  ...whoBloks,
  [zone.key]: zone.hub,
});

export const wait = (whoWaits: ZoneHubMap, zone: Zone) => ({
  ...whoWaits,
  [zone.key]: zone.hub,
});

export const unBlockAllMyZones = (whoBloks: ZoneHubMap, zone: Zone) =>
  omitBy(whoBloks, (hubKye) => hubKye === zone.hub);
