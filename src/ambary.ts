import { BaseAmbary } from './base-ambary';
import {
  IAmbaryRecordFilter,
  IAmbaryRecord,
  IAmbaryCondition,
  IAmbaryOptions,
  IAmbarySetOptions,
} from './interfaces';

export class Ambary extends BaseAmbary {
  private conditionHandlersMap = {
    string: this.regExpHandler.bind(this),
    object: this.conditionHandler.bind(this),
  };
  private transformers = [];

  constructor(model: Record<string, any> = {}, options?: IAmbaryOptions) {
    super(model, options);
    super.makeIndex();
  }

  set(options: IAmbarySetOptions) {
    super.set(options);
    this.addItemToIndex(this.makeAmbaryRecord(options));
  }

  get(fullPath: string) {
    return super.get(fullPath);
  }

  has(fullPath: string) {
    return super.has(fullPath);
  }

  find(condition: string | IAmbaryCondition) {
    const handler = this.conditionHandlersMap[typeof condition];
    return this.getIndexIterator().filter((item) => handler(condition, item));
  }

  findOne(condition: string | IAmbaryCondition) {
    const handler = this.conditionHandlersMap[typeof condition];
    return this.getIndexIterator().find((item) => handler(condition, item));
  }

  pipe(dist: Ambary) {
    for (const item of this.getIndexIterator()) {
      dist.set(this.applyTransformers({ ...item }));
    }

    return dist;
  }

  transform(
    condition: IAmbaryRecordFilter,
    action: (item: IAmbaryRecord, ambary?: Ambary) => any,
  ) {
    this.transformers.push({ condition, action });

    return this;
  }

  private regExpHandler(stringPath: string, item: IAmbaryRecord) {
    return new RegExp(stringPath).test(item.fullPath);
  }

  private conditionHandler(condition: IAmbaryCondition, item: IAmbaryRecord) {
    return this.matchModel(condition, item);
  }

  private applyTransformers(item: IAmbaryRecord): IAmbaryRecord {
    for (const transformer of this.transformers.filter(
      this.transformerFilter(item),
    )) {
      item.value = transformer.action(item);
    }

    return item;
  }

  private transformerFilter(item: IAmbaryRecord) {
    return ({ condition }) => {
      return this.matchModel(condition, item);
    };
  }
}
