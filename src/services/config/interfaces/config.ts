export interface IEnvironmentVariables {
  MONGO_URI: string;
  PORT?: number;
  NODE_ENV?: 'development' | 'production' | 'test';
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}
