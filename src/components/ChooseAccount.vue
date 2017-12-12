<template>
<transition name="slide">
<div class="container-fluid">
	<div class="row">
	<div class="card-deck">
    <account-card v-for="ac in test_accounts" :key="ac.index" v-bind:account-id="ac.index" v-bind:account-name="ac.name"
    v-bind:account-address="ac.address" v-bind:account-type="ac.type"></account-card>
	</div>
	</div>
	<div class="row">
	<div class="col-xs-6 col-sm-5 col-md-4">
    <b-button variant="primary" block :disabled="create_disabled" v-on:click="newAccount" class="my-2" id="btnCreateAccount">{{ create_account_msg }}</b-button>
	</div>
	</div>
<div>
  <!-- Modal Component -->
  <b-modal id="modalRemove" :title="remove_text_title">
    <p class="my-4">{{ remove_text_intro }}</p>
	<div class="alert alert-danger">{{ remove_text_warning }}</div>
	<p><strong>Main account</strong></p>
	<p>0x342ba7a5d6c67f7e6893</p>
  </b-modal>
</div>
</div>
</transition>
</template>

<script>
import AccountCard from '@/components/AccountCard'
import ethUtil from 'ethereumjs-util'
import bitcoinjs from 'bitcoinjs-lib'

function deriveKey (index, extendedKey) {
  var key = extendedKey.derive(index)
  var address = key.getAddress().toString()
  var privkey = 'NA'
  var pubkey = key.getPublicKeyBuffer().toString('hex')
  var privKeyBuffer = key.keyPair.d.toBuffer()
  privkey = privKeyBuffer.toString('hex')
  var addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
  var hexAddress = addressBuffer.toString('hex')
  var checksumAddress = ethUtil.toChecksumAddress(hexAddress)
  address = ethUtil.addHexPrefix(checksumAddress)
  privkey = ethUtil.addHexPrefix(privkey)
  pubkey = ethUtil.addHexPrefix(pubkey)
  return { private: privkey, public: pubkey, address: address }
}

export default {
  name: 'ChooseAccount',
  data () {
    return {
      choose_msg: this.$lang.choose_account.choose_text,
      create_account_msg: 'Create new account',
      remove_text_title: this.$lang.choose_account.remove_text_title,
      remove_text_intro: this.$lang.choose_account.remove_text_intro,
      remove_text_warning: this.$lang.choose_account.remove_text_warning,
      test_accounts: [ ],
      create_disabled: false
    }
  },
  mounted: function () {
    var wallet = this.$session.get('wallet', [])
    this.test_accounts = wallet['accounts']
    if (wallet['accounts'].length === 0) {
      this.create_disabled = true
    }
  },
  methods: {
    accounts: function () {
      return this.test_accounts
    },
    newAccount: function (event) {
      // TODO: calculate currect account index according BIP-44 directions
      // on address gaping
      var wallet = this.$session.get('wallet', [])
      var nextIdx = 0
      for (var i = 0; i < wallet['accounts'].length; i++) {
        if (wallet['accounts'][i].index > nextIdx) {
          nextIdx = wallet['accounts'][i].index
        }
      }
      nextIdx++

      var derivePath = 'm/44\'/60\'/0\'/' + nextIdx
      var bip32ExtendedKey = bitcoinjs.HDNode.fromBase58(wallet['extendedKey'], bitcoinjs.networks.bitcoin)
      var newaccount = deriveKey(nextIdx, bip32ExtendedKey)
      // create initial wallet structure
      var acct = {
        index: nextIdx,
        type: 'ethereum',
        name: '',
        password: '',
        derivePath: derivePath,
        balance: '0',
        private: newaccount.private,
        public: newaccount.public,
        address: newaccount.address
      }
      wallet['accounts'].push(acct)
      this.$session.set('wallet', wallet)
      this.$session.set('selectedAccountIndex', wallet['accounts'].length - 1)
      this.$router.push('/home/name')
    }
  },
  components: {
    'account-card': AccountCard
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
