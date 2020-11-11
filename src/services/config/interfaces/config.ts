export interface IEnvironmentVariables {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_PORT?: string;
  MONGO_DB: string;
  PORT?: number;
  NODE_ENV?: 'development' | 'production' | 'test'
}
