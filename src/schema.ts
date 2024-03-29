import { PropertyType } from './property';

interface HierarchyItemType {
  name: string;
  syno?: string[];
  code_length: number;
}
export interface SchemaType {
  _id: string; // 只有在新建是才能选择，无法修改
  name: string;
  syno?: string[];
  type: 'entity' | 'event'; // 只有在新建是才能选择，无法修改
  description?: string;
  properties: PropertyType[]; // 不能在修改schema的时候修改。用另外的接口。
  editable?: boolean; // 前端是否能修改数据
  is_internal?: boolean;
  hierarchy?: HierarchyItemType[];
  use_db_date_as_mtd?: boolean; // 是不是要用数据库里面存在的数据的最后一天作为mtd，qtd，ytd的today的时间
  main_pred?: {
    operator: string;
    name: string;
    pred?: any;
  }; // 用于Alisa，默认的问答pred。有两个作用，一个是sort有_slot的时候，作为默认的pred。第二个是一旦设置了这个，那么在node为非is_schema的时候，把simpleQuery转化成pred计算;
  modality?: {
    detail?: {
      type: 'card' | 'url';
      config?: any;
    };
    list?: {
      type: 'table';
      config?: any;
    };
  }; // 决定在前端展示的模态
  order?: number; // 决定在前端的排序
  tag?: string[]; // 标签，和问答无关
  drilldown?: any[]; // 下钻白名单
}

export function getIDProperty(schema: SchemaType) {
  return schema.properties.find((p: PropertyType) => p.type === 'ID');
}

export function getNameProperty(schema: SchemaType) {
  let nameProp = schema.properties.find(
    (p: PropertyType) => p.is_name || p.ui?.name
  );

  if (!nameProp) {
    nameProp = schema.properties.find((p: PropertyType) => p.type === 'ID');
  }

  if (!nameProp) {
    nameProp = { name: '_id', constraints: { unique: true } } as PropertyType;
  }

  return nameProp;
}

export function getGroupbyProperty(schema: SchemaType, groupby: any) {
  if (!groupby) return null;

  const groupbyID = typeof groupby === 'string' ? groupby : groupby._id;

  let prop;
  if (groupbyID.indexOf('_') > 0) {
    const parts = groupbyID.split('_');
    if (parts.length === 2) {
      const refProp = schema.properties.find((p) => p.name === parts[0]);
      if (refProp) {
        prop = refProp.schema.properties.find(
          (p: PropertyType) => p.name === parts[1]
        );
      }
    }
  } else {
    prop = schema.properties.find((p) => p.name === groupbyID);
  }

  return prop;
}

export const findPropByName = (schema: SchemaType, propName: string) => {
  if (propName.startsWith('_')) return undefined;

  let prop: PropertyType | undefined;

  // 先直接找。因为可能schema是动态生成的
  prop = schema.properties.find((p) => p.name === propName);
  if (prop) return prop;

  const chain = propName.split('_');
  let currentSchema = schema;
  chain.forEach((chainItem, index) => {
    // timewindow
    if (chainItem.startsWith('$')) {
      prop = currentSchema.properties.find((p) => p.type === 'timestamp');
    } else {
      prop = currentSchema.properties.find((p) => p.name === chainItem);
    }
    if (!prop) throw new Error(`没有找到属性: ${propName}`);

    if (index < chain.length - 1) {
      if (!prop.ref)
        throw new Error(`此属性没有ref: ${chainItem}，从${propName}而来`);
      currentSchema = prop.schema;
    }
  });

  return prop;
};

export const getHierarchyCodeLength = (schema: SchemaType, level: string) => {
  if (!schema.hierarchy) {
    return -1;
  }

  let codeLength = 0;
  for (const hierarchyItem of schema.hierarchy) {
    codeLength += hierarchyItem.code_length;
    if (hierarchyItem.name === level) break;
  }
  return codeLength;
};

/**
 * 获取该Schema可以下钻的属性列，包含chain和hierarchy schema的
 * @param schema
 * @returns
 */
export function getDrillDownProp(schema: SchemaType) {
  if (!schema) return []; // 如果没有schema，代表logicform result报错了
  const propNames: string[] = [];

  // 一个递归函数
  const addToArrayWithProperty = (property: PropertyType, prefix?: string) => {
    const pushToPropNames = (propertyName: string, prefix?: string) => {
      propNames.push(prefix ? `${prefix}_${propertyName}` : propertyName);
    };
    if (property.isArray) return; // array因为如果做分组的话，其中的一些统计值都会重复计算，所以默认不做drilldown了

    if (property.is_categorical) {
      pushToPropNames(property.name, prefix);
    } else if (property.type === 'object' && property.schema) {
      if (property.schema.hierarchy) {
        property.schema.hierarchy.forEach((h: any) => {
          pushToPropNames(`${property.name}(${h.name})`, prefix);
        });
      } else {
        pushToPropNames(property.name, prefix);
      }

      // 这里要获取其他schema的属性！
      property.schema.properties.forEach((refProperty: PropertyType) => {
        addToArrayWithProperty(refProperty, property.name);
      });
    }
  };

  schema.properties.forEach((property) => {
    addToArrayWithProperty(property);
  });
  return propNames;
}
