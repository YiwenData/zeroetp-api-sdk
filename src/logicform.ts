import moment from 'moment';
import { SchemaType, findPropByName, getNameProperty } from './schema';

export interface PredItemObjectType {
  pred?: string | PredItemObjectType;
  operator: string;
  name?: string;
  query?: {
    [key: string]: any;
  };
  type?: string; // 当operator为sql的时候会需要type
}

export declare type PredItemType =
  | string
  | PredItemObjectType
  | PredItemObjectType[];
export interface LogicformType {
  schema?: string;
  schemaName?: string;
  query?: any;
  total?: number;
  sort?: object;
  limit?: number;
  skip?: number;
  preds?: PredItemType[];
  field?: string;
  name?: string;
  operator?: string;
  pred?: PredItemType;
  groupby?: string | any;
  entity?: any; // 这个是custom function会出现的
  having?: object;
  populate?: string[];
  expands?: string[]; // 对若干个子字段进行entity的展开。
  close_default_query?: boolean; // 是否不用default_query
  children?: LogicformType[];
  _role?: string;
}

export const isSimpleQuery = (logicform: LogicformType) => {
  if ('groupby' in logicform || 'operator' in logicform) {
    return false;
  }

  if (logicform.preds) {
    const stringedPred = JSON.stringify(logicform.preds);
    if (stringedPred.indexOf('"operator":') > 0) {
      return false;
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

/**
 * 逻辑是这样的。
 * TODO：写testcase
 * groupby: "商品_分类"，从’单品‘开始下钻   ->  query:{商品_分类:'单品'}, groupby: "商品",
 * 如果是多维groupby，按照第一个groupby去下钻
 * @param logicform
 * @param schema
 * @param groupbyItem
 * @returns new logicform
 */
export const drilldownLogicform = (
  logicform: LogicformType,
  schema: SchemaType,
  groupbyItem: any,
  downHierarchy?: string
) => {
  const debug = false;
  if (debug) {
    console.log('input logicform');
    console.log(JSON.stringify(logicform));
  }

  if (!logicform.groupby) return null; //必须有groupby才能下钻
  const newLF: LogicformType = JSON.parse(JSON.stringify(logicform));
  normaliseGroupby(newLF);
  if (!newLF.query) newLF.query = {};

  // 一般来说，__开头的，是前端自己添加的一些辅助行。例如汇总行之类的。
  if (
    (typeof groupbyItem === 'string' && groupbyItem.startsWith('__')) ||
    (typeof groupbyItem === 'object' && groupbyItem._id.startsWith('__'))
  ) {
    return null;
  }

  // 获取下一层
  const groupbyProp = findPropByName(schema, newLF.groupby[0]._id);
  if (!groupbyProp) {
    console.error(
      `schema: ${schema._id} 中未找到groupbyProp：${newLF.groupby[0]._id}`
    );
    return null;
  }

  if (newLF.groupby[0].level) {
    const hierarchy: any[] = groupbyProp.schema.hierarchy;

    const thisLevelIndex = hierarchy.findIndex(
      (h) => h.name === newLF.groupby[0].level
    );
    if (thisLevelIndex < hierarchy.length - 1) {
      let drilldownLevel = 1;
      let groupbyItemID = groupbyItem._id;

      // 特殊逻辑，对于geo来说，直辖市直接下钻2级(重庆市除外，重庆市就算是直辖市，也有两个子分区)
      if (groupbyProp.schema._id === 'geo') {
        if (newLF.groupby[0].level === '省市') {
          if (
            groupbyItemID.endsWith('31') ||
            groupbyItemID.endsWith('11') ||
            groupbyItemID.endsWith('12')
          ) {
            // 4个直辖市判断
            drilldownLevel = 2;
            groupbyItemID += '01';
          }
        }
      }

      const nameProp = getNameProperty(groupbyProp.schema);
      newLF.query[newLF.groupby[0]._id] = {
        schema: groupbyProp.schema._id,
        operator: '$ent',
        field: nameProp.name,
        name: groupbyItem[`${newLF.groupby[0]._id}(${newLF.groupby[0].level})`][
          nameProp.name
        ],
      };
      newLF.groupby[0].level = hierarchy[thisLevelIndex + drilldownLevel].name;

      if (debug) {
        console.log('output logicform');
        console.log(JSON.stringify(newLF));
      }
      return newLF;
    }
  } else {
    if (downHierarchy || groupbyProp.hierarchy?.down) {
      const nextLevel = downHierarchy || groupbyProp.hierarchy?.down;
      newLF.query = {
        ...newLF.query,
      };
      newLF.query[newLF.groupby[0]._id] = groupbyItem._id;
      const groupbyChain = newLF.groupby[0]._id.split('_');
      groupbyChain.pop();
      if (nextLevel === '_id') {
        newLF.groupby[0] = groupbyChain[0];
      } else {
        newLF.groupby[0] = [...groupbyChain, nextLevel].join('_');
      }

      // 在这里change一下sort
      if (newLF.sort) {
        const newSort: any = {};

        for (const [k, v] of Object.entries(newLF.sort)) {
          if (k === groupbyProp.name) {
            newSort[
              typeof newLF.groupby[0] === 'string'
                ? newLF.groupby[0]
                : newLF.groupby[0]._id
            ] = v;
          } else {
            newSort[k] = v;
          }
        }

        newLF.sort = newSort;
      }

      if (debug) {
        console.log('output logicform');
        console.log(JSON.stringify(newLF));
      }
      return newLF;
    }
  }

  return null;
};
