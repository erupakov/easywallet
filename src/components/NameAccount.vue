<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <label for="account_name">{{ enter_name_msg }}
          <small>{{ enter_name_tip_msg }}</small>
        </label>
        <b-form-input v-model="account_name" placeholder="Enter account name" name="account_name" required/>
        <label for="account_password">{{ enter_pwd_msg }}</label>
        <b-form-input v-model="account_password" placeholder="Enter password" name="account_password" type="password" required/>
        <label for="account_password_confirmation">{{ confirm_pwd_msg }}</label>
        <b-form-input v-model="account_password_confirmation" placeholder="Confirm password" name="account_password_confirmation" type="password" required/>
        <div class="my-2 mx-auto">
	        <b-button variant="primary" v-on:click="setName" id="btnSetName">{{ btn_confirm_msg }}</b-button>
        </div>
    </div>
</div>
</transition>
</template>

<script>
import ethUtil from 'ethereumjs-util'

const g_secret='6Le6ez4UAAAAAGEaFQmlgbdeamm0J3Jsls2GpxDP';

export default {
  name: 'NameAccount',
  data () {
    return {
      enter_name_msg: this.$lang.confirm_account.enter_name_text,
      enter_name_tip_msg: this.$lang.confirm_account.enter_name_tip_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      enter_pwd_msg: this.$lang.confirm_account.enter_pwd_text,
      account_name: '',
      account_password: '',
      account_password_confirmation: ''
    }
  },
  methods: {
    setName: function (event) {
      if (this.account_name === '' || this.account_password === '') {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Error',
          text: 'Name and password should not be empty'
        })
        return
      }
      if (this.account_password !== this.account_password_confirmation) {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Error',
          text: 'Password confirmation does not match password'
        })
        return
      }
      var wallet = this.$ls.get('wallet')
      var accountIdx = 0
      if (this.$session.exists('selectedAccountIndex')) {
        accountIdx = this.$session.get('selectedAccountIndex')
      }
      wallet['accounts'][accountIdx].name = this.account_name
      wallet['accounts'][accountIdx].password = ethUtil.bufferToHex(ethUtil.sha3(this.account_password))
      this.$ls.set('wallet', wallet)
      this.$session.set('authenticated', true)
      this.$router.push('/account/manage')
    }
  }
}
</script>
