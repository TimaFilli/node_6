export default {
    'categories': {
        module: 'category',
        actions: ['read', 'write', 'update', 'delete']
    },

    'addCategory': {
        module: 'category',
        actions: ['write']
    },

    'changeCategory': {
        module: 'category',
        actions: ['update']
    },

    'deleteCategory': {
        module: 'category',
        actions: ['delete']
    },

    'permissions': {
        module: 'permission',
        actions: ['read', 'write', 'update', 'delete']
    },

    'addPermission': {
        module: 'permission',
        actions: ['write']
    },

    'deletePermission': {
        module: 'permission',
        actions: ['delete']
    },
}