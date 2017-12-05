<template>
<div>
<b-navbar toggleable="md" type="light" sticky="true">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand to="/account"><img class="brand-logo" alt="easyWallet logo" src="../assets/logo.png" /></b-navbar-brand>
  <b-navbar-nav>
    <b-nav-text><b>{{ acc_name }}</b>&nbsp;{{ acc_address }}</p></b-nav-text>
    <b-nav-item v-on:click="copyAddress"><span class="fa fa-clone" /></b-nav-item>
  </b-navbar-nav>

  <b-navbar-nav class="ml-auto">
    <b-nav-item v-on:click="logoutWallet" right><span class="fa fa-power-off" /></b-nav-item>
  </b-navbar-nav>

</b-navbar>
<router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'AccountLayout',
  data () {
    return {
      acc_address: '0x9289234263489023786478',
      acc_name: 'Main account'
    }
  },
  methods: {
    copyAddress: function (event) {

    },
    logoutWallet: function (event) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
