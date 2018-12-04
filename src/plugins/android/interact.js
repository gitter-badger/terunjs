import prompt from 'prompt'
import promptCheckbox from 'prompt-checkbox'

class AndroidInteract{
    static async  getColumnsFilterBySelection(columns, exclude){
        let options = new promptCheckbox({
            name: 'columns',
            message: 'Select columns to use:',
            radio: true,
            choices: columns.map(c => c.name)
        })

        return new Promise(async (resolve, reject) => {
            if(!exclude){
                resolve(columns)
            }

            let finalOptions = await options.run()
            let finalColumns = columns.filter(column => {
                return finalOptions.find(c => c === column.name)
            })

            resolve(finalColumns)
        })
    }

    static async  getTableNameFromUser(){
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(['Name table from DB?'], async (err, result) => {
                resolve(result["Name table from DB?"])
            })
        })
    }

    static async  getOptionsFromUser() {
        let options = new promptCheckbox({
            name: 'options',
            message: 'Options:',
            choices: [
              'Recursive',
              'Guess',
              'Exclude'
            ]
        })

        return new Promise(async (resolve, reject) => {
            let finalOptions = await options.run()

            resolve({
                recursive: finalOptions.includes('Recursive'),
                exclude: finalOptions.includes('Exclude'),
                guess: finalOptions.includes('Guess')
            })
        })
    }
}

export default AndroidInteract