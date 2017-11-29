/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
import LogoLayout from '@/components/LogoLayout'
import AccountLayout from '@/components/AccountLayout'
import CreateAccount from '@/components/CreateAccount'
import ConfirmAccount from '@/components/ConfirmAccount'
import LoginAccount from '@/components/LoginAccount'
import NameAccount from '@/components/NameAccount'
import PasswordAccount from '@/components/PasswordAccount'
import ProceedAccount from '@/components/ProceedAccount'
import Welcome from '@/components/Welcome'

import ManageWallet from '@/components/ManageWallet'
import SendWallet from '@/components/SendWallet'
import HistoryWallet from '@/components/HistoryWallet'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: LogoLayout,
      children: [
        {
          path: '/',
          component: Welcome
        },
        {
          path: 'create',
          component: CreateAccount
        },
        {
          path: 'confirm',
          component: ConfirmAccount
        },
        {
          path: 'proceed',
          component: ProceedAccount
        },
        {
          path: 'name',
          component: NameAccount
        },
        {
          path: 'password',
          component: PasswordAccount
        },
        {
          path: 'login',
          component: LoginAccount
        }
      ]
    },
    {
      path: '/account',
      component: AccountLayout,
      children: [
        {
          path: '/',
          redirect: 'manage'
        },
        {
          path: 'manage',
          component: ManageWallet
        },
        {
          path: 'send',
          component: SendWallet
        },
        {
          path: 'history',
          component: HistoryWallet
        }
      ]
    }
  ]
})
