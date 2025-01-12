import * as dotenv from 'dotenv';

dotenv.config();

export interface Configuration {
  port: number;
  database: {
    dialect: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
