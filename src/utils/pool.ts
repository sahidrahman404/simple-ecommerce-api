import pg from "pg";

interface Options {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

class Pool {
  _pool: null | pg.Pool = null;

  connect(options: Options) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1");
  }

  close() {
    return this._pool?.end();
  }

  query(sql: string, params?: any[]) {
    return this._pool?.query(sql, params);
  }
}
export default new Pool();
