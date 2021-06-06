export * from "./logicform";
export * from "./property";
export * from "./schema";

import request from "./request";
import { LogicformType } from "./logicform";
import { SchemaType } from "./schema";
import { PropertyType } from "./property";
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
  returnType?:
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

export async function signin(params: any) {
  const response = await request<SigninAPIResultType>("/auth/signin", {
    method: "post",
    data: params,
  });

  if (response.token) {
    window.localStorage.setItem("token", response.token);
  }

  return response;
}

export async function currentUser() {
  return request("/auth/currentUser");
}

export async function execLogicform(logicform: LogicformType) {
  return request<LogicformAPIResultType>("/logicform", {
    method: "post",
    data: logicform,
  });
}

export async function ask(
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

export async function createData(schema: SchemaType, data: any) {
  return request(`/data/${schema._id}`, {
    method: "post",
    data: {
      data,
    },
  });
}

export async function updateDataByID(
  schema: SchemaType,
  dataID: string,
  updateItem: any
) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`, {
    method: "put",
    data: updateItem,
  });
}

export async function getDataByID(schema: SchemaType, dataID: string) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`);
}

export async function removeDataByID(schema: SchemaType, dataID: string) {
  return request(`/data/${schema._id}/${encodeURIComponent(dataID)}`, {
    method: "delete",
  });
}
