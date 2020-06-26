import { Ambary } from '.';
import { IAmbaryRecord } from './interfaces';

const compareMap = {
  eq: (condition: any, value: any) => condition === value,
  lt: (condition: any, value: any) => condition > value,
  gt: (condition: any, value: any) => condition < value,
  lte: (condition: any, value: any) => condition >= value,
  gte: (condition: any, value: any) => condition <= value,
};

export class Compare {
  match(source: Record<string, any>, conditions: Record<string, any>) {
    const context = new Ambary(source);
    const transformedConditions = this.transformCondition(
      new Ambary(conditions),
    );

    for (const item of transformedConditions.find({})) {
      const toCompare = context.findOne({
        fullPath: item.path.join('.'),
      });

      if (!toCompare || !this.compare(item, toCompare.value)) {
        return false;
      }
    }

    return true;
  }

  private compare(ambaryRecord: IAmbaryRecord, value: any) {
    return compareMap[ambaryRecord.key](ambaryRecord.value, value);
  }

  private transformCondition(condition: Ambary) {
    const result = new Ambary();
    const compareKeys = Object.keys(compareMap);

    for (const item of condition.find({})) {
      if (compareKeys.includes(item.key)) {
        result.set({ ...item });
        continue;
      }

      result.set({
        key: 'eq',
        value: item.value,
        path: [...item.path, item.key],
      });
    }

    return result;
  }
}
