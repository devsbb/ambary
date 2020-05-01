export interface IAmbaryRecord {
  key: string;
  value: any;
  path: string[];
  type: string;
  group: 'model' | 'value';
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
}
