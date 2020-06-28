import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/DashboardPage'),
      children: [
        {
          path: 'welcome',
          name: 'welcome',
          component: require('@/components/WelcomePage')
        },
        {
          path: 'heatMap',
          name: 'heatMap',
          component: require('@/components/HeatMapPage')
        },
        {
          path: 'init',
          name: 'init',
          component: require('@/components/House/InitPage')
        },
        {
          path: 'init/add',
          name: 'init_add',
          component: require('@/components/House/InitAddPage')
        },
        {
          path: 'priceChange',
          name: 'priceChange',
          component: require('@/components/House/PriceChangePage')
        }
        ,
        {
          path: 'community',
          name: 'community',
          component: require('@/components/House/CommunityPage')
        }

      ]
    },
    {
      path: '/wap',
      name: 'wap',
      component: require('@/components/WapPage'),
      children: [
        {
          path: '/',
          name: 'goods',
          component: require('@/components/Wap/GoodsPage')
        },
        {
          path: 'order',
          name: 'order',
          component: require('@/components/Wap/OrderPage')
        },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/LoginPage')
    },
    {
      path: '*',
      name: '/404',
      component: require('@/components/error-page/404')
    }
  ]
})
