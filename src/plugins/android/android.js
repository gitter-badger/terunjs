import { Pool, Client } from 'pg'
import Database from '../../utils/database';
import { capitalize, camelize } from '../../utils/util'
import chalk from 'chalk'
import AndroidInteract from './interact'

class Android {
	constructor() {
		this.name          = 'android'
        this.configuration = {}
        this.database      = null
        this.tableName     = ''

        this.options = {
            recursive: false,
            exclude: false,
            guess: false
        }
    }

    async config(config, globalArgs, render) {
        let configAssign = Object.assign({}, config)
        let {user, host, database, password, port, dialect, tableName} = configAssign

		if (!user)      throw new Error('>>USER<< not defined')
		if (!host)      throw new Error('>>HOST<< not defined');
		if (!database)  throw new Error('>>DATABASE<< not defined')
		if (!password)  throw new Error('>>PASSWORD<< not defined')
		if (!port)      throw new Error('>>PORT<< not defined')
        if (!dialect)   throw new Error('>>DIALECT<< not defined')

        this.tableName = await AndroidInteract.getTableNameFromUser()
        this.options   = await AndroidInteract.getOptionsFromUser()

        this.database = new Database()
        await this.database.setDatabase(host, user, password, database, port, dialect)

        // check if the database has table
        let hasTable = await this.database.hasTable(this.tableName);
        if(!hasTable){
            console.log(chalk.red(`>> ${this.tableName} << not exists in DATABASE`));
            throw new Error('DATABASE not exists')
        }
    }

    async beforeRender(objectToSetArgs = {}) {
        let columns = await this.database.getColumns(this.tableName);
        objectToSetArgs['android:columns']    = await AndroidInteract.getColumnsFilterBySelection(columns, this.options.exclude)
        objectToSetArgs['android:fieldsXML']  = await this.getFieldsXML()
        objectToSetArgs['android:tableName']  = this.tableName
        objectToSetArgs['android:class']      = camelize(this.tableName)
        objectToSetArgs['android-attr-class'] = await this.getAttributes(columns)

		return objectToSetArgs
    }

    async getAttributes(columns){
        return columns.map(column => {
            let type;
            if(this.database.type().isVarchar(column.type)){
                type = 'String'
            }

            if(this.database.type().isNumber(column.type)){
                type = 'Integer'
            }

            if(this.database.type().isDate(column.type)){
                type = 'Date'
            }

            if(this.database.type().isFloat(column.type)){
                type = 'Long'
            }

            column.name = camelize(column.name)
            column.type = type

            return column;
        })
    }

    async getFieldsXML(){
        let columns = await this.database.getColumns(this.tableName)

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
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />
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
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />

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
                    android:textAppearance="?android:attr/textAppearanceMedium"
                    android:textColor="@color/cor_campo_obrigatorio" />

                <EditText
                    android:id="@+id/editText${camelize(text)}"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
                <!--endregion-->`
        }
    }
}

export default Android;