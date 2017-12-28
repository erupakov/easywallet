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
import VueSessionStorage from 'vue-sessionstorage'
import VueClipboard from 'vue-clipboard2'
import VueLocalStorage from 'vue-ls'
import VueRecaptcha from 'vue-grecaptcha'

var options = {
  namespace: 'easyWallet__'
}

Lang.requireAll(require.context('../lang', true, /\.js$/))

Vue.use(BootstrapVue)
Vue.use(Lang)
Vue.use(Notifications)
Vue.use(VueSessionStorage)
Vue.use(VueClipboard)
Vue.use(VueLocalStorage, options)
Vue.use(VueRecaptcha, {
  sitekey: '6Le6ez4UAAAAAGUDVxtXhzdFuvCEwswpevK03Yd4'
})

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
