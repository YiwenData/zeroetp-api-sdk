export interface LogicformType {
  schema?: string;
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
  expands?: string[]; // 对若干个子字段进行entity的展开。
  close_default_query?: boolean; // 是否不用default_query
  children?: LogicformType[];
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
