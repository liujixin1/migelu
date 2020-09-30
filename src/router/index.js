import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
    /* Layout */
import Layout from '@/layout'
export const constantRoutes = [{
    path: '/login',
    component: () =>
        import ('@/views/login/index'),
    hidden: true
}]

export const asyncRoutes = [{
        path: '/userList',
        component: Layout,
        redirect: '/userList',
        name: '用户列表',
        id: 10,
        meta: { title: '', icon: 'client', role: [] },
        children: [{
            path: 'userList',
            name: '用户列表',
            id: 11,
            parentId: 10,
            component: () =>
                import ('@/views/userList/index'),
            meta: { title: '用户列表', role: [] }
        }]
    },
    {
        path: '/campus',
        component: Layout,
        redirect: '/campus',
        name: '校区列表',
        id: 40,
        meta: { title: '', icon: 'client', role: [] },
        children: [{
            path: 'campus',
            name: '校区列表',
            id: 41,
            parentId: 40,
            component: () =>
                import ('@/views/campus/campusList/index'),
            meta: { title: '校区列表', role: [] }
        }]
    },
    {
        path: '/banner',
        component: Layout,
        redirect: '/banner/slidesList',
        name: 'banner图',
        id: 50,
        meta: {
            title: 'banner图',
            icon: 'img',
            role: []
        },
        children: [{
            path: 'slidesList',
            name: '首页轮播图列表',
            id: 51,
            parentId: 50,
            component: () =>
                import ('@/views/banner/slidesList/index'),
            meta: { title: '首页轮播图列表', role: [] }
        }, {
            path: 'advertisingList',
            name: '首页广告图列表',
            id: 52,
            parentId: 50,
            component: () =>
                import ('@/views/banner/advertisingList/index'),
            meta: { title: '首页广告图列表', role: [] }
        }]
    },
    {
        path: '/message',
        component: Layout,
        redirect: '/message/push',
        name: '消息推送',
        id: 30,
        meta: {
            title: '消息推送',
            icon: 'msg',
            role: []
        },
        children: [{
            path: 'push',
            name: '弹窗消息',
            id: 31,
            parentId: 30,
            component: () =>
                import ('@/views/message/push/index'),
            meta: { title: '弹窗消息', role: [] }
        }]
    },
    {
        path: '/video',
        component: Layout,
        redirect: '/video/videoList',
        name: '视频库',
        id: 60,
        meta: {
            title: '视频库',
            icon: 'video',
            role: []
        },
        children: [{
            path: 'videoList',
            name: '视频库列表',
            id: 61,
            parentId: 60,
            component: () =>
                import ('@/views/video/videoList/index'),
            meta: { title: '视频库列表', role: [] }
        }]
    },
    {
        path: '/answer',
        component: Layout,
        redirect: '/answer',
        name: '测评列表',
        id: 20,
        meta: { title: '', icon: 'code', role: [] },
        children: [{
            path: 'answer',
            name: '测评列表',
            id: 21,
            parentId: 20,
            component: () =>
                import ('@/views/answer/index'),
            meta: { title: '测评列表', role: [] }
        }]
    },

    {
        path: '/',
        component: Layout,
        redirect: '/personal',
        name: '个人中心',
        id: 100,
        meta: { title: '', icon: 'personal', role: [] },
        children: [{
            path: 'personal',
            name: '个人中心',
            id: 101,
            parentId: 100,
            component: () =>
                import ('@/views/personal/index'),
            meta: { title: '个人中心', role: [] }
        }]
    },
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/roleList',
        name: '权限设置',
        id: 1,
        meta: {
            title: '权限设置',
            icon: 'lock',
            role: []
        },
        children: [{
                path: 'roleList',
                name: '角色管理',
                id: 2,
                parentId: 1,
                component: () =>
                    import ('@/views/permission/roleList/index'),
                meta: { title: '角色管理', role: [] }
            },
            {
                path: 'adminList',
                name: '管理员列表',
                id: 3,
                parentId: 1,
                component: () =>
                    import ('@/views/permission/adminList/index'),
                meta: { title: '管理员列表', role: [] }
            },

            {
                path: 'permissionResource',
                name: '权限资源列表',
                id: 4,
                parentId: 1,
                component: () =>
                    import ('@/views/permission/permissionResource/index'),
                meta: { title: '权限资源列表', role: [] }
            },
            {
                path: 'rightsGroup',
                name: '权限分组列表',
                id: 5,
                parentId: 1,
                component: () =>
                    import ('@/views/permission/rightsGroup/index'),
                meta: { title: '权限分组列表', role: [] }
            }
        ]
    },
    {
        path: '/log',
        component: Layout,
        redirect: '/log',
        name: '操作日志',
        id: 120,
        meta: { title: '操作日志', icon: 'log', role: [] },
        children: [{
            path: 'universal',
            name: '操作日志',
            id: 121,
            parentId: 120,
            component: () =>
                import ('@/views/log/index'),
            meta: { title: '操作日志', role: [] }
        }]
    },

    {
        path: '/setting',
        component: Layout,
        redirect: '/setting',
        name: '系统设置',
        id: 110,
        meta: { title: '', icon: 'setting', role: [] },
        children: [{
            path: 'setting',
            name: '系统设置',
            id: 111,
            parentId: 110,
            component: () =>
                import ('@/views/setting/index'),
            meta: { title: '系统设置', role: [] }
        }]
    },
    {
        path: '*',
        name: '404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
export default router