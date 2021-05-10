import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
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
          path: 'init_add',
          name: 'init_add',
          component: require('@/components/House/InitAddPage')
        },

        {
          path: 'community',
          name: 'community',
          component: require('@/components/House/CommunityPage')
        },
        {
          path: 'priceChange',
          name: 'priceChange',
          component: require('@/components/House/PriceChangePage')
        }

      ]
    },

    {
      path: '*',
      name: '/404',
      component: require('@/components/error-page/404')
    }
  ]
})
