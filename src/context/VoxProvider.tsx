// apiContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import api, { createApi } from '../api/axios';

// Configuration interface
interface VoxProviderConfig {
    baseUrl: string;
  }  

interface GetAuthResponse {
    token: string;
    region: string;
  }

interface AppContextType {
    getAuthTokenAzure: () => Promise<GetAuthResponse>;
    token: string,
    region: string
  }
  
  // Create a context
  const AppContext = createContext<AppContextType | null>(null);

// Provider component
export const VoxProvider: React.FC<{children: React.ReactNode, config: VoxProviderConfig}> = ({ children, config }) => {
    const [token, setToken] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const lastCallRef = useRef(0)
    const apiRef = useRef(createApi(config?.baseUrl))
  
    const getAuthTokenAzure = React.useCallback(async () => {
      // Check if token is valid and not expired
      if (token && region && Date.now() - lastCallRef.current < 10 * 60 * 1000) {
        return { token, region };
      }
  
      // Fetch new token
      const response = await api.get('/token');
      const { token: newToken, region: newRegion } = response.data as GetAuthResponse;
      setToken(newToken);
      setRegion(newRegion);
      lastCallRef.current = Date.now();
      return { token: newToken, region: newRegion };
    },[]);
  
    const contextValue = { getAuthTokenAzure, token, region };
  
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  };
  

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext must be used within a VoxProvider');
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
          setError(err instanceof Error ? err : new Error('Failed to fetch token'));
        } finally {
          setLoading(false);
        }
      };
  
      fetchToken();
    }, [getAuthTokenAzure]);
  
    return { token, region, loading, error };
  };
