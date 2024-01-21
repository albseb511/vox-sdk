"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = exports.defaultBaseUrl = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constant_utils_1 = require("../utils/constant.utils");
exports.defaultBaseUrl = "http://localhost:3001";
axios_1.default.defaults.withCredentials = constant_utils_1.APP_ENVIRONMENT === constant_utils_1.ENVIRONMENT_TYPE.DEV ? false : true;
// create axios interceptor with baseUrl
const api = axios_1.default.create({
    baseURL: exports.defaultBaseUrl,
});
const createApi = (baseUrl) => {
    return axios_1.default.create({
        baseURL: baseUrl || exports.defaultBaseUrl,
        // manage with errors
    });
};
exports.createApi = createApi;
exports.default = api;
//# sourceMappingURL=axios.js.map