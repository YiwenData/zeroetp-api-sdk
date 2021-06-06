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
  close_default_query?: boolean; // 是否不用default_query
}

export const isSimpleQuery = (logicform: LogicformType) => {
  if ("groupby" in logicform || "operator" in logicform) {
    return false;
  }

  if (logicform.preds) {
    for (const predItem of logicform.preds) {
      if (typeof predItem !== "string") {
        return false;
      }
    }
  }

  return true;
};
