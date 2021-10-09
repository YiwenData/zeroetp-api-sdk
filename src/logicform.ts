import moment from "moment";
export interface LogicformType {
  schema?: string;
  schemaName?: string;
  query?: any;
  total?: number;
  sort?: object;
  limit?: number;
  skip?: number;
  preds?: any[];
  field?: string;
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

export const getSupportedTimeWindows = () => {
  return ["hour", "day", "week", "month", "quarter", "year"];
};

export const isRelativeDateForm = (dateValue: any) => {
  if (typeof dateValue !== "object") return false;

  if ("$offset" in dateValue) {
    return true;
  }
  const tws = getSupportedTimeWindows();

  // eslint-disable-next-line no-restricted-syntax
  for (const tw of tws) {
    if (tw in dateValue) return true;
  }

  return false;
};

export const normaliseRelativeDateForm = (value: any) => {
  // 时间，year + offset形态
  const baseDate = moment();
  const tws = getSupportedTimeWindows();
  let granuality: any;
  // eslint-disable-next-line no-restricted-syntax
  // 这里的tw必须从大到小，不然setDate会有问题
  for (let index = tws.length - 1; index >= 0; index -= 1) {
    const tw = tws[index];
    if (tw in value) {
      granuality = tw;

      // sb moment，还要用个date，草泥马
      let twToSet: any = tw;
      if (twToSet === "day") {
        twToSet = "date";
      }

      if (twToSet === "month") {
        // moment的month从0开始
        baseDate.set(twToSet, value[tw] - 1);
      } else {
        baseDate.set(twToSet, value[tw]);
      }
    }
  }

  if ("$offset" in value) {
    // 相对时间的一种表达
    const v = value.$offset;
    // eslint-disable-next-line no-restricted-syntax
    for (const tw of tws) {
      if (tw in v) {
        if (!granuality || tws.indexOf(tw) < tws.indexOf(granuality)) {
          granuality = tw;
        }

        baseDate.add(v[tw], tw);
      }
    }
  }

  if (granuality === "week") granuality = "isoWeek";

  return {
    $gte: baseDate.startOf(granuality).toDate(),
    $lte: baseDate.endOf(granuality).toDate(),
  };
};

/**
 * 会修改传入的logicform，把groupby给normalise一下。
 * @param logicform
 */
export const normaliseGroupby = (logicform: LogicformType) => {
  if (!logicform.groupby) return;

  if (typeof logicform.groupby === "string") {
    logicform.groupby = [{ _id: logicform.groupby }];
  }

  if (!Array.isArray(logicform.groupby)) {
    logicform.groupby = [logicform.groupby];
  }

  for (let i = 0; i < logicform.groupby.length; i++) {
    const element = logicform.groupby[i];

    if (typeof element === "string") {
      logicform.groupby[i] = [{ _id: element }];
    }
  }
};
