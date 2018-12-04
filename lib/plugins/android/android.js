"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

var _database = _interopRequireDefault(require("../../utils/database"));

var _util = require("../../utils/util");

var _chalk = _interopRequireDefault(require("chalk"));

var _interact = _interopRequireDefault(require("./interact"));

var _loadingCli = _interopRequireDefault(require("loading-cli"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOAD_DATABASE = (0, _loadingCli.default)('Conectando com o database');
const LOAD_TABLES = (0, _loadingCli.default)('Buscando tabelas');
const LOAD_TABLE_EXIST = (0, _loadingCli.default)('Verificando se tabela existe');
const LOAD_COLUMNS = (0, _loadingCli.default)('Pegando colunas referentes a tabela');
const LOAD_ATTRIBUTES = (0, _loadingCli.default)('Pegando attributos e relacionamentos');

class Android {
  constructor() {
    this.name = 'android';
    this.configuration = {};
    this.database = null;
    this.tableName = '';
    this.options = {
      exclude: false,
      ignoreForeignKeys: false
    };
  }

  async config(config, globalArgs, render) {
    let configAssign = Object.assign({}, config);
    let user = configAssign.user,
        host = configAssign.host,
        database = configAssign.database,
        password = configAssign.password,
        port = configAssign.port,
        dialect = configAssign.dialect,
        tableName = configAssign.tableName;
    if (!user) throw new Error('>>USER<< not defined');
    if (!host) throw new Error('>>HOST<< not defined');
    if (!database) throw new Error('>>DATABASE<< not defined');
    if (!password) throw new Error('>>PASSWORD<< not defined');
    if (!port) throw new Error('>>PORT<< not defined');
    if (!dialect) throw new Error('>>DIALECT<< not defined');
    LOAD_DATABASE.start();
    this.database = new _database.default();
    await this.database.setDatabase(host, user, password, database, port, dialect);
    LOAD_DATABASE.stop();
    LOAD_TABLES.start();
    let tabelas = await this.database.getTables();
    LOAD_TABLES.stop();
    this.tableName = await _interact.default.getTableNameFromUser(tabelas);
    this.options = await _interact.default.getOptionsFromUser(); // check if the database has table

    LOAD_TABLE_EXIST.start();
    let hasTable = await this.database.hasTable(this.tableName);
    LOAD_TABLE_EXIST.stop();

    if (!hasTable) {
      console.log(_chalk.default.red(`>> ${this.tableName} << not exists in DATABASE`));
      throw new Error('DATABASE not exists');
    }
  }

  async beforeRender(objectToSetArgs = {}) {
    LOAD_COLUMNS.start();
    let columns = await this.database.getColumns(this.tableName, {
      getForeignKeys: !this.options.ignoreForeignKeys
    });
    LOAD_COLUMNS.stop();
    let filteredColumns = await _interact.default.getColumnsFilterBySelection(columns, this.options.exclude);
    objectToSetArgs['android:columns'] = filteredColumns;
    objectToSetArgs['android:fieldsXML'] = await this.getFieldsXML(filteredColumns);
    objectToSetArgs['android:tableName'] = this.tableName;
    objectToSetArgs['android:class'] = (0, _util.camelize)(this.tableName);
    LOAD_ATTRIBUTES.start();
    objectToSetArgs['android-attr-class'] = await this.getAttributes(filteredColumns);
    LOAD_ATTRIBUTES.stop();
    return objectToSetArgs;
  }

  async getAttributes(columns) {
    let finalColumns = [];

    for (let column of columns) {
      column.foreignKey = !this.options.ignoreForeignKeys && column.foreignKey;
      column.name = (0, _util.camelizeLessFirst)(column.name);
      column.type = this.getTypeAttribute(column.type);
      finalColumns = [...finalColumns, column];
    }

    return finalColumns;
  }

  getTypeAttribute(type) {
    if (this.database.type().isVarchar(type)) return 'String';
    if (this.database.type().isNumber(type)) return 'Integer';
    if (this.database.type().isDate(type)) return 'Date';
    if (this.database.type().isFloat(type)) return 'Long';
    return '';
  }

  async getFieldsXML(columns) {
    return columns.map((column, index) => {
      return this._getField(column.type, column.name, column.foreignKey);
    });
  }

  _getField(type, text, foreignKey) {
    if (foreignKey) {
      return `
                <!--region ${(0, _util.camelize)(text)}-->
                <TextView
                    android:id="@+id/label${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />
                <Spinner
                    android:id="@+id/spinnerId${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                <!--region ${(0, _util.camelize)(text)}-->`;
    }

    if (this.database.type().isVarchar(type)) {
      return `
                <!--region ${(0, _util.camelize)(text)}-->
                <TextView
                    android:id="@+id/label${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />

                <EditText
                    android:id="@+id/editText${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                    <!--region ${(0, _util.camelize)(text)}-->`;
    }

    if (this.database.type().isNumber(type)) {
      return `
                <!--region ${(0, _util.camelize)(text)}-->
                <TextView
                    android:id="@+id/label${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />

                <EditText
                    android:id="@+id/editText${(0, _util.camelize)(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                <!--endregion-->`;
    }
  }

}

var _default = Android;
exports.default = _default;