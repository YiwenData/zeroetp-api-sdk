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

// export class ZeroETPClient {
//   token: string;
//   url: string = "http://localhost:3052/api/v1";

//   constructor(config: ZeroETPClientConfig) {
//     if (config.url) this.url = config.url;
//     if (!config.token) throw new Error("创建ZeroETPClient需要token参数");

//     this.token = config.token;
//   }

//   async _post<T = any, R = AxiosResponse<T>>(url: string, data: any) {
//     return axios.post<R>(`${this.url}${url}`, data, {
//       headers: { Authorization: `Bearer ${this.token}` },
//     });
//   }

//   async signin(username: string, password: string) {
//     return axios.post<SigninAPIResultType>(`${this.url}/auth/signin`, {
//       username,
//       password,
//     });
//   }

//   async ask(question: string, logicform_only: boolean = false) {
//     return this._post<AskAPIResultType>("/ask", {
//       ask: question,
//       logicform_only,
//     });
//   }

//   async logicform(logicform: any) {
//     return this._post<LogicformAPIResultType>("/logicform", logicform);
//   }

//   async createData(schema: SchemaType, data: any[]) {
//     return this._post<LogicformAPIResultType>(`/data/${schema._id}`, {
//       data,
//     });
//   }

//   async updateDataByID(schema: SchemaType, dataID: string, updateItem: any) {
//     return axios.put(
//       `${this.url}/data/${schema._id}/${encodeURIComponent(dataID)}`,
//       updateItem,
//       {
//         headers: { Authorization: `Bearer ${this.token}` },
//       }
//     );
//   }

//   async removeDataByID(schema: SchemaType, dataID: string) {
//     return axios.delete(
//       `${this.url}/data/${schema._id}/${encodeURIComponent(dataID)}`,
//       {
//         headers: { Authorization: `Bearer ${this.token}` },
//       }
//     );
//   }
// }

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
