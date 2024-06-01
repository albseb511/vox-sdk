// apiContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createApi } from "../api/axios";
import { APP_ENVIRONMENT, ENVIRONMENT_TYPE, REFETCH_TOKEN_TIME } from "../utils/constant.utils";

// Configuration interface
interface VoxProviderConfig {
  baseUrl: string;
  onAuthRefresh: () => Promise<{ token: string; region: string }>;
}

interface GetAuthResponse {
  token: string;
  region: string;
}

interface AppContextType {
  getAuthTokenAzure: () => Promise<GetAuthResponse>;
  token: string;
  region: string;
  refreshToken: () => void;
}

// Create a context
const AppContext = createContext<AppContextType | null>(null);

// Provider component
export const VoxProvider: React.FC<{ children: React.ReactNode; config: VoxProviderConfig }> = ({
  children,
  config,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const lastCallRef = useRef(0);
  const apiRef = useRef(createApi(config?.baseUrl));
  const isLocal = APP_ENVIRONMENT === ENVIRONMENT_TYPE.DEV;

  const getAuthTokenAzure = React.useCallback(async () => {
    // Check if token is valid and not expires

    if (token && region && Date.now() - lastCallRef.current < REFETCH_TOKEN_TIME) {
      return { token, region };
    }

    // Fetch new token
    const response = await apiRef.current.get("/token");
    const { token: newToken, region: newRegion } = response.data as GetAuthResponse;
    setToken(newToken);
    setRegion(newRegion);
    lastCallRef.current = Date.now();
    return { token: newToken, region: newRegion };
  }, [token, region]);

  const refreshToken = React.useCallback(async () => {
    try {
      const { token, region } = await config?.onAuthRefresh();
      setToken(token);
      setRegion(region);
      lastCallRef.current = Date.now();
    } catch (e) {
      isLocal && console.log("Error refreshing token", e);
    }
  }, []);

  const contextValue = { getAuthTokenAzure, token: token!, region: region!, refreshToken };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
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
  const [error, setError] = useState<Error | null>(null);

  const { getAuthTokenAzure, token, region } = useAppContext();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        await getAuthTokenAzure();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch token"));
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [getAuthTokenAzure]);

  return { token, region, loading, error };
};
