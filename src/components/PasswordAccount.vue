<template>
<transition>
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <p><b>{{ account_name }}</b>:{{ account_address }}</p>
        <label for="account_password">{{ enter_pwd_msg }}</label>
        <b-form-input v-model="account_password" placeholder="Enter password" name="account_password" type="password" required/>
        <div class="my-2 mx-auto">
	        <b-button style="width: 240px;" variant="primary" v-on:click="loginAccount" id="btnLogin">{{ btn_login_msg }}</b-button>
        </div>
        <b-link to="/home/choose" >{{ another_account_msg }}</b-link>        
    </div>
</div>
</transition>
</template>

<script>
import ethUtil from 'ethereumjs-util'

export default {
  name: 'PasswordAccount',
  data () {
    return {
      account_name: '',
      account_address: '',
      another_account_msg: 'Use another account',
      btn_login_msg: 'Login',
      enter_pwd_msg: 'Enter your password',
      account_password: ''
    }
  },
  mounted: function () {
    this.$session.set('authenticated', false)
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      var wallet = this.$ls.get('wallet')
      var accountIdx = 0
      if (this.$session.exists('selectedAccountIndex')) {
        accountIdx = this.$session.get('selectedAccountIndex')
      }
      this.account_name = wallet['accounts'][accountIdx].name
      this.account_address = wallet['accounts'][accountIdx].address
    },
    loginAccount: function () {
      var wallet = this.$ls.get('wallet')
      var accountIdx = 0
      if (this.$session.exists('selectedAccountIndex')) {
        accountIdx = this.$session.get('selectedAccountIndex')
      }
      var hash = ethUtil.bufferToHex(ethUtil.sha3(this.account_password))
      if (hash !== wallet['accounts'][accountIdx].password) {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Login incorrect',
          text: 'The password you entered is incorrect. Please try again'
        })
      } else {
        this.$session.set('authenticated', true)
        this.$router.push('/account/manage')
      }
    }
  }
}
</script>
