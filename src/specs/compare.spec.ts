import { Compare } from '../compare';

describe('Compare', () => {
  let compare = null;
  const source = {
    test1: 1,
    test2: {
      test3: 2,
      test4: 1,
    },
    test4: 'test',
    test6: {
      test7: {
        test8: 10,
      },
      test9: 3,
    },
  };

  beforeEach(() => {
    compare = new Compare();
  });

  it('should to be defined', () => {
    expect(compare).toBeDefined();
  });

  it('should match', () => {
    const filter = {
      test1: 1,
      test2: {
        test3: { lt: 3 },
        test4: { gte: 1 },
      },
      test4: 'test',
      test6: {
        test7: {
          test8: { gt: 9 },
        },
        test9: { lte: 3 },
      },
    };

    const result = compare.match(source, filter);

    expect(result).toBeTruthy();
  });

  it('should not match', () => {
    const filter = {
      test1: 1,
      test2: {
        test3: { lt: 3 },
        test4: { gte: 1 },
      },
      test4: 'test',
      test6: {
        test7: {
          test8: { gt: 9 },
        },
        test9: { lte: 2 },
      },
    };

    const result = compare.match(source, filter);

    expect(result).toBeFalsy();
  });
});
