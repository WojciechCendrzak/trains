import { Color } from '../hub/hub.model';
import { canEnter, getZoneKey } from './circle.logic';

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
