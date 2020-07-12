import { TestAmbary } from './test-ambary.mock';

describe('BaseAmbary', () => {
  let ambary: TestAmbary = null;

  beforeEach(() => {
    ambary = new TestAmbary({
      level1_1: 'test1',
      level1_2: {
        level2_1: {
          level3_1: 'test2',
          level3_2: 1234,
        },
        level2_2: [
          {
            level4_1: null,
            level4_2: new TestAmbary({}),
          },
        ],
      },
    });
  });

  it('should be defined', () => {
    expect(ambary).toBeDefined();
  });

  it('should get from model', () => {
    const result = ambary.get('level1_2.level2_1.level3_1');

    expect(ambary.getFromIndex).toBeCalledWith('level1_2.level2_1.level3_1');
    expect(ambary.getFromModel).toBeCalledWith('level1_2.level2_1.level3_1');
    expect(result).toEqual('test2');
  });

  it('should get from index', () => {
    ambary.makeIndex();
    const result = ambary.get('level1_2.level2_1.level3_1');

    expect(ambary.getFromIndex).toBeCalledWith('level1_2.level2_1.level3_1');
    expect(ambary.getFromModel).not.toBeCalled();
    expect(result).toEqual('test2');
  });

  it('should get nothing', () => {
    const result = ambary.get('level1_2.level2_1.level3_3.level4_1');

    expect(ambary.getFromIndex).toBeCalledWith(
      'level1_2.level2_1.level3_3.level4_1',
    );
    expect(ambary.getFromModel).toBeCalledWith(
      'level1_2.level2_1.level3_3.level4_1',
    );
    expect(result).toEqual(undefined);
  });

  it('should has item', () => {
    expect(ambary.has('level1_2.level2_1.level3_1')).toBeTruthy();
  });

  it('should not has item', () => {
    expect(ambary.has('level1_2.level2_1.level4_1')).toBeFalsy();
  });

  it('should set ambary item', () => {
    ambary.set({
      key: 'level3_3',
      value: 'test set',
      path: ['level1_2', 'level2_1'],
    });

    const result = ambary.get('level1_2.level2_1.level3_3');
    expect(result).toEqual('test set');
  });

  it('should set ambary item to non-existing parent', () => {
    ambary.set({
      key: 'level4_1',
      value: 'test set',
      path: ['level1_2', 'level2_1', 'level3_3'],
    });

    const result = ambary.get('level1_2.level2_1.level3_3.level4_1');
    expect(result).toEqual('test set');
  });

  it('should set ambary item to non-existing parent(Array)', () => {
    ambary.set({
      key: 'level4_1',
      value: 'test set1',
      path: ['[level1_3]', '0', 'level3_1'],
    });

    ambary.set({
      key: 'level4_2',
      value: 'test set2',
      path: ['[level1_3]', '0', 'level3_1'],
    });

    ambary.set({
      key: 'level4_1',
      value: 'test set3',
      path: ['[level1_3]', '0', 'level3_2'],
    });

    const result = ambary.get('level1_3.0.level3_1.level4_1');

    expect(result).toEqual('test set1');
    expect(Array.isArray(ambary.get('level1_3'))).toBeTruthy();
  });

  it('should return index iterator', () => {
    ambary.makeIndex();
    const iterator = ambary.getIndexIterator();

    expect(iterator.length).toEqual(5);
    for (const item of iterator) {
      expect(item.group).toEqual('value');
    }
  });

  it('should match models', () => {
    const src = { test1: 'test' };
    const base = { test: 'test', test1: 'test' };

    expect(ambary.matchModel(src, base)).toBeTruthy();
  });

  it('should not match models', () => {
    const src = { test2: 'test' };
    const base = { test: 'test', test1: 'test' };

    expect(ambary.matchModel(src, base)).toBeFalsy();
  });

  it('should construct empty Ambary', () => {
    const emptyAmbary = new TestAmbary(undefined);

    expect(emptyAmbary).toBeDefined();
  });

  it('should return plain object', () => {
    const ambary = new TestAmbary({});

    expect(ambary.toJSON()).toEqual({});
  });
});
