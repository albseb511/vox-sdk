"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToken = exports.useAppContext = exports.VoxProvider = void 0;
const tslib_1 = require("tslib");
// apiContext.tsx
const react_1 = tslib_1.__importStar(require("react"));
const axios_1 = require("../api/axios");
const constant_utils_1 = require("../utils/constant.utils");
// Create a context
const AppContext = (0, react_1.createContext)(null);
// Provider component
const VoxProvider = ({ children, config, }) => {
    const [token, setToken] = (0, react_1.useState)(null);
    const [region, setRegion] = (0, react_1.useState)(null);
    const lastCallRef = (0, react_1.useRef)(0);
    const apiRef = (0, react_1.useRef)((0, axios_1.createApi)(config === null || config === void 0 ? void 0 : config.baseUrl));
    const getAuthTokenAzure = react_1.default.useCallback(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // Check if token is valid and not expired
        if (token && region && Date.now() - lastCallRef.current < constant_utils_1.REFETCH_TOKEN_TIME) {
            return { token, region };
        }
        // Fetch new token
        const response = yield apiRef.current.get("/token");
        const { token: newToken, region: newRegion } = response.data;
        setToken(newToken);
        setRegion(newRegion);
        lastCallRef.current = Date.now();
        return { token: newToken, region: newRegion };
    }), []);
    const contextValue = { getAuthTokenAzure, token: token, region: region };
    return react_1.default.createElement(AppContext.Provider, { value: contextValue }, children);
};
exports.VoxProvider = VoxProvider;
// Custom hook to use the context
const useAppContext = () => {
    const context = (0, react_1.useContext)(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a VoxProvider");
    }
    return context;
};
exports.useAppContext = useAppContext;
const useToken = () => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const { getAuthTokenAzure, token, region } = (0, exports.useAppContext)();
    (0, react_1.useEffect)(() => {
        const fetchToken = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            try {
                setLoading(true);
                yield getAuthTokenAzure();
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to fetch token"));
            }
            finally {
                setLoading(false);
            }
        });
        fetchToken();
    }, [getAuthTokenAzure]);
    return { token, region, loading, error };
};
exports.useToken = useToken;
//# sourceMappingURL=VoxProvider.js.map