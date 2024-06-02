export const REFETCH_TOKEN_TIME = 9 * 60 * 1000; // 9 minutes in milliseconds ( refetch the token again after 9 minutes )
export enum ENVIRONMENT_TYPE {
  DEV = "development",
  PROD = "production",
}
export const APP_ENVIRONMENT: ENVIRONMENT_TYPE.DEV | ENVIRONMENT_TYPE.PROD = ENVIRONMENT_TYPE.PROD;
export const ERROR_CODES = {
  INVALID_TOKEN: 4,
  CONNECTION_FAILURE: 1006,
};
