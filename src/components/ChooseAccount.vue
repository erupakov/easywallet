<template>
<transition name="slide">
<div class="container-fluid">
	<div class="row">
	<div class="card-deck">
    <account-card v-for="(ac,index) in test_accounts" :key="index" v-bind:account-id="index" v-bind:account-name="ac.name"
    v-bind:account-address="ac.address" v-bind:account-type="ac.type" v-on:removeCard="showRemoveCard"></account-card>
	</div>
	</div>
	<div class="row">
	<div class="col-xs-6 col-sm-5 col-md-4">
    <b-button variant="primary" block v-on:click="newAccount" class="my-2" id="btnCreateAccount">{{ create_account_msg }}</b-button>
	</div>
	</div>
<div>
  <!-- Modal Component -->
  <b-modal id="modalRemove" ref="modalRemoveWindow" ok-only :title="remove_text_title">
    <p class="my-4">{{ remove_text_intro }}</p>
	  <div class="alert alert-danger">{{ remove_text_warning }}</div>
	  <p><strong>{{ removemodal_account_name }}</strong></p>
	  <p>{{ removemodal_account_address }}</p>
    <b-button variant="danger" v-on:click="removeAccount" class="my-2" id="btnRemoveAccount">{{ remove_account_msg }}</b-button>
  </b-modal>
</div>
</div>
</transition>
</template>

<script>
import AccountCard from '@/components/AccountCard'

export default {
  name: 'ChooseAccount',
  data () {
    return {
      choose_msg: this.$lang.choose_account.choose_text,
      create_account_msg: 'Create new account',
      remove_text_title: this.$lang.choose_account.remove_text_title,
      remove_text_intro: this.$lang.choose_account.remove_text_intro,
      remove_text_warning: this.$lang.choose_account.remove_text_warning,
      removemodal_account_address: '',
      removemodal_account_name: '',
      remove_account_msg: 'Remove',
      test_accounts: [ ],
      remove_idx: 0
    }
  },
  mounted: function () {
    var wallet = this.$ls.get('wallet')
    this.test_accounts = wallet['accounts']
  },
  methods: {
    newAccount: function (event) {
      this.$router.push('/home/name')
    },
    removeAccount: function (event) {
      var wallet = this.$ls.get('wallet', [])
      wallet['accounts'].splice(this.remove_idx, 1)
      this.test_accounts.splice(this.remove_idx, 1)
      this.$ls.set('wallet', wallet)
    },
    showRemoveCard: function (idx, event) {
      this.remove_idx = idx
      var wallet = this.$ls.get('wallet', [])
      this.removemodal_account_address = wallet['accounts'][idx].address
      this.removemodal_account_name = wallet['accounts'][idx].name
      this.$refs.modalRemoveWindow.show()
    }
  },
  components: {
    'account-card': AccountCard
  }
}
</script>
