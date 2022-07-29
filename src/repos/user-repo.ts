import pool from "../utils/pool";
import ToCamelCase from "../utils/to-camel-case";
import {
  UsersTableCamelRow,
  UsersTableRow,
} from "../../migrations/1658818038805_add-table-users";
import {
  SessionsTableCamelRow,
  SessionsTableRow,
} from "../../migrations/1658826074596_add-table-sessions";
import {
  ProductTableRow,
  ProductTableRowCamel,
} from "../../migrations/1658893458532_add-table-products";

export class UserRepo {
  static async createUser(name: string, email: string, hash: string) {
    const queryResult = await pool.query(
      `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`,
      [name, email, hash]
    );

    const result: UsersTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<UsersTableRow, UsersTableCamelRow>(result)![0];
  }

  static async findByEmail(email: string) {
    const queryResult = await pool.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );

    const result: UsersTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<UsersTableRow, UsersTableCamelRow>(result)![0];
  }

  static async createSession(userId: number, userAgent: string) {
    const queryResult = await pool.query(
      `INSERT INTO sessions(user_id, user_agent) VALUES($1, $2) RETURNING *;`,
      [userId, userAgent]
    );

    const result: SessionsTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<SessionsTableRow, SessionsTableCamelRow>(result)![0];
  }

  static async findSessions({ user, valid }: { user: number; valid: true }) {
    const queryResult = await pool.query(
      `SELECT * FROM sessions WHERE user_id = $1 AND valid = $2`,
      [user, valid]
    );

    const result: SessionsTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<SessionsTableRow, SessionsTableCamelRow>(result);
  }

  static async updateSessions({ id, valid }: { id: number; valid: boolean }) {
    const queryResult = await pool.query(
      `UPDATE sessions SET valid = $1 WHERE id = $2;`,
      [valid, id]
    );

    const result: SessionsTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<SessionsTableRow, SessionsTableCamelRow>(result)![0];
  }

  static async findSessionsById(id: number) {
    const queryResult = await pool.query(
      `SELECT * FROM sessions WHERE id = $1;`,
      [id]
    );

    const result: SessionsTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<SessionsTableRow, SessionsTableCamelRow>(result)![0];
  }

  static async createProduct({
    title,
    description,
    price,
    image,
    userId,
  }: {
    title: string;
    description: string;
    price: number;
    image: string;
    userId: number;
  }) {
    const queryResult = await pool.query(
      `INSERT INTO products(title, description, price, image, user_id) 
      VALUES($1, $2, $3, $4, $5) RETURNING *;`,
      [title, description, price, image, userId]
    );

    const result: ProductTableRow[] | undefined = queryResult?.rows;

    return ToCamelCase<ProductTableRow, ProductTableRowCamel>(result)![0];
  }

  static async findProductByTitle({ title }: Partial<ProductTableRowCamel>) {
    const queryResult = await pool.query(
      `SELECT * FROM products
    WHERE LOWER(title) = LOWER($1);`,
      [title]
    );

    const result: ProductTableRow[] | undefined = queryResult?.rows;
    return ToCamelCase<ProductTableRow, ProductTableRowCamel>(result)![0];
  }

  static async findProductById({ id }: Partial<ProductTableRowCamel>) {
    const queryResult = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    const result: ProductTableRow[] | undefined = queryResult?.rows;
    return ToCamelCase<ProductTableRow, ProductTableRowCamel>(result)![0];
  }

  static async updateProduct({
    id,
    title,
    description,
    price,
    image,
  }: Partial<ProductTableRowCamel>) {
    const queryResult = await pool.query(
      `UPDATE products 
      SET title = $1, description = $2, price = $3, image = $4 
      WHERE id = $5 RETURNING *;`,
      [title, description, price, image, id]
    );

    const result: ProductTableRow[] | undefined = queryResult?.rows;
    return ToCamelCase<ProductTableRow, ProductTableRowCamel>(result)![0];
  }

  static async deleteProduct({ id }: Partial<ProductTableRowCamel>) {
    const queryResult = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING *;`,
      [id]
    );

    const result: ProductTableRow[] | undefined = queryResult?.rows;
    return ToCamelCase<ProductTableRow, ProductTableRowCamel>(result)![0];
  }
}
