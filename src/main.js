/* jshint esversion: 6 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './bootstrap'
import Vue from 'vue'
import App from './App'
import router from './router'
import Lang from 'vuejs-localization'
import Notifications from 'vue-notification'
import VueSessionStorage from 'vue-sessionstorage'
import VueClipboard from 'vue-clipboard2'
import VueLocalStorage from 'vue-ls'
import '@/assets/css/main.css'
require('@/assets/plugins/consoleFix.js')
require('@/assets/plugins/placeholder.js')
require('@/assets/plugins/bootstrap-validator/dist/validator.min.js')
require('@/assets/plugins/inputmask/jquery.inputmask.bundle.min.js')
require('@/assets/js/app.js')

var options = {
  namespace: 'easyWallet__'
}

Lang.requireAll(require.context('../lang', true, /\.js$/))

Vue.use(Lang)
Vue.use(Notifications)
Vue.use(VueSessionStorage)
Vue.use(VueClipboard)
Vue.use(VueLocalStorage, options)

Vue.config.productionTip = false

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
