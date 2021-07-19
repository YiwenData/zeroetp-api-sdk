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

export const config = {
  API_URL: "",
};

const serverUrl = (url: string) => `${config.API_URL}/api/v1${url}`;
const schemaID = (schema: SchemaType | string) =>
  typeof schema === "string" ? schema : schema._id;
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

export interface SchemaAPIResultType {
  schema: SchemaType;
}

export async function signin(params: any) {
  const response = await request<SigninAPIResultType>(
    serverUrl("/auth/signin"),
    {
      method: "post",
      data: params,
    }
  );

  if (response.token) {
    window.localStorage.setItem("token", response.token);
  }

  return response;
}

export async function currentUser() {
  return request(serverUrl("/auth/currentUser"));
}

export async function execLogicform(logicform: LogicformType) {
  return request<LogicformAPIResultType>(serverUrl("/logicform"), {
    method: "post",
    data: logicform,
  });
}

export async function ask(
  question: string,
  logicformOnly: boolean,
  preNode?: LogicformType
) {
  return request<AskAPIResultType>(serverUrl("/ask"), {
    method: "post",
    data: {
      ask: question,
      logicform_only: logicformOnly,
      pre_node: preNode,
    },
  });
}

export async function createData(schema: SchemaType | string, data: any) {
  return request(serverUrl(`/data/${schemaID(schema)}`), {
    method: "post",
    data: {
      data,
    },
  });
}

export async function updateDataByID(
  schema: SchemaType | string,
  dataID: string,
  updateItem: any
) {
  return request(
    serverUrl(`/data/${schemaID(schema)}/${encodeURIComponent(dataID)}`),
    {
      method: "put",
      data: updateItem,
    }
  );
}

export async function updateData(
  schema: SchemaType | string,
  query: any,
  update: any
) {
  return request(serverUrl(`/data/${schemaID(schema)}`), {
    method: "put",
    data: {
      query,
      update,
    },
  });
}

export async function getDataByID(schema: SchemaType | string, dataID: string) {
  return request(
    serverUrl(`/data/${schemaID(schema)}/${encodeURIComponent(dataID)}`)
  );
}

export async function removeDataByID(
  schema: SchemaType | string,
  dataID: string
) {
  return request(
    serverUrl(`/data/${schemaID(schema)}/${encodeURIComponent(dataID)}`),
    {
      method: "delete",
    }
  );
}

export async function removeData(schema: SchemaType | string, query: any) {
  return request(serverUrl(`/data/${schemaID(schema)}`), {
    method: "delete",
    data: query,
  });
}

export async function getSchemaByID(schemaID: string) {
  return request<SchemaAPIResultType>(serverUrl(`/schemas/${schemaID}`));
}
