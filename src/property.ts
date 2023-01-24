export type RepresentationType =
  | 'value'
  | 'entity'
  | 'report'
  | 'table'
  | 'pie'
  | 'bar' // 横向的柱状图
  | 'column' // 纵向的柱状图（一般意义上的bar，这里用的是ant chart的定义，很反直觉）
  | 'map'
  | 'line'
  | 'chart'; // 自定义的echart option;
export interface PropertyType {
  _sid?: string; // 无业务无意义的一个id，方便property的增删改查
  _id?: string;
  name: string;
  syno?: string[];
  description?: string;
  type: string;
  primal_type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'image'
    | 'object'
    | 'geo'
    | 'nested'
    | 'mixed'
    | 'report';
  granularity?:
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'week'
    | 'year';
  is_supplementary?: boolean; // 这个字段是不是内部帮助字段。内部帮助字段不会被学习，不会显示在ui上
  is_name?: boolean;
  is_categorical?: boolean;
  is_additive?: boolean;
  is_fake?: boolean;
  use_minus_on_mom?: boolean; // 在计算同环比的时候，是用除法还是减法。默认的话，绝对值类型的用除法，百分比类型的用减法，is_speedish的也用除法
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
    formatters?: {
      min?: number; // 大于等于这个数字，会使用这个formatter
      max?: number; // 小于这个数字，会使用这个formatter
      formatter: string;
      prefix?: string; // unit的前缀
      postfix?: string; // unit的后缀
      role?: string; // 针对某一个角色做的展示
    }[];
    show_in_detail_only?: boolean;
    ellipsis?: boolean;
    editable?: boolean;
    name?: boolean; // 是不是可以在UI上认为是name属性
    type?: 'file'; // 虽然是primal_type是string，但是在表现上，是一个文件。要通过extractContentFromFile进行转化
    startLevel?: string; // 这个是给HierarchySchema用的。在前端用Cascader来选择Object的时候，起始的一个level。一定要配合property自身的level属性才可以生效。
    presentation?: RepresentationType;
    delimiter?: boolean;
  };
  versioned?: boolean; // 是不是版控模型
  // 一个帮助的字段，不太确定是不是放这里比较好。目前的用途是告诉前端怎么去做下钻。
  hierarchy?: {
    up?: string;
    down?: string;
  };
}
