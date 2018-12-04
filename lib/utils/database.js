"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

const _require = require('pg'),
      Pool = _require.Pool,
      Client = _require.Client;

const OracleDB = require('oracledb');

class Database {
  constructor() {
    this.database = null;
  }

  async setDatabase(host, user, password, database, port, dialect) {
    this.dialect = dialect;

    if (this.dialect === 'pg') {
      this.database = new Client({
        user: user,
        host: host,
        database: database,
        password: password,
        port: port
      });
      this.database.connect();
    }

    if (this.dialect === 'oracle') {
      this.database = await OracleDB.getConnection({
        user: user,
        password: password,
        connectString: `${host}/${database}`
      });
    }

    return this;
  }

  async getColumns(tableName, {
    getForeignKeys = false
  }) {
    let response;
    let types;
    let columns;
    let finalColumns;

    switch (this.dialect) {
      case 'pg':
        response = await this.database.query(`
                    select jsonb_agg(column_name) as column from information_schema.columns where table_name = '${tableName}'
                `);
        columns = response.rows[0].column;
        let responseTypes = await this.getTypes(tableName);
        types = responseTypes;
        finalColumns = [];

        for (let index = 0; index < columns.length; index++) {
          const column = columns[index];
          let isConstraint = getForeignKeys ? await this.isConstraint(tableName, column) : false;
          let tableNameForeignKey = getForeignKeys ? await this.getTableFromConstraint(tableName, column) : false;
          const columnObject = {
            name: column,
            type: types[index],
            foreignKey: isConstraint,
            fkTableName: (0, _util.camelize)(tableNameForeignKey)
          };
          finalColumns = [...finalColumns, columnObject];
        }

        return finalColumns;

      case 'oracle':
        response = await this.database.execute(`
                    SELECT table_name, column_name, data_type, data_length
                    FROM USER_TAB_COLUMNS
                    WHERE table_name = '${tableName}'
                `);
        columns = response.rows.map(row => row[1]);
        types = response.rows.map(row => row[2]);
        finalColumns = [];

        for (let index = 0; index < columns.length; index++) {
          const column = columns[index];
          let isConstraint = getForeignKeys ? await this.isConstraint(tableName, column) : false;
          let tableNameForeignKey = getForeignKeys && isConstraint ? await this.getTableFromConstraint(tableName, column) : '';
          const columnObject = {
            name: column,
            type: types[index],
            foreignKey: isConstraint,
            fkTableName: (0, _util.camelize)(tableNameForeignKey)
          };
          finalColumns = [...finalColumns, columnObject];
        }

        return finalColumns;

      default:
        return [];
    }
  }

  async getTables() {
    switch (this.dialect) {
      case 'pg':
        return [];

      case 'oracle':
        let response = await this.database.execute(`
                    SELECT
                        TABLE_NAME
                    FROM
                        USER_TABLES
                    ORDER BY TABLE_NAME
                `);
        return response.rows.map(r => r[0]);
    }
  }

  async hasTable(tableName) {
    switch (this.dialect) {
      case 'pg':
        return true;

      case 'oracle':
        let response = await this.database.execute(`
                    SELECT * FROM dba_tables where table_name = '${tableName}'
                `);
        return response.rows.length > 0;
    }
  }

  async getTypes(tableName) {
    switch (this.dialect) {
      case 'pg':
        let response = await this.database.query(`select jsonb_agg(udt_name) as types from information_schema.columns where table_name = '${tableName}'`);
        return response.rows[0].types;

      default:
        return [];
    }
  }

  async getTableFromConstraint(tableName, columnForeignKey) {
    let response;

    switch (this.dialect) {
      case 'pg':
        return false;

      default:
        response = await this.database.execute(`
                    SELECT a.column_name, c_pk.table_name
                    FROM all_cons_columns a
                    JOIN all_constraints c ON a.owner = c.owner
                        AND a.constraint_name = c.constraint_name
                    JOIN all_constraints c_pk ON c.r_owner = c_pk.owner
                        AND c.r_constraint_name = c_pk.constraint_name
                        AND a.column_name = '${columnForeignKey}'
                    WHERE c.constraint_type = 'R'
                        AND a.table_name = '${tableName}'
                `);
        return response.rows.length > 0 ? response.rows[0][1] : false;
    }
  }

  async isConstraint(tableName, column) {
    let response;

    switch (this.dialect) {
      case 'pg':
        response = await this.database.query(`
                    SELECT
                        ccu.table_name AS foreign_table_name,
                        ccu.column_name AS foreign_column_name 
                    FROM 
                        information_schema.table_constraints AS tc 
                        JOIN information_schema.key_column_usage AS kcu
                        ON tc.constraint_name = kcu.constraint_name
                        AND tc.table_schema = kcu.table_schema
                        JOIN information_schema.constraint_column_usage AS ccu
                        ON ccu.constraint_name = tc.constraint_name
                        AND ccu.table_schema = tc.table_schema
                    WHERE constraint_type = 'FOREIGN KEY'  and kcu.column_name = '${column}' AND tc.table_name='${tableName}';
                `);
        return response.rows[0] ? true : false;

      default:
        response = await this.database.execute(`
                    SELECT a.column_name
                    FROM all_cons_columns a
                    JOIN all_constraints c ON a.owner = c.owner
                        AND a.constraint_name = c.constraint_name
                    JOIN all_constraints c_pk ON c.r_owner = c_pk.owner
                        AND c.r_constraint_name = c_pk.constraint_name
                        AND a.column_name = '${column}'
                    WHERE c.constraint_type = 'R'
                        AND a.table_name = '${tableName}'
                `);
        return response.rows.length > 0;
    }
  }

  type() {
    return {
      isDate: type => type === "DATE",
      isVarchar: type => type === "varchar" || type === "VARCHAR2",
      isNumber: type => type === "int4" || type === "NUMBER",
      isFloat: type => type === "FLOAT"
    };
  }

}

var _default = Database;
exports.default = _default;