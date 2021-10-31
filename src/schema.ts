import { PropertyType } from './property';

export interface SchemaType {
  _id: string;
  name: string;
  syno?: string[];
  type: 'entity' | 'event';
  description?: string;
  properties: PropertyType[];
  editable?: boolean; // 前端是否能修改数据
  show_id?: boolean; // 前端是否展示_id
  hierarchy?: any[];
  refLF?: any[];
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
