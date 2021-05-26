import { PropertyType } from "./property";

export interface SchemaType {
  _id: string;
  name: string;
  syno: string[];
  type: "entity" | "event";
  description?: string;
  properties: PropertyType[];
  editable: boolean; // 前端是否能修改数据
  show_id: boolean; // 前端是否展示_id
  hierarchy?: any[];
}
