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

// ${{ Z1: '1' }} | ${{}}   | ${{ hub: '1', key: 'Z2' }} | ${{ Z1: '2' }}   | ${{}}           | ${['1']} | ${[]}

interface TestCase {
  caseName: string;
  whoBloks: Record<ZoneKey, HubKey>;
  whoWait: Record<ZoneKey, HubKey>;
  zoneDetected: {
    key: ZoneKey;
    hub: HubKey;
  };
  expected: {
    whoBloks: Record<ZoneKey, HubKey>;
    whoWait: Record<ZoneKey, HubKey>;
    toRun: HubKey[];
    toStop: HubKey[];
  };
}

const nothingBlockedCase: TestCase = {
  caseName: '1.1 - nothing blocked',
  whoBloks: {},
  whoWait: {},
  zoneDetected: {
    key: 'A',
    hub: '1',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWait: {},
    toRun: [],
    toStop: [],
  },
};

const selfBlockedCase: TestCase = {
  caseName: '1.2 - ignore same zone detected as already blocked by me',
  whoBloks: { A: '1' },
  whoWait: {},
  zoneDetected: {
    key: 'A',
    hub: '1',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWait: {},
    toRun: [],
    toStop: [],
  },
};

const waitForBlockedZoneCase: TestCase = {
  caseName: '2.1 - when try enter zone but is blocked',
  whoBloks: { A: '1' },
  whoWait: {},
  zoneDetected: {
    key: 'A',
    hub: '2',
  },
  expected: {
    whoBloks: { A: '1' },
    whoWait: { A: '2' },
    toRun: [],
    toStop: ['2'],
  },
};

const leaveZoneCase: TestCase = {
  caseName: '3.1 - when leave zone',
  whoBloks: { A: '1' },
  whoWait: {},
  zoneDetected: {
    key: 'B',
    hub: '1',
  },
  expected: {
    whoBloks: { B: '1' },
    whoWait: {},
    toRun: [],
    toStop: [],
  },
};

describe.each([
  //
  nothingBlockedCase,
  selfBlockedCase,
  waitForBlockedZoneCase,
  leaveZoneCase,
])('', (testDate) => {
  describe(`${testDate.caseName} ${JSON.stringify(testDate)}`, () => {
    const { whoBloks, whoWait, zoneDetected, expected } = testDate;
    const newState = zoneControl(whoBloks, whoWait, zoneDetected);

    test('whoBloksExpected', () => expect(newState.whoBloks).toStrictEqual(expected.whoBloks));
    test('whoWaitExpected', () => expect(newState.whoWait).toStrictEqual(expected.whoWait));
    test('toRun', () => expect(newState.toRun).toStrictEqual(expected.toRun));
    test('toStop', () => expect(newState.toStop).toStrictEqual(expected.toStop));
  });
});

// describe(zoneControl.name, () =>
//   describe.each`
//     whoBloks       | whoWait | zone                       | whoBloksExpected | whoWaitExpected | toRun    | toStop
//     ${{}}          | ${{}}   | ${{ hub: '1', key: 'Z1' }} | ${{ Z1: '1' }}   | ${{}}           | ${['1']} | ${[]}
//     ${{ Z1: '1' }} | ${{}}   | ${{ hub: '1', key: 'Z1' }} | ${{ Z1: '1' }}   | ${{}}           | ${['1']} | ${[]}
//     ${{ Z1: '1' }} | ${{}}   | ${{ hub: '2', key: 'Z1' }} | ${{ Z1: '1' }}   | ${{ Z1: '2' }}  | ${[]}    | ${['2']}
//   `(
//     'whoBloks: $whoBloks, whoWait: $whoWait, zone: $zone -> whoBloksExp $whoBloksExpected, whoWaitExp $whoWaitExpected, toRun $toRun, toStop: $toStop',
//     ({ whoBloks, whoWait, zone, whoBloksExpected, whoWaitExpected, toRun, toStop }) => {
//       const newState = zoneControl(whoBloks, whoWait, zone);

//       test('whoBloksExpected', () => expect(newState.whoBloks).toStrictEqual(whoBloksExpected));
//       test('whoWaitExpected', () => expect(newState.whoWait).toStrictEqual(whoWaitExpected));
//       test('toRun', () => expect(newState.toRun).toStrictEqual(toRun));
//       test('toStop', () => expect(newState.toStop).toStrictEqual(toStop));
//     }
//   )
// );
