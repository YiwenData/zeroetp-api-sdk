export interface PropertyType {
  _id?: string;
  name: string;
  syno?: string[];
  description?: string;
  type: string;
  primal_type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "image"
    | "object"
    | "geo"
    | "nested"
    | "mixed";
  granularity?:
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "week"
    | "year";
  is_name?: boolean;
  is_categorical?: boolean;
  is_speedish?: boolean;
  is_fake?: boolean;
  ref?: string;
  ref_prop?: string;
  unit?: string;
  level?: string; // 只有在type为object的时候会存在，表达这个object的最细粒度为某一个level。 TODO：之后time的granularity和level合并
  schema?: any; // 就这样吧，不然会有循环导入
  stats?: {
    min?: number;
    max?: number;
    total?: number;
    avg?: number;
    distincts?: string[];
  };
  udf?: any;
  constraints?: any;
  isArray?: boolean;
  ui?: {
    formatter?: string;
    show_in_detail_only?: boolean;
    ellipsis?: boolean;
    editable?: boolean;
    name?: boolean; // 是不是可以在UI上认为是name属性
    type?: "file"; // 虽然是primal_type是string，但是在表现上，是一个文件。要通过extractContentFromFile进行转化
    startLevel?: string; // 这个是给HierarchySchema用的。在前端用Cascader来选择Object的时候，起始的一个level。一定要配合property自身的level属性才可以生效。
  };
  properties?: PropertyType[]; // 子Property
  // 一个帮助的字段，不太确定是不是放这里比较好。目前的用途是告诉前端怎么去做下钻。
  hierarchy?: {
    up?: string;
    down?: string;
  };
}
