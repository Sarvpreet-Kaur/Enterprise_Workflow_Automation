export const NAVIGATION = [

    {
        title: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
        roles: ['employee', 'manager', 'admin']
    },

    {
        title: 'Users',
        icon: 'group',
        route: '/users',
        roles: ['admin']
    },

    {
        title: 'Teams',
        icon: 'groups',
        route: '/teams',
        roles: ['admin']
    },

    {
        title: 'Workflows',
        icon: 'account_tree',
        route: '/workflows',
        roles: ['admin']
    },

    {
        title: 'Requests',
        icon: 'description',
        route: '/requests',
        roles: ['employee', 'manager']
    },

    {
        title: 'Approvals',
        icon: 'task_alt',
        route: '/approvals',
        roles: ['manager', 'admin']
    },

];
