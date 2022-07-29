/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export interface UsersTableRow {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: number;
  updated_at: number;
}

export interface UsersTableCamelRow {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email CITEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE users;
    `);
}
