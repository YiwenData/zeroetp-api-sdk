import moment from 'moment';
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
  if ('groupby' in logicform || 'operator' in logicform) {
    return false;
  }

  if (logicform.preds) {
    for (const predItem of logicform.preds) {
      if (typeof predItem !== 'string') {
        return false;
      }
    }
  }

  return true;
};

// getMinTimeGranularity用到了从小到大的逻辑，这个顺序不能改
export const getSupportedTimeWindows = () => {
  return ['hour', 'day', 'week', 'month', 'quarter', 'year'];
};

export const isRelativeDateForm = (dateValue: any) => {
  if (typeof dateValue !== 'object') return false;

  if ('$offset' in dateValue) {
    return true;
  }
  const tws = getSupportedTimeWindows();

  // eslint-disable-next-line no-restricted-syntax
  for (const tw of tws) {
    if (tw in dateValue) return true;
  }

  return false;
};

export const getMinTimeGranularity = (dateValue: any) => {
  // 这里假设了tws从小到大排序
  const tws = getSupportedTimeWindows();

  if (isRelativeDateForm(dateValue)) {
    for (const tw of tws) {
      if (tw in dateValue) return tw;
    }
  } else {
    for (const tw of tws.reverse()) {
      const twFormatString = formatStringForTimeWindow(tw);
      const start = moment(dateValue.$gte);
      const end = moment(dateValue.$lte);

      let twNormed: any = tw === 'week' ? 'isoWeek' : tw;

      if (
        start.format(twFormatString) === end.format(twFormatString) &&
        start.format('YYYYMMDDHHmmss') ===
          moment(start).startOf(twNormed).format('YYYYMMDDHHmmss') &&
        end.format('YYYYMMDDHHmmss') ===
          moment(end).endOf(twNormed).format('YYYYMMDDHHmmss')
      ) {
        return tw;
      }
    }
  }

  return null;
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
      if (twToSet === 'day') {
        twToSet = 'date';
      }

      if (twToSet === 'month') {
        // moment的month从0开始
        baseDate.set(twToSet, value[tw] - 1);
      } else {
        baseDate.set(twToSet, value[tw]);
      }
    }
  }

  if ('$offset' in value) {
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

  if (granuality === 'week') granuality = 'isoWeek';

  return {
    $gte: baseDate.startOf(granuality).toDate(),
    $lte: baseDate.endOf(granuality).toDate(),
  };
};

function formatStringForTimeWindow(tw: string) {
  if (tw === 'year') {
    return 'YYYY';
  } else if (tw === 'quarter') {
    return 'YYYY[Q]Q';
  } else if (tw === 'month') {
    return 'YYYY-MM';
  } else if (tw === 'week') {
    return 'GGGG[W]WW';
  } else if (tw === 'day') {
    return 'YYYY-MM-DD';
  } else if (tw === 'hour') {
    return 'YYYY-MM-DD HH点';
  } else if (tw === 'toHour') {
    return 'HH点';
  } else if (tw === 'toDayOfWeek') {
    return '周E';
  }

  throw new Error('[formatStringForTimeWindow]错误的tw参数');
}

/**
 *
 * @param logicform
 * @param timeOffsetQuery 带上日期字段的offset结构，只允许带一个key
 */
export const getLogicformByTimeOffset = (
  logicform: LogicformType,
  timeOffsetQuery: any
) => {
  const newLF = JSON.parse(JSON.stringify(logicform));
  const [timeKey] = Object.keys(timeOffsetQuery);
  const [offsetLevel] = Object.keys(timeOffsetQuery[timeKey].$offset);

  if (!newLF.query) newLF.query = {};
  if (!newLF.query[timeKey]) {
    newLF.query = timeOffsetQuery;
    return newLF;
  }

  if (isRelativeDateForm(newLF.query[timeKey])) {
    if (!newLF.query[timeKey].$offset) {
      // 如果RelativeDateForm不包含offset本身的粒度，那么返回null；
      // TODO：其实是应该是大于offset本身的粒度，那么返回null；
      if (!(offsetLevel in newLF.query[timeKey])) {
        return null;
      }

      newLF.query[timeKey].$offset = timeOffsetQuery[timeKey].$offset;
      return newLF;
    }

    if (offsetLevel in newLF.query[timeKey].$offset) {
      newLF.query[timeKey].$offset[offsetLevel] +=
        timeOffsetQuery[timeKey].$offset[offsetLevel];
    } else {
      return null;
    }

    return newLF;
  }

  if (isRelativeDateForm(newLF.query[timeKey].$gte)) {
    newLF.query[timeKey].$gte = normaliseRelativeDateForm(
      newLF.query[timeKey].$gte
    ).$gte;
  }
  if (isRelativeDateForm(newLF.query[timeKey].$lte)) {
    newLF.query[timeKey].$lte = normaliseRelativeDateForm(
      newLF.query[timeKey].$lte
    ).$lte;
  }

  // 如果时间范围和offset的时间范围不一致，那么不能做时间偏移
  const formatString = formatStringForTimeWindow(offsetLevel);
  if (
    moment(newLF.query[timeKey].$gte).format(formatString) !==
    moment(newLF.query[timeKey].$lte).format(formatString)
  ) {
    return null;
  }

  // 不是RelativeDateForm，麻烦点
  for (const offsetKey of Object.keys(timeOffsetQuery[timeKey].$offset)) {
    const offsetValue = timeOffsetQuery[timeKey].$offset[offsetKey];
    newLF.query[timeKey].$gte = moment(newLF.query[timeKey].$gte)
      .add(offsetValue, offsetKey)
      .toDate();
    newLF.query[timeKey].$lte = moment(newLF.query[timeKey].$lte)
      .add(offsetValue, offsetKey)
      .toDate();
  }
  return newLF;
};

/**
 * 会修改传入的logicform，把groupby给normalise一下。
 * @param logicform
 */
export const normaliseGroupby = (logicform: LogicformType) => {
  if (!logicform.groupby) return;

  if (typeof logicform.groupby === 'string') {
    logicform.groupby = [{ _id: logicform.groupby }];
  }

  if (!Array.isArray(logicform.groupby)) {
    logicform.groupby = [logicform.groupby];
  }

  for (let i = 0; i < logicform.groupby.length; i++) {
    const element = logicform.groupby[i];

    if (typeof element === 'string') {
      logicform.groupby[i] = { _id: element };
    }
  }
};
