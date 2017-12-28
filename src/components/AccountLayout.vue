<template>
<div>
<b-navbar toggleable="md" type="light" fixed>

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand to="/account/manage"><img class="img-responsive" style="height: 50px;" alt="easyWallet logo" src="../assets/logo.png" /></b-navbar-brand>
  <b-collapse is-nav id="nav_collapse">
  <b-navbar-nav>
    <b-nav-text><b>{{ acc_name }}</b>&nbsp;{{ acc_address }}</b-nav-text>
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
export default {
  name: 'AccountLayout',
  data () {
    return {
      acc_address: '',
      acc_name: ''
    }
  },
  mounted: function () {
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      var wallet = this.$ls.get('wallet', [])
      var accountIdx = 0
      if (this.$session.exists('selectedAccountIndex')) {
        accountIdx = this.$session.get('selectedAccountIndex')
      }
      this.acc_address = wallet['accounts'][accountIdx].address
      this.acc_name = wallet['accounts'][accountIdx].name
    },
    copyAddress: function (event) {
      this.$copyText(this.acc_address)
      this.$notify({
        group: 'flash',
        title: 'Address copied',
        text: 'We have successfully copied address to clipboard'
      })
    },
    logoutWallet: function (event) {
      this.$session.set('authenticated', false)
      this.$router.push('/home/password')
    }
  }
}
</script>

