import axiosLibrary from "axios";
export var defaultBaseUrl = "http://localhost:3001";
axiosLibrary.defaults.withCredentials = true;
// create axios interceptor with baseUrl
var api = axiosLibrary.create({
    baseURL: defaultBaseUrl
});
export var createApi = function (baseUrl) {
    return axiosLibrary.create({
        baseURL: baseUrl || defaultBaseUrl
        // manage with errors
    });
};
export default api;
