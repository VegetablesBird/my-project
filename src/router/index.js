import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home/home'
import City from '@/page/city/city'
import Msite from '@/page/msite/msite'
import Shop from '@/page/shop/shop'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/city/:id',
      name: 'city',
      component: City
    },
    {
      path: '/msite',
      name: 'msite',
      component: Msite
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop
    }
  ]
})
