<template>
  <transition name="slide">
  <div class="logo col-12 col-sm-10 col-lg-8">
      <img class="img-responsive mx-auto" alt="easyWallet logo" src="../assets/logo.png">
      <router-view></router-view>
  </div>
  </transition>
</template>

<script>
import Welcome from '@/components/Welcome'

export default {
  name: 'LogoLayout',
  data () {
    return {
    }
  }
  }
  
  
      routes:[
    {
        path: '/',
        name: 'Welcome',
        component: Welcome
    },
    {
        path: '/home',
        name: 'LogoLayout',
        component: LogoLayout
    },
    {
        path: '/account',
        name: 'AccountLayout',
        component: AccountLayout
    }
  ]      
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
    margin-top: 1em;
    width: 260px;
}
</style>
