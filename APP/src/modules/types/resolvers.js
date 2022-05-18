import { GraphQLUpload } from 'graphql-upload'

export default {
    Upload: GraphQLUpload,

    MainType: {
        __resolveType: object => {
            if(object.userId && object.username) return 'User'
            if (object.categoryId) return 'Category'
            if (object.permissionId) return 'Permission'
            else return null
        }
    }
}