import Vue from 'vue'
import Router from 'vue-router'
import LogoLayout from '@/components/LogoLayout'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'LogoLayout',
        component: LogoLayout
    }
  ]
})
