import { Color } from '../hub/hub.model';
import { canEnter, getZoneKey, HubKey, zoneControl, ZoneKey } from './circle.logic';

describe(canEnter.name, () =>
  test.each`
    semaphore              | id     | zone      | expected
    ${{ blue: undefined }} | ${'1'} | ${'blue'} | ${true}
    ${{ blue: '1' }}       | ${'1'} | ${'blue'} | ${true}
    ${{ blue: '2' }}       | ${'1'} | ${'blue'} | ${false}
  `('$semaphore, $id, $zone -> $expected', ({ semaphore, id, zone, expected }) => {
    expect(canEnter(semaphore, id, zone)).toBe(expected);
  })
);

describe(getZoneKey.name, () =>
  test.each`
    colors                                    | expected
    ${[undefined, undefined, undefined]}      | ${'_._._'}
    ${[undefined, undefined, Color.YELLOW]}   | ${'_._.YELLOW'}
    ${[undefined, Color.WHITE, Color.YELLOW]} | ${'_.WHITE.YELLOW'}
    ${[Color.RED, Color.WHITE, Color.YELLOW]} | ${'RED.WHITE.YELLOW'}
  `('$colors -> $expected', ({ colors, expected }) => {
    expect(getZoneKey(colors)).toBe(expected);
  })
);

// https://stackoverflow.com/questions/33247602/how-do-you-debug-jest-tests
// Debug: JavaScript Debug Terminal

interface TestCase {
  caseName: string;
  whoBloks: Record<ZoneKey, HubKey>;
  whoWaits: Record<ZoneKey, HubKey>;
  zoneDetected: {
    hub: HubKey;
    key: ZoneKey;
  };
  expected: {
    whoBloks: Record<ZoneKey, HubKey>;
    whoWaits: Record<ZoneKey, HubKey>;
    toRun: HubKey[];
    toStop: HubKey[];
  };
}

const nothingBlockedCase: TestCase = {
  caseName: '1.1 - nothing blocked',
  whoBloks: {},
  whoWaits: {},
  zoneDetected: {
    hub: '1',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWaits: {},
    toRun: [],
    toStop: [],
  },
};

const otherZoneBlockedCase: TestCase = {
  caseName: '1.2 - other zone is blocked',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '2',
    key: 'B',
  },
  expected: {
    whoBloks: { A: '1', B: '2' },
    whoWaits: {},
    toRun: [],
    toStop: [],
  },
};

const selfBlockedCase: TestCase = {
  caseName: '1.3 - ignore same zone detected as already blocked by me',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '1',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWaits: {},
    toRun: [],
    toStop: [],
  },
};

const waitForBlockedZoneCase: TestCase = {
  caseName: '2.1 - when try enter zone but is blocked',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '2',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWaits: { A: '2' },
    toRun: [],
    toStop: ['2'],
  },
};

const leaveZoneCase: TestCase = {
  caseName: '3.1 - when leave zone',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '1',
    key: 'B',
  },
  expected: {
    whoBloks: { B: '1' },
    whoWaits: {},
    toRun: [],
    toStop: [],
  },
};

const leaveZoneAndUnBlockCase: TestCase = {
  caseName: '3.2 - leave zone and unblok waiter',
  whoBloks: { A: '1' },
  whoWaits: { A: '2' },
  zoneDetected: {
    hub: '1',
    key: 'B',
  },
  expected: {
    whoBloks: { A: '2', B: '1' },
    whoWaits: {},
    toRun: ['2'],
    toStop: [],
  },
};

const threeTrains1: TestCase = {
  caseName: '4.1 - 3 trains are running 2 detect A',
  whoBloks: { A: '1', B: '2', C: '3' },
  whoWaits: { A: '2' },
  zoneDetected: {
    hub: '2',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1', B: '2', C: '3' },
    whoWaits: { A: '2' },
    toRun: [],
    toStop: ['2'],
  },
};

const threeTrains2: TestCase = {
  caseName: '4.2 - First running Second waiting third enter B',
  whoBloks: { A: '1', B: '2', C: '3' },
  whoWaits: { A: '2' },
  zoneDetected: {
    hub: '3',
    key: 'B',
  },
  expected: {
    whoBloks: { A: '1', B: '2', C: '3' },
    whoWaits: { A: '2', B: '3' },
    toRun: [],
    toStop: ['3'],
  },
};

const threeTrains3: TestCase = {
  caseName: '4.3 - First enter D Second waiting third enter waiting',
  whoBloks: { A: '1', B: '2', C: '3' },
  whoWaits: { A: '2', B: '3' },
  zoneDetected: {
    hub: '1',
    key: 'D',
  },
  expected: {
    whoBloks: { D: '1', A: '2', B: '2', C: '3' },
    whoWaits: { B: '3' },
    toRun: ['2'],
    toStop: [],
  },
};

const oneZoneOneTrain: TestCase = {
  caseName: '5.1 - One zone one train',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '1',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWaits: {},
    toRun: [],
    toStop: [],
  },
};

const oneZoneTwoTrain: TestCase = {
  caseName: '5.2 - One zone tow train',
  whoBloks: { A: '1' },
  whoWaits: {},
  zoneDetected: {
    hub: '2',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWaits: { A: '2' },
    toRun: [],
    toStop: ['2'],
  },
};

const twoZonesTwoTrain: TestCase = {
  caseName: '5.3 - Two zone tow train',
  whoBloks: { A: '1', B: '2' },
  whoWaits: {},
  zoneDetected: {
    hub: '1',
    key: 'B',
  },
  expected: {
    whoBloks: { A: '1', B: '2' },
    whoWaits: { B: '1' },
    toRun: [],
    toStop: ['1'],
  },
};

const twoZonesTwoTrain2: TestCase = {
  caseName: '5.4 - Two zone tow train',
  whoBloks: { A: '1', B: '2' },
  whoWaits: { B: '1' },
  zoneDetected: {
    hub: '2',
    key: 'A',
  },
  expected: {
    whoBloks: { A: '1', B: '2' },
    whoWaits: { B: '1', A: '2' },
    toRun: [],
    toStop: ['2'],
  },
};

describe.each([
  //
  nothingBlockedCase,
  otherZoneBlockedCase,
  selfBlockedCase,
  waitForBlockedZoneCase,
  leaveZoneCase,
  leaveZoneAndUnBlockCase,
  threeTrains1,
  threeTrains2,
  threeTrains3,
  oneZoneOneTrain,
  oneZoneTwoTrain,
  twoZonesTwoTrain,
  twoZonesTwoTrain2,
])('', (testDate) => {
  describe(`${testDate.caseName} ${JSON.stringify(testDate)}`, () => {
    const { whoBloks, whoWaits: whoWait, zoneDetected, expected } = testDate;
    const newState = zoneControl(whoBloks, whoWait, zoneDetected);

    test('-> whoBloks', () => expect(newState.whoBloks).toStrictEqual(expected.whoBloks));
    test('-> whoWaits', () => expect(newState.whoWaits).toStrictEqual(expected.whoWaits));
    test('-> toRun', () => expect(newState.toRun).toStrictEqual(expected.toRun));
    test('-> toStop', () => expect(newState.toStop).toStrictEqual(expected.toStop));
  });
});
