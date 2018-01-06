<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <label for="account_name">{{ enter_name_msg }}
          <small>{{ enter_name_tip_msg }}</small>
        </label>
        <b-form-input v-model="account_name" placeholder="Enter your name and surname" name="account_name" required/>
        <label for="account_password">{{ enter_pwd_msg }}</label>
        <b-form-input v-model="account_password" placeholder="Enter password" name="account_password" type="password" required/>
        <label for="account_password_confirmation">{{ confirm_pwd_msg }}</label>
        <b-form-input v-model="account_password_confirmation" placeholder="Confirm password" name="account_password_confirmation" type="password" required/>
        <b-form-checkbox id="checkbox1"
                     v-model="agree_with_terms"
                     value="accepted"
                     unchecked-value="not_accepted">
          {{ agree_with_terms_msg }}
          <b-link v-b-modal.serviceTerms href="#">{{ read_here_msg }}</b-link>
        </b-form-checkbox>
        <vue-recaptcha sitekey="6Le6ez4UAAAAAGUDVxtXhzdFuvCEwswpevK03Yd4" ref="recaptcha"
          @verify="onVerify"
          @expired="onExpired"></vue-recaptcha>
        <div class="my-2 mx-auto">
	        <b-button variant="primary" v-on:click="setName" id="btnSetName">{{ btn_confirm_msg }}</b-button>
        </div>
    </div>
  <!-- Modal Component -->
  <b-modal id="serviceTerms" title="Terms of service" ok-only button-size="large">
    <p class="my-4"><strong>Please read and agree with our terms of service:</strong></p>
	  <p>Term 1</p>
  	<p>Term 2</p>
	  <p>Term 3</p>
  </b-modal>
</div>
</transition>
</template>

<script>
import ethUtil from 'ethereumjs-util'
import axios from 'axios'
import VueRecaptcha from 'vue-recaptcha'

const gSecret = '6Le6ez4UAAAAAGEaFQmlgbdeamm0J3Jsls2GpxDP'

export default {
  name: 'NameAccount',
  components: { VueRecaptcha },
  data () {
    return {
      enter_name_msg: this.$lang.confirm_account.enter_name_text,
      enter_name_tip_msg: this.$lang.confirm_account.enter_name_tip_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      enter_pwd_msg: this.$lang.confirm_account.enter_pwd_text,
      confirm_pwd_msg: this.$lang.confirm_account.confirm_pwd_text,
      agree_with_terms_msg: this.$lang.confirm_account.agree_with_terms_text,
      read_here_msg: 'read them here',
      account_name: '',
      account_password: '',
      account_password_confirmation: '',
      captchaResponse: '',
      agree_with_terms: 'not_accepted'
    }
  },
  methods: {
    onVerify: function (response) {
      this.captchaResponse = response
    },
    onExpired: function () {
    },
    setName: function (event) {
      if (this.account_name === '' || this.account_password === '') {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Error',
          text: 'Name and password should not be empty' + gSecret
        })
        return
      }
      if (this.account_password !== this.account_password_confirmation) {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Error',
          text: 'Password and confirmation does not match'
        })
        return
      }
      // check recaptcha
      if (this.captchaResponse === '') {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Error',
          text: 'Need to pass ReCAPTCHA test before submitting'
        })
        return
      }
      axios.post('https://wallet.brusnika.biz/check_captcha.php', {
        response: this.captchaResponse
      })
        .then(response => {
          if (response.data.success) { // success, proceed with wallet
            axios.post('https://wallet.brusnika.biz/send_notice.php', {
              name: this.account_name
            }).then(response => {
              this.$notify({
                group: 'flash',
                type: 'success',
                title: 'Mail sent',
                text: 'Email was sent successfully.'
              })
            }).catch(error => {
              this.$notify({
                group: 'flash',
                type: 'error',
                title: 'Error',
                text: 'Error sending email: ' + error
              })
              console.log(JSON.stringify(error))
            })
            var idx = this.$session.get('selectedAccountIndex')
            var wallet = this.$ls.get('wallet')

            wallet['accounts'][idx].name = this.account_name
            wallet['accounts'][idx].password = ethUtil.bufferToHex(ethUtil.sha3(this.account_password))

            this.$ls.set('wallet', wallet)
            this.$session.set('authenticated', true)
            this.$router.push('/account/manage')
          } else { // response data unsuccess
            this.$notify({
              group: 'flash',
              type: 'error',
              title: 'Error',
              text: 'ReCAPTCHA did not pass please try again in a few minutes'
            })
            console.log(JSON.stringify(response.data))
          }
        })
    }
  }
}
</script>
