/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from "umi-request";

const codeMessage: { [key: number]: string } = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户令牌失效，请重新重新登录",
  403: "此账号无权访问此数据",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 配置request请求时的默认参数
 */
const requestExtend = extend({
  // errorHandler, // 默认错误处理
  credentials: "include", // CORS
});

const request = async <T = any>(url: string, options?: RequestOptionsInit) => {
  const newOptions: RequestOptionsInit = { ...options };

  if (window.localStorage && window.localStorage.token) {
    newOptions.headers = {
      Authorization: `Bearer ${window.localStorage.token}`,
    };
  }

  try {
    const response = await requestExtend<T>(url, newOptions);
    return response;
  } catch (error) {
    const response: Response = error.response;
    if (response && response.status) {
      const jsonResponse = await response.json();
      const errorText =
        (jsonResponse && jsonResponse.error) ||
        codeMessage[response.status] ||
        response.statusText;

      throw new Error(errorText);
    } else {
      throw new Error("您的网络发生异常，无法连接服务器");
    }
  }
};

export default request;
