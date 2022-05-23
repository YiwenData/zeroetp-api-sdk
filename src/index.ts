export * from './logicform';
export * from './property';
export * from './schema';

import request from './request';
import { LogicformType } from './logicform';
import { SchemaType } from './schema';
import { PropertyType, RepresentationType } from './property';
import type { RequestOptionsInit } from 'umi-request';
export interface SigninAPIResultType {
  token: string;
  user: any;
}

export const config = {
  API_URL: '',
};

const serverUrl = (url: string) => `${config.API_URL}/api/v1${url}`;
const schemaID = (schema: SchemaType | string) =>
  typeof schema === 'string' ? schema : schema._id;
export interface LogicformAPIResultType {
  schema: SchemaType;
  result: any;
  total?: number;
  error?: any;
  logicform?: LogicformType; // normalized logicform
  columnProperties: PropertyType[];
  functionInfo?: any;
  returnType?: RepresentationType; // 20220502之后会和下面合并
  representationType?: RepresentationType; // 20220502之后会和下面合并
}

export interface AskAPIResultType {
  logicforms?: LogicformType[];
  logicform?: LogicformType;
  schema: SchemaType;
  answer?: LogicformAPIResultType;
  error?: string;
}
export interface SchemaAPIResultType {
  schema: SchemaType;
}

export async function signin(params: any) {
  const response = await request<SigninAPIResultType>(
    serverUrl('/auth/signin'),
    {
      method: 'post',
      data: params,
    }
  );

  if (response.token) {
    window.localStorage.setItem('token', response.token);
  }

  return response;
}

export async function currentUser() {
  return request(serverUrl('/auth/currentUser'));
}

export async function execLogicform(logicform: LogicformType) {
  return request<LogicformAPIResultType>(serverUrl('/logicform'), {
    method: 'post',
    data: logicform,
  });
}

export async function ask(
  question: string,
  logicformOnly?: boolean,
  preNode?: LogicformType
) {
  return request<AskAPIResultType>(serverUrl('/ask'), {
    method: 'post',
    data: {
      ask: question,
      logicform_only: logicformOnly,
      pre_node: preNode,
    },
  });
}

export async function voice(data: any) {
  return request<any>(serverUrl('/nlq/voice'), {
    method: 'post',
    data,
  });
}

export async function createData(schema: SchemaType | string, data: any) {
  return request(serverUrl(`/data/${schemaID(schema)}`), {
    method: 'post',
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
      method: 'put',
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
    method: 'put',
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
      method: 'delete',
    }
  );
}

export async function removeData(schema: SchemaType | string, query: any) {
  return request(serverUrl(`/data/${schemaID(schema)}`), {
    method: 'delete',
    data: query,
  });
}

// Schema CRUD
export async function getSchemas() {
  return request<SchemaAPIResultType>(serverUrl(`/schemas`));
}

export async function createSchema(schema: SchemaType) {
  return request<SchemaAPIResultType>(serverUrl(`/schemas`), {
    method: 'POST',
    data: schema,
  });
}

export async function getSchemaByID(schemaID: string) {
  return request<SchemaAPIResultType>(serverUrl(`/schemas/${schemaID}`));
}

// 除了property，_id，都能更新
export async function updateSchema(schemaID: string, update: any) {
  return request<SchemaAPIResultType>(serverUrl(`/schemas/${schemaID}`), {
    method: 'PUT',
    data: update,
  });
}

export async function deleteSchema(schemaID: string) {
  return request<SchemaAPIResultType>(serverUrl(`/schemas/${schemaID}`), {
    method: 'DELETE',
  });
}

// Property CRUD
export async function addProperty(schemaID: string, property: PropertyType) {
  return request<SchemaAPIResultType>(
    serverUrl(`/schemas/${schemaID}/properties`),
    {
      method: 'POST',
      data: property,
    }
  );
}

export async function removeProperty(schemaID: string, propertyName: string) {
  return request<SchemaAPIResultType>(
    serverUrl(`/schemas/${schemaID}/properties/${propertyName}`),
    {
      method: 'DELETE',
    }
  );
}

export async function updateProperty(schemaID: string, property: PropertyType) {
  return request<SchemaAPIResultType>(
    serverUrl(`/schemas/${schemaID}/properties/${property.name}`),
    {
      method: 'PUT',
      data: property,
    }
  );
}

export async function commonRequest(
  url: string,
  options?: RequestOptionsInit | undefined
) {
  return request(serverUrl(url), options);
}
