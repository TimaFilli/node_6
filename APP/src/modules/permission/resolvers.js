import { finished } from 'stream/promises'
import query from '../../query.js'

export default {
    Mutation: {
        addPermission: (_, { userId, module, actions }, { model }) => {
            const permissions = model.read('permissions')

            let permission = permissions.find(permission => permission.userId == userId && permission.permissionModule == module)

            if (!permission) {
                permission = {
                    permissionId: permission.at(-1)?.permissionId + 1 || 1,
                    permissionModule: module
                }
            }

            actions.map(action => {
                permission[action] = true
            })

            model.write('permissions', permissions)

            return {
                status: 200,
                message: 'Permission added!',
                data: permission
            }
        },

        deletePermission: (_, { userId, module, actions }, { model }) => {
            const permissions = model.read('permissions')

            let permission = permissions.find(permission => permission.userId == userId && permission.permissionModule == module)

            if (!permission) {
                throw new Error("There is no such permission!")
            }

            actions.map(action => {
                permission[action] = false
            })

            model.write('permissions', permissions)

            return {
                status: 200,
                message: 'Permission deleted!',
                data: permission
            }
        },
    },


    Query: {
        permissions: (_, args, { model, userId }) => {
            const permissions = model.read('permissions')

            userId = userId || args.userId

            return permissions.filter(permission => {
                return userId ? permission.userId == userId : true
            })
        },

        permissionActions: (_, args, { model }) => {
            return ['delete', 'update', 'read', 'write']
        },

        permissionModules: (_, args, { model }) => {
            return new Set(Object.values(query).map(object => object.module))
        }
    },

    Permission: {
        user: (global, _, { model }) => model.read('users').find(user => user.userId == global.userId)
    }
}