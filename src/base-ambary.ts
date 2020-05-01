import { IAmbaryRecord, IAmbaryOptions, IAmbarySetOptions } from './interfaces';

export class BaseAmbary {
  private index = new Map<string, IAmbaryRecord>();

  constructor(
    private readonly model: Record<string, any> = {},
    private readonly options: IAmbaryOptions = {
      index: ['value'],
    },
  ) {}

  protected getIndexIterator(): IAmbaryRecord[] {
    return [...this.index.values()];
  }

  protected get(fullPath: string) {
    const item = this.getFromIndex(fullPath);
    return typeof item === 'undefined' ? this.getFromModel(fullPath) : item;
  }

  protected has(fullPath: string) {
    return typeof this.get(fullPath) !== 'undefined';
  }

  protected set({ key, value, path }: IAmbarySetOptions) {
    let parent = this.model;

    for (const pathKey of path) {
      const level = parent[pathKey];

      if (!level) {
        parent[pathKey] = {};
        parent = parent[pathKey];
        continue;
      }

      parent = level;
    }

    parent[key] = value;
  }

  protected makeIndex() {
    for (const item of this.createRecordIterator()) {
      if (this.options.index.includes(item.group)) {
        this.addItemToIndex(item);
      }
    }
  }

  protected addItemToIndex(item: IAmbaryRecord): void {
    const key = [...item.path, item.key].join('.');
    this.index.set(key, item);
  }

  protected makeAmbaryRecord({
    key,
    value,
    path,
  }: IAmbarySetOptions): IAmbaryRecord {
    const type = this.getType(value);
    const group = this.getGroup(type);

    return {
      key,
      value,
      path,
      type,
      group,
      fullPath: [...path, key].join('.'),
    };
  }

  protected matchModel(source: Record<string, any>, base: Record<string, any>) {
    for (const key of Object.keys(source)) {
      const value = source[key];

      if (value !== base[key]) {
        return false;
      }
    }

    return true;
  }

  protected getFromModel(fullPath: string) {
    const path = fullPath.split('.');
    let result = this.model;

    for (const key of path) {
      result = result?.[key];
    }

    return result;
  }

  protected createRecordIterator = function*(
    model: Record<string, any> = this.model,
    path = [],
  ) {
    for (const key of Object.keys(model)) {
      const value = model[key];

      const item = this.makeAmbaryRecord({ key, value, path });
      yield item;

      if (item.group === 'model') {
        yield* this.createRecordIterator(value, [...path, key]);
      }
    }
  };

  protected getFromIndex(fullPath: string) {
    return this.index.get(fullPath)?.value;
  }

  private getType(value: any) {
    return (
      value?.constructor?.name ||
      {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1]
    );
  }

  private getGroup(type: string) {
    return ['Object', 'Array'].includes(type) ? 'model' : 'value';
  }

  toJSON() {
    return this.model;
  }
}
