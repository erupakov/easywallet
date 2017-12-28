<template>
<div class="card">
  <div class="card-header">Ethereum</div>
  <div class="card-body">
    <h4 class="card-title">{{ account_name }}</h4>
    <p class="card-text">{{ account_address }}</p>
    <b-button v-b-modal.modalRemove variant="danger" :data-id="account_idx">{{ btn_remove_msg }}</b-button>
    <b-button v-on:click="chooseAccount(account_idx)" variant="primary" :data-id="account_idx">{{ btn_choose_msg }}</b-button>
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
      account_idx: this.accountId
    }
  },
  methods: {
    chooseAccount: function (accountIdx, event) {
      var wallet = this.$ls.get('wallet', [])
      for (var i = 0; i < wallet['accounts'].length; i++) {
        if (wallet['accounts'][i].index === accountIdx) {
          this.$session.set('selectedAccountAddress', i)
          this.$session.set('authenticated', false)
          this.$router.push('/home/password')
        }
      }
    }
  }
}
</script>
