export * from "./logicform";
export * from "./property";
export * from "./schema";

import request from "./request";
import { LogicformType } from "./logicform";
import { SchemaType } from "./schema";
import { PropertyType } from "./property";

export interface ZeroETPClientConfig {
  token: string;
  url?: string;
}

export interface SigninAPIResultType {
  token: string;
  user: any;
}

export interface LogicformAPIResultType {
  schema: SchemaType;
  result: any;
  total?: number;
  error?: any;
  columnProperties: PropertyType[];
  functionInfo?: any;
  returnType:
    | "value"
    | "table"
    | "entity"
    | "entity-pred"
    | "entity-list"
    | "charts";
  representationType?: string;
}

export interface AskAPIResultType {
  logicform: LogicformType;
  schema: SchemaType;
  answer?: LogicformAPIResultType;
}

export function execLogicform(logicform: LogicformType) {
  return request<LogicformAPIResultType>("/logicform", {
    method: "post",
    data: logicform,
  });
}

export function ask(
  question: string,
  logicformOnly: boolean,
  preNode?: LogicformType
) {
  return request<AskAPIResultType>("/ask", {
    method: "post",
    data: {
      ask: question,
      logicform_only: logicformOnly,
      pre_node: preNode,
    },
  });
}

export function createData(schema: SchemaType, data: any) {
  return request(`/data/${schema._id}`, {
    method: "post",
    data: {
      data,
    },
  });
}

export function updateDataByID(
  schema: SchemaType,
  dataID: string,
  updateItem: any
) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`, {
    method: "put",
    data: updateItem,
  });
}

export function getDataByID(schema: SchemaType, dataID: string) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`);
}

export function removeDataByID(schema: SchemaType, dataID: string) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`, {
    method: "delete",
  });
}
