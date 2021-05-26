export interface LogicformType {
  schema: string;
  schemaName?: string;
  query?: any;
  total?: number;
  sort?: object;
  limit?: number;
  skip?: number;
  preds?: any[];
  name?: string;
  operator?: string;
  pred?: string;
  groupby?: string | any;
  entity?: any; // 这个是custom function会出现的
  having?: object;
  populate?: string[];
}
