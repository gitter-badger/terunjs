import promptCheckbox from 'prompt-checkbox'
import promptAutocompletion from 'prompt-autocompletion'

class AndroidInteract{
    static async  getColumnsFilterBySelection(columns, exclude){
        return new Promise(async (resolve, reject) => {
            if(!exclude){
                return resolve(columns)
            }

            let options = new promptCheckbox({
                name: 'columns',
                message: 'Select columns to use:',
                radio: true,
                choices: columns.map(c => c.name)
            })

            let finalOptions = await options.run()
            let finalColumns = columns.filter(column => {
                return finalOptions.find(c => c === column.name)
            })
            resolve(finalColumns)
        })
    }

    static async  getTableNameFromUser(tables){
        return new Promise(async (resolve, reject) => {
            const filterSearchTableName = (input) => {
                return function(state) {
                    return new RegExp(input, 'i').exec(state) !== null;
                };
            }

            const search = function(answers, input){
                return new Promise(function(resolveSearch) {
                    resolveSearch(tables.filter(filterSearchTableName(input)));
                })
            }
            
            let autocomplete = new promptAutocompletion({
                type: 'autocomplete',
                name: 'tablename',
                message: 'Select table from database: ',
                source: search
            })

            let finalAutocomplete = await autocomplete.run();
            return resolve(finalAutocomplete)
        })
    }

    static async  getOptionsFromUser() {
        return new Promise(async (resolve, reject) => {
            let options = new promptCheckbox({
                name: 'options',
                message: 'Options:',
                choices: [
                  'Exclude',
                  'Ignore Foreign Keys'
                ]
            })

            let finalOptions = await options.run()

            resolve({
                exclude: finalOptions.includes('Exclude'),
                ignoreForeignKeys: finalOptions.includes('Ignore Foreign Keys')
            })
        })
    }
}

export default AndroidInteract