export default {
    Mutation: {
        addCategory: (_, { categoryName }, { model }) => {
            const categories = model.read('categories')

            const record = {
                categoryId: categories.at(-1)?.categoryId + 1 || 1,
                categoryName
            }

            categories.push(record)
            model.write('categories', categories)

            return {
                status: 200,
                message: 'Category successfull added!',
                data: record
            }
        },

        changeCategory: (_, { categoryId, categoryName }, { model }) => {
            const categories = model.read('categories')

            const record = categories.find(CT => CT.categoryId == categoryId)

            if (!record) {
                throw new Error("There is no such category!")
            }

            if (!categoryName.trim().length) {
                throw new Error("categoryName is required!")
            }

            record.categoryName = categoryName
            model.write('categories', categories)

            return {
                status: 200,
                message: 'Category successfull updated!',
                data: record
            }
        },
        
        deleteCategory: (_, { categoryId }, { model }) => {
            const categories = model.read('categories')

            const categoryIndex = categories.findIndex(CT => CT.categoryId == categoryId)

            if (categoryIndex == -1) {
                throw new Error("There is no such category!")
            }

            const [ record ] = categories.splice(categoryIndex, 1)
            model.write('categories', categories)

            return {
                status: 200,
                message: 'Category successfull deleted!',
                data: record
            }
        },
    },

    Query: {
        categories: (_, args, { model }) => {
            return model.read('categories')
        }
    }
}