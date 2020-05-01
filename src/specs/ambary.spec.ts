import { Ambary } from '../ambary';

describe('Ambary', () => {
  let ambary: Ambary = null;

  beforeEach(() => {
    ambary = new Ambary({
      level1_1: 'test1',
      level1_2: {
        level2_1: {
          level3_1: 'test2',
          level3_2: 1234,
        },
        level2_2: [
          {
            level4_1: null,
            level4_2: new Ambary({}),
          },
        ],
      },
    });
  });

  it('should be defined', () => {
    expect(ambary).toBeDefined();
  });

  it('should get', () => {
    const result = ambary.get('level1_2.level2_1.level3_1');

    expect(result).toEqual('test2');
  });

  it('should get nothing', () => {
    const result = ambary.get('level1_2.level2_1.level3_3.level4_1');

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

  it('should find by RegExp key', () => {
    const result = ambary.find('level2_1');

    expect(result.length).toEqual(2);
  });

  it('should find by query', () => {
    const result = ambary.find({
      key: 'level3_2',
    });

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual({
      key: 'level3_2',
      value: 1234,
      path: ['level1_2', 'level2_1'],
      type: 'Number',
      group: 'value',
      fullPath: 'level1_2.level2_1.level3_2',
    });
  });

  it('should findOne by RegExp key', () => {
    const result = ambary.findOne('level2_1');

    expect(result).toEqual({
      key: 'level3_1',
      value: 'test2',
      path: ['level1_2', 'level2_1'],
      type: 'String',
      group: 'value',
      fullPath: 'level1_2.level2_1.level3_1',
    });
  });

  it('should findOne by query', () => {
    const result = ambary.findOne({
      key: 'level3_2',
    });

    expect(result).toEqual({
      key: 'level3_2',
      value: 1234,
      path: ['level1_2', 'level2_1'],
      type: 'Number',
      group: 'value',
      fullPath: 'level1_2.level2_1.level3_2',
    });
  });

  it('should copy ambary via pipe', () => {
    const resultAmbary = new Ambary();

    ambary.pipe(resultAmbary);

    expect(resultAmbary.get('level1_2.level2_2.0.level4_1')).toEqual(
      ambary.get('level1_2.level2_2.0.level4_1'),
    );
  });

  it('should transform ambary via pipe', () => {
    const resultAmbary = new Ambary();

    ambary
      .transform({ key: 'level1_1' }, () => 'transformed')
      .pipe(resultAmbary);

    expect(ambary.get('level1_1')).toEqual('test1');
    expect(resultAmbary.get('level1_1')).toEqual('transformed');
    expect(resultAmbary.get('level1_2.level2_1.level3_1')).toEqual('test2');
  });
});
