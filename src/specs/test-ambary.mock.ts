import { BaseAmbary } from '../base-ambary';
import { IAmbarySetOptions } from '../interfaces';

export class TestAmbary extends BaseAmbary {
  constructor(model: any) {
    super(model);
  }

  get(fullPath: string) {
    return super.get(fullPath);
  }

  has(fullPath: string) {
    return super.has(fullPath);
  }

  set(options: IAmbarySetOptions) {
    return super.set(options);
  }

  makeIndex() {
    return super.makeIndex();
  }

  getIndexIterator() {
    return super.getIndexIterator();
  }

  getFromIndex = jest.fn(fullPath => {
    return super.getFromIndex(fullPath);
  });

  getFromModel = jest.fn(fullPath => {
    return super.getFromModel(fullPath);
  });

  matchModel(source: Record<string, any>, base: Record<string, any>) {
    return super.matchModel(source, base);
  }
}
