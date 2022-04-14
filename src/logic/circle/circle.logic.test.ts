import { canEnter } from './circle.logic';

describe(canEnter.name, () =>
  test.each`
    semaphore              | id     | color     | expected
    ${{ blue: undefined }} | ${'1'} | ${'blue'} | ${true}
    ${{ blue: '1' }}       | ${'1'} | ${'blue'} | ${true}
    ${{ blue: '2' }}       | ${'1'} | ${'blue'} | ${false}
  `('$semaphore, $id $color -> expected', ({ semaphore, id, color, expected }) => {
    expect(canEnter(semaphore, id, color)).toBe(expected);
  })
);
