export type Constructor<
  T = object,
  A extends any[] = any[],
  Static = {}
> = (new (...a: A) => T) & Static;

export interface IAmbaryRecord {
  key: string;
  value: any;
  path: string[];
  type: string;
  group: 'model' | 'value';
  constructor: Constructor;
  fullPath: string;
}

export interface IAmbaryRecordFilter {
  key?: string;
  value?: any;
  path?: string[];
  type?: string;
  group?: 'model' | 'value';
  fullPath?: string;
}

export interface IAmbaryCondition {
  type?: string;
  key?: string;
  value?: any;
  fullPath?: string;
}

export interface IAmbaryOptions {
  index: Array<'value' | 'model'>;
}

export interface IAmbarySetOptions {
  key: string;
  value: any;
  path: string[];
  Constructor?: Constructor;
}
