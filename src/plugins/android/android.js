import { Pool, Client } from 'pg'
import Database from '../../utils/database';
import { camelize, camelizeLessFirst } from '../../utils/util'
import chalk from 'chalk'
import AndroidInteract from './interact'
import loading from 'loading-cli';

const LOAD_DATABASE = loading('Conectando com o database');
const LOAD_TABLES = loading('Buscando tabelas');
const LOAD_TABLE_EXIST = loading('Verificando se tabela existe');
const LOAD_COLUMNS = loading('Pegando colunas referentes a tabela');
const LOAD_ATTRIBUTES = loading('Pegando attributos e relacionamentos');

class Android {
	constructor() {
		this.name          = 'android'
        this.configuration = {}
        this.database      = null
        this.tableName     = ''

        this.options = {
            exclude: false,
            ignoreForeignKeys: false
        }
    }

    async config(config, globalArgs, render) {
        let configAssign = Object.assign({}, config)
        let {user, host, database, password, port, dialect, tableName} = configAssign

		if (!user)     throw new Error('>>USER<< not defined')
		if (!host)     throw new Error('>>HOST<< not defined');
		if (!database) throw new Error('>>DATABASE<< not defined')
		if (!password) throw new Error('>>PASSWORD<< not defined')
		if (!port)     throw new Error('>>PORT<< not defined')
        if (!dialect)  throw new Error('>>DIALECT<< not defined')

        LOAD_DATABASE.start();
        this.database = new Database()
        await this.database.setDatabase(host, user, password, database, port, dialect)
        LOAD_DATABASE.stop();

        LOAD_TABLES.start()
        let tabelas    = await this.database.getTables()
        LOAD_TABLES.stop()

        this.tableName = await AndroidInteract.getTableNameFromUser(tabelas)
        this.options   = await AndroidInteract.getOptionsFromUser()
        
        // check if the database has table
        LOAD_TABLE_EXIST.start()
        let hasTable = await this.database.hasTable(this.tableName);
        LOAD_TABLE_EXIST.stop()

        if(!hasTable){
            console.log(chalk.red(`>> ${this.tableName} << not exists in DATABASE`));
            throw new Error('DATABASE not exists')
        }
    }

    async beforeRender(objectToSetArgs = {}) {
        LOAD_COLUMNS.start()
        let columns = await this.database.getColumns(this.tableName, {
            getForeignKeys: !this.options.ignoreForeignKeys
        });
        LOAD_COLUMNS.stop()
        
        let filteredColumns = await AndroidInteract.getColumnsFilterBySelection(columns, this.options.exclude)

        objectToSetArgs['android:columns']         = filteredColumns
        objectToSetArgs['android:fieldsXML']       = await this.getFieldsXML(filteredColumns)
        objectToSetArgs['android:tableName']       = this.tableName
        objectToSetArgs['android:tableName_camel'] = camelize(this.tableName)
        objectToSetArgs['android:tableName_lower'] = camelize(this.tableName).toLowerCase()

        LOAD_ATTRIBUTES.start()
        objectToSetArgs['android:attr-class'] = await this.getAttributes(filteredColumns)
        LOAD_ATTRIBUTES.stop()

		return objectToSetArgs
    }

    async getAttributes(columns){
        let finalColumns = [] 
        
        for(let column of columns){
            column.foreignKey = (!this.options.ignoreForeignKeys && column.foreignKey);
            column.name = camelize(column.name)
            column.attr = camelizeLessFirst(column.name)
            column.type = this.getTypeAttribute(column.type)

            finalColumns = [...finalColumns, column]
        }

        return finalColumns;
    }

    getTypeAttribute(type){
        if(this.database.type().isVarchar(type)) return 'String'

        if(this.database.type().isNumber(type)) return 'Integer'

        if(this.database.type().isDate(type)) return 'Date'

        if(this.database.type().isFloat(type)) return 'Long'

        return ''
    }

    async getFieldsXML(columns){
        return columns.map((column, index)=>{
            return this._getField(column.type, column.name, column.foreignKey)
        })
    }

    _getField(type, text, foreignKey){
        if(foreignKey){
            return `
                <!--region ${camelize(text)}-->
                <TextView
                    android:id="@+id/label${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"/>
                <Spinner
                    android:id="@+id/spinnerId${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                <!--region ${camelize(text)}-->`;
        }

        if(this.database.type().isVarchar(type)){
            return `
                <!--region ${camelize(text)}-->
                <TextView
                    android:id="@+id/label${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"/>

                <EditText
                    android:id="@+id/editText${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                    <!--region ${camelize(text)}-->`
        }

        if(this.database.type().isNumber(type)){
            return `
                <!--region ${camelize(text)}-->
                <TextView
                    android:id="@+id/label${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"/>

                <EditText
                    android:id="@+id/editText${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                <!--endregion-->`
        }

        if(this.database.type().isDate(type)){
            return `
                <!--region ${camelize(text)}-->
                <TextView
                    android:id="@+id/label${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="${text}"
                    android:textAppearance="?android:attr/textAppearanceMedium"/>

                <EditText
                    android:id="@+id/editText${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" 
                    android:inputType="date"/>
                <!--endregion-->`
        }
    }
}

export default Android;