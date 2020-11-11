export interface IEnvironmentVariables {
  MONGO_URI: string;
  PORT?: number;
  NODE_ENV?: 'development' | 'production' | 'test'
}
