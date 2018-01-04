<template>
<div>
<div class="card">
  <div class="card-header">Ethereum</div>
  <div class="card-body">
    <h4 class="card-title">{{ account_name }}</h4>
    <p class="card-text">{{ account_address }}</p>
    <b-button v-b-modal.modalRemove variant="danger" :data-id="account_idx">{{ btn_remove_msg }}</b-button>
    <b-button v-on:click="chooseAccount(account_idx)" variant="primary" :data-id="account_idx">{{ btn_choose_msg }}</b-button>
  </div>
</div>
  <!-- Modal Component -->
  <b-modal id="modalRemove" :title="remove_text_title">
    <p class="my-4">{{ remove_text_intro }}</p>
	<div class="alert alert-danger">{{ remove_text_warning }}</div>
	<p><strong>{{ account_name }}</strong></p>
	<p>{{ account_address }}</p>
    <b-button variant="danger" v-on:click="removeAccount" class="my-2" id="btnRemoveAccount">{{ remove_account_msg }}</b-button>
  </b-modal>
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
      this.$session.set('selectedAccountAddress', accountIdx)
      this.$session.set('authenticated', false)
      this.$router.push('/home/password')
    },
    removeAccount: function (event) {
      var wallet = this.$ls.get('wallet', [])
      wallet['accounts'].slice(this.account_idx)
      this.$ls.set('wallet', wallet)
    }
  }
}
</script>
