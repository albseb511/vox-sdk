export default function getAuthTokenAzure(): () => Promise<{
    token: string;
    region: string;
}>;
