<template>
<transition name="slide">
<div>
  <h1 class="logotype-title">{{ $lang.welcome.welcome_text }}</h1>
    <form class="register" v-on:submit="setName" name="registerForm">
      <div class="form-group">
        <input class="form-control" v-model="account_name" id="account_name" name="account_name" type="text" :placeholder="$lang.confirm_account.enter_name_tip_text" required>
      </div>
      <div class="form-group">
        <input class="form-control" v-model="account_password" :placeholder="$lang.confirm_account.enter_pwd_text" name="account_password" type="password" required>
      </div>
      <div class="form-group">
        <input class="form-control" v-model="account_password_confirmation" :placeholder="$lang.confirm_account.confirm_pwd_text" name="account_password_confirmation" type="password" required>
      </div>
      <div class="form-group">
        <input id="checkbox1" class="form-control" type="checkbox" v-model="agree_with_terms" value="accepted">
          {{ $lang.confirm_account.agree_with_terms_text }}
          <a class="btn btn-link" data-target="#serviceTerms" data-toggle="modal" href="#">{{ $lang.confirm_account.read_here_text }}</a>
      </div>
      <div class="form-group">      
        <vue-recaptcha sitekey="6Le6ez4UAAAAAGUDVxtXhzdFuvCEwswpevK03Yd4" ref="recaptcha"
          @verify="onVerify"
          @expired="onExpired"></vue-recaptcha>
      </div>
            <button type="submit"><span>{{ $lang.confirm_account.create_account_btn }}</span>
              <svg>
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </button>
    </form>
  <!-- Modal Component -->
    <div class="modal fade" id="serviceTerms" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-head">
          <h3>{{ $lang.confirm_account.terms_of_service_title }}</h3>
        </div>
        <div class="modal-content">
          <p class="my-4"><strong>{{ $lang.confirm_account.terms_of_service_text }}</strong></p>
	        <p>{{ $lang.confirm_account.terms_of_service_text_paragraph_1 }}</p>
  	      <p>{{ $lang.confirm_account.terms_of_service_text_paragraph_2 }}</p>
	        <p>{{ $lang.confirm_account.terms_of_service_text_paragraph_3 }}</p>
        </div>
      </div>
    </div>
</div>
</transition>
</template>

<script>
import ethUtil from 'ethereumjs-util'
import axios from 'axios'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'NameAccount',
  components: { VueRecaptcha },
  data () {
    return {
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
      event.preventDefault()
      if (this.account_name === '' || this.account_password === '') {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Input error',
          text: 'Name and password should not be empty'
        })
        return
      }
      if (this.account_password !== this.account_password_confirmation) {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Input error',
          text: 'Password and confirmation does not match'
        })
        return
      }
      // check recaptcha
      if (this.captchaResponse === '') {
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Input error',
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
              console.log(JSON.stringify(response.data))
            }).catch(error => {
              console.log(JSON.stringify(error))
            })
            // create wallet
            var wallet = this.$ls.get('wallet', { accounts: [] })

            var accountIdx = 0
            if (wallet['accounts'].length > 0) {
              accountIdx = wallet['accounts'].length
            }
            this.$session.set('selectedAccountIndex', accountIdx)

            var acct = {
              index: 0,
              type: 'Ethereum',
              name: this.account_name,
              password: ethUtil.bufferToHex(ethUtil.sha3(this.account_password)),
              derivePath: '',
              extendedKey: '',
              balance: 0,
              symbol: 'ETH',
              private: '',
              public: '',
              address: ''
            }
            wallet['accounts'].push(acct)
            this.$ls.set('wallet', wallet)
            this.$session.set('authenticated', true)
            this.$router.push('/home/create')
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
