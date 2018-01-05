<template>
<div>
<div class="card">
  <div class="card-header">Ethereum</div>
  <div class="card-body">
    <h4 class="card-title">{{ account_name }}</h4>
    <p class="card-text">{{ account_address }}</p>
    <b-button v-on:click="passRemove(account_idx)" variant="danger" :data-id="account_idx">{{ btn_remove_msg }}</b-button>
    <b-button v-on:click="chooseAccount(account_idx)" variant="primary" :data-id="account_idx">{{ btn_choose_msg }}</b-button>
  </div>
</div>

</div>
</template>

<script>
export default {
  name: 'AccountCard',
  props: [ 'accountId', 'accountName', 'accountAddress', 'accountType' ],
  data () {
    return {
      btn_remove_msg: this.$lang.choose_account.btn_remove_text,
      btn_choose_msg: this.$lang.choose_account.btn_choose_text,
      account_name: this.accountName,
      account_address: this.accountAddress,
      account_idx: this.accountId,
      remove_text_title: this.$lang.choose_account.remove_text_title,
      remove_text_intro: this.$lang.choose_account.remove_text_intro,
      remove_text_warning: this.$lang.choose_account.remove_text_warning,
      remove_account_msg: 'Remove'
    }
  },
  methods: {
    chooseAccount: function (accountIdx, event) {
      this.$session.set('selectedAccountIndex', accountIdx)
      this.$session.set('authenticated', false)
      this.$router.push('/home/password')
    },
    passRemove: function (event) {
      this.$emit('removeCard', this.account_idx)
    }
  }
}
</script>
