<template>
<div>
    <header class="header">
      <nav class="navbar navbar-default">
        <div class="container">
          <div class="navbar-header">
            <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#menu" aria-expanded="false"></button><a class="navbar-brand" href="/"><img src="../assets/images/logo.png" alt="logo"><span class="title">Easy Wallet</span></a>
          </div>
          <div class="collapse navbar-collapse" id="menu"><a class="menu" href="#"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a>
          </div>
        </div>
      </nav>
    </header>
    <div class="main-wrapper">
      <router-view></router-view>
    </div>
</div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'AccountLayout',
  data () {
    return {
      acc_address: '',
      acc_name: ''
    }
  },
  mounted: function () {
    $('body').addClass('dashboard')
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

