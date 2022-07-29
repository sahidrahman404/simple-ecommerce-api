/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export interface SessionsTableRow {
  id: number;
  user_id: number;
  valid: boolean;
  user_agent: string;
  created_at: number;
  updated_at: number;
}

export interface SessionsTableCamelRow {
  id: number;
  userId: number;
  valid: boolean;
  userAgent: string;
  createdAt: number;
  updatedAt: number;
}

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE sessions(
       id SERIAL PRIMARY KEY, 
       user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       valid BOOLEAN DEFAULT TRUE,
       user_agent TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE sessions;
    `);
}
