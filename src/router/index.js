import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/home/index'
import Photos from '@/view/photos/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/photos',
      name: 'Photos',
      component: Photos
    }
  ]
})
