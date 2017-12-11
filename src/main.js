/* jshint esversion: 6 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Lang from 'vuejs-localization'
import Notifications from 'vue-notification'
import Web3 from 'web3'
import VueSessionStorage from 'vue-sessionstorage'

Lang.requireAll(require.context('../lang', true, /\.js$/))

Vue.use(BootstrapVue)
Vue.use(Lang)
Vue.use(Notifications)
Vue.use(VueSessionStorage)

Vue.config.productionTip = false

var web3

// set provider for all later instances to use

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(Web3.givenProvider || 'wss://wallet.brusnika.biz:8546')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  data () {
    return {
    }
  }
})
