import axiosLibrary, { AxiosHeaders } from "axios";
import { APP_ENVIRONMENT, ENVIRONMENT_TYPE } from "../utils/constant.utils";

export const defaultBaseUrl = "http://localhost:3001";

axiosLibrary.defaults.withCredentials = APP_ENVIRONMENT === ENVIRONMENT_TYPE.DEV ? false : true;
// create axios interceptor with baseUrl
const api = axiosLibrary.create({
  baseURL: defaultBaseUrl,
});

export const createApi = (baseUrl: string, headers?: AxiosHeaders) => {
  return axiosLibrary.create({
    baseURL: baseUrl || defaultBaseUrl,
    headers: headers || {},

    // manage with errors
  });
};

export default api;
