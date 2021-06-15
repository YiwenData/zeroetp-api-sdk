export interface PropertyType {
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
  };
}
