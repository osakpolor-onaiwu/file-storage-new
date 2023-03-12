export enum SearchType {
    ONE = 'one',
    ALL = 'all',
  }
  
export interface options {
sort?: string | object;
skip?: number;
limit?: number;
}
  
export type optConfig = options;
  