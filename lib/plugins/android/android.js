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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Android {
  constructor() {
    this.name = 'android';
    this.configuration = {};
    this.database = null;
    this.tableName = '';
    this.options = {
      recursive: false,
      exclude: false,
      guess: false
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
    this.tableName = await _interact.default.getTableNameFromUser();
    this.options = await _interact.default.getOptionsFromUser();
    this.database = new _database.default();
    await this.database.setDatabase(host, user, password, database, port, dialect); // check if the database has table

    let hasTable = await this.database.hasTable(this.tableName);

    if (!hasTable) {
      console.log(_chalk.default.red(`>> ${this.tableName} << not exists in DATABASE`));
      throw new Error('DATABASE not exists');
    }
  }

  async beforeRender(objectToSetArgs = {}) {
    let columns = await this.database.getColumns(this.tableName);
    objectToSetArgs['android:columns'] = await _interact.default.getColumnsFilterBySelection(columns, this.options.exclude);
    objectToSetArgs['android:fieldsXML'] = await this.getFieldsXML();
    objectToSetArgs['android:tableName'] = this.tableName;
    objectToSetArgs['android:class'] = (0, _util.camelize)(this.tableName);
    objectToSetArgs['android-attr-class'] = await this.getAttributes(columns);
    return objectToSetArgs;
  }

  async getAttributes(columns) {
    return columns.map(column => {
      let type;

      if (this.database.type().isVarchar(column.type)) {
        type = 'String';
      }

      if (this.database.type().isNumber(column.type)) {
        type = 'Integer';
      }

      if (this.database.type().isDate(column.type)) {
        type = 'Date';
      }

      if (this.database.type().isFloat(column.type)) {
        type = 'Long';
      }

      column.name = (0, _util.camelize)(column.name);
      column.type = type;
      return column;
    });
  }

  async getFieldsXML() {
    let columns = await this.database.getColumns(this.tableName);
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