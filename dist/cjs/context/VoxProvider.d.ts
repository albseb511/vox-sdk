import React from "react";
interface VoxProviderConfig {
    baseUrl: string;
}
interface GetAuthResponse {
    token: string;
    region: string;
}
interface AppContextType {
    getAuthTokenAzure: () => Promise<GetAuthResponse>;
    token: string;
    region: string;
}
export declare const VoxProvider: React.FC<{
    children: React.ReactNode;
    config: VoxProviderConfig;
}>;
export declare const useAppContext: () => AppContextType;
export declare const useToken: () => {
    token: string;
    region: string;
    loading: boolean;
    error: Error | null;
};
export {};
