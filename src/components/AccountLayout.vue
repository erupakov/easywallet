<template>
<div>
<b-navbar toggleable="md" type="light" sticky >

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand to="/account/manage"><img class="img-responsive" style="height: 50px;" alt="easyWallet logo" src="../assets/logo.png" /></b-navbar-brand>
  <b-collapse is-nav id="nav_collapse">
  <b-navbar-nav>
    <b-nav-text><b>{{ acc_name }}</b>&nbsp;{{ acc_address }}</p></b-nav-text>
    <b-nav-item v-on:click="copyAddress"><span class="fa fa-clone"></span></b-nav-item>
  </b-navbar-nav>

  <b-navbar-nav class="ml-auto">
    <b-nav-item v-on:click="logoutWallet" right><span class="fa fa-power-off"></span></b-nav-item>
  </b-navbar-nav>
  </b-collapse>
</b-navbar>
<router-view></router-view>
</div>
</template>

<script>

function updateEthBalance () {
  return 0
}

function updateTokenBalance () {
  return 0
}

export default {
  name: 'AccountLayout',
  data () {
    return {
      acc_address: '',
      acc_name: ''
    }
  },
  methods: {
    updated: function () {
      this.$nextTick(function () {
        var wallet = this.$session.get('wallet', [])
        var accountIdx = this.$session.get('selectedAccountIndex', 0)
        this.acc_address = wallet['accounts'][accountIdx].address
        this.acc_name = wallet['accounts'][accountIdx].name
        this.acc_address = updateTokenBalance()
        this.acc_name = updateEthBalance()
      })
    },
    copyAddress: function (event) {

    },
    logoutWallet: function (event) {
      this.$session.remove('selectedAccountIndex')
      this.$router.push('/home/choose')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
