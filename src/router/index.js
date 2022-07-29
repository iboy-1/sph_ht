import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

//常量路由：任何角色都能看见的路由（如：登录、404）
export const constantRoutes = [
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

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }
]

//异步路由：不同角色，需要过滤出的路由
export const asyncRoutes = [
  {
    path: '/product',
    name: 'Product',
    component: Layout,
    redirect: 'tradeMark',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'tradeMark',
        name: 'Trademark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'SKU管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'SPU管理' }
      }
    ]
  },
  {
    path: '/acl',
    name: 'Acl',
    component: Layout,
    redirect: 'user',
    meta: {title: '权限管理', icon: 'el-icon-lock'},
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/acl/user'),
        meta: {title: '用户管理'}
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/acl/role'),
        meta: {title: '角色管理'}
      },
      {
        path: 'roleAuth',
        name: 'RoleAuth',
        component: () => import('@/views/acl/role/roleAuth'),
        hidden: true,
        meta: {title: '角色授权'}
      },
      {
        path: 'Permission',
        name: 'Permission',
        component: () => import('@/views/acl/Menu'),
        meta: {title: '菜单管理'}
      }
    ]
    
  }
]

//任意路由：当路由出现错误的时候重定向的路由
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }

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
