import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/index'
import Login from '../views/login/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/user',
        name: 'UserList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "UserList" */ '../views/user/index.vue')
      },
      {
        path: '/user/virtualList',
        name: 'VirtualList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "VirtualList" */ '../views/user/virtualList.vue')
      },
      {
        path: '/goods',
        name: 'Goods',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Goods" */ '../views/goods/list/index.vue')
      },
      {
        path: '/goods/evaluationList',
        name: 'Evaluation',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Evaluation" */ '../views/goods/evaluationList/index.vue')
      },
      {
        path: '/cross/product',
        name: 'CrossProductList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossProductList" */ '../views/cross/product/index.vue')
      },
      {
        path: '/cross/product/add',
        name: 'CrossAdd',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossAdd" */ '../views/cross/product/add.vue')
      },
      {
        path: '/cross/product/detail',
        name: 'CrossDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossDetail" */ '../views/cross/product/detail.vue')
      },
      {
        path: '/order/list',
        name: 'OrderList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "OrderList" */ '../views/order/list/index.vue')
      },
      {
        path: '/cross/order',
        name: 'CrossOrderList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossOrderList" */ '../views/cross/order/index.vue')
      },
      {
        path: '/cross/order/detail',
        name: 'CrossOrderDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossOrderDetail" */ '../views/cross/order/detail.vue')
      },
      {
        path: '/cross/order/edit',
        name: 'CrossOrderEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CrossOrderEdit" */ '../views/cross/order/edit.vue')
      },
      {
        path: '/cross/table',
        name: 'Table',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Table" */ '../views/cross/table/index.vue')
      },
      {
        path: '/warehouse',
        name: 'Warehouse',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Warehouse" */ '../views/warehouse/index.vue')
      },
      {
        path: '/warehouse/add',
        name: 'WarehouseAdd',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Warehouse" */ '../views/warehouse/add.vue')
      },
      {
        path: '/warehouse/warehousing',
        name: 'Warehousing',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Warehousing" */ '../views/warehouse/warehousing/index.vue')
      },
      {
        path: '/warehouse/warehousing/add',
        name: 'WarehousingAdd',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "WarehousingAdd" */ '../views/warehouse/warehousing/add.vue')
      },
      {
        path: '/warehouse/warehousingLocation',
        name: 'WarehousingLocation',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "WarehousingLocation" */ '../views/warehouse/warehousingLocation/index.vue')
      },
      {
        path: '/couponlist',
        name: 'CouponList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Coupon" */ '../views/coupon/index.vue')
      },
      {
        path: '/couponList/detail',
        name: 'CouponDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CouponDetail" */ '../views/coupon/detail.vue')
      },
      {
        path: '/couponList/add',
        name: 'CouponAdd',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CouponAdd" */ '../views/coupon/add.vue')
      },
      {
        path: '/couponList/setting',
        name: 'CouponSetting',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "CouponSetting" */ '../views/coupon/setting.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  } 
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
