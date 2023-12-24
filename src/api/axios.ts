import axiosLibrary from "axios";

export const defaultBaseUrl = "http://localhost:3001";

axiosLibrary.defaults.withCredentials = true;
// create axios interceptor with baseUrl
const api = axiosLibrary.create({
    baseURL: defaultBaseUrl
})

export const createApi = (baseUrl:string) => {
    return axiosLibrary.create({
        baseURL: baseUrl || defaultBaseUrl
        // manage with errors
    })
}

export default api; 