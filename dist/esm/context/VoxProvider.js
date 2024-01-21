import { __awaiter } from "tslib";
// apiContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createApi } from "../api/axios";
import { REFETCH_TOKEN_TIME } from "../utils/constant.utils";
// Create a context
const AppContext = createContext(null);
// Provider component
export const VoxProvider = ({ children, config, }) => {
    const [token, setToken] = useState(null);
    const [region, setRegion] = useState(null);
    const lastCallRef = useRef(0);
    const apiRef = useRef(createApi(config === null || config === void 0 ? void 0 : config.baseUrl));
    const getAuthTokenAzure = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        // Check if token is valid and not expired
        if (token && region && Date.now() - lastCallRef.current < REFETCH_TOKEN_TIME) {
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
    return React.createElement(AppContext.Provider, { value: contextValue }, children);
};
// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a VoxProvider");
    }
    return context;
};
export const useToken = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAuthTokenAzure, token, region } = useAppContext();
    useEffect(() => {
        const fetchToken = () => __awaiter(void 0, void 0, void 0, function* () {
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
//# sourceMappingURL=VoxProvider.js.map