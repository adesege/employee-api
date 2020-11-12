import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";

export const cleanupDocuments = async (app: INestApplication): Promise<any> => {
  const connection = app.get<Connection>(getConnectionToken());
  await connection.dropDatabase();
  return connection.close()
}
