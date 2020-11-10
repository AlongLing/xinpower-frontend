import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 页面路由,新增加的页面都需要在这个文件中添加访问的地址路由
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/user/userlist'                       // 当访问地址是 http://localhost:9528/ 将重定向到该页面
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'userlist',
        // name: 'List',
        component: () => import('@/views/userlist/userlist'),
        meta: { title: '营员管理', icon: 'table' }
      }, {
        path: 'addGrowthValue/:id',
        component: () => import('@/views/userlist/addGrowthValue'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      }, {
        path: 'addXinBean/:id',
        component: () => import('@/views/userlist/addXinBean'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      }
    ]
  },

  {
    path: '/gift',
    component: Layout,
    children: [
      {
        path: 'giftlist',
        component: () => import('@/views/giftlist/giftlist'),
        meta: { title: '商品管理', icon: 'example' }
      }, {
        path: 'addGoods',
        component: () => import('@/views/giftlist/addGoods'),
        meta: { title: '新增商品', icon: 'tree' },
        hidden: true
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'orderlist',
        component: () => import('@/views/orderlist/orderlist'),
        meta: { title: '订单管理', icon: 'tree' }
      }, {
        path: 'edit/:id',
        component: () => import('@/views/orderlist/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      }
    ]
  },

  {
    path: '/swiper',
    component: Layout,
    children: [
      {
        path: 'homelist',
        component: () => import('@/views/swiperhome/list'),
        meta: { title: '轮播商品管理', icon: 'tree' }
      }, {
        path: 'addGoods',
        component: () => import('@/views/swiperhome/addGoods'),
        meta: { title: '新增商品', icon: 'tree' },
        hidden: true
      }
    ]
  },

  {
    path: '/vphoto',
    component: Layout,
    children: [
      {
        path: 'vphotoMenu',
        component: () => import('@/views/vphoto/menu'),
        meta: { title: 'vphoto管理', icon: 'example' }
      }, {
        path: 'addActivity',
        component: () => import('@/views/vphoto/addActivity'),
        meta: { title: '新增活动', icon: 'tree' },
        hidden: true
      }, {
        path: 'pictureList/:id',
        component: () => import('@/views/vphoto/pictureList'),
        meta: { title: '新增活动图片', icon: 'tree' },
        hidden: true
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
