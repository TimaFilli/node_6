import path from 'path'
import fs from 'fs'

export default ({ databasePath }) => {
    return {
        read: function (fileName) {
            const jsonData = fs.readFileSync(path.join(databasePath, fileName + '.json'), 'UTF-8')
            return JSON.parse(jsonData) || []
        },

        write: function (fileName, data) {
            fs.writeFileSync(path.join(databasePath, fileName + '.json'), JSON.stringify(data, null, 4))
        }
    }
}