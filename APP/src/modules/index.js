import { makeExecutableSchema } from "@graphql-tools/schema"

import TypesModule from './types/index.js'
import UserModule from './user/index.js'
import CategoryModule from './category/index.js'
import PermissionModule from './permission/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypesModule.typeDefs,
        UserModule.typeDefs,
        CategoryModule.typeDefs,
        PermissionModule.typeDefs,
    ],
    resolvers: [
        TypesModule.resolvers,
        UserModule.resolvers,
        CategoryModule.resolvers,
        PermissionModule.resolvers,
    ]
})