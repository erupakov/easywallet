<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <p>{{ backup_msg }}</p>
        <b-form-textarea rows="4"  v-model="seed_phrase" placeholder="Enter seed phrase"/>
        <div class="my-2 mx-auto">
	        <b-button variant="danger" v-on:click="goBack" id="btnBack">{{ btn_back_msg }}</b-button>        
	        <b-button variant="primary" v-on:click="checkSeed" id="btnConfirm">{{ btn_confirm_msg }}</b-button>
        </div>
    </div>
</div>
</transition>
</template>

<script>
import bip39 from 'bip39'
import bitcoinjs from 'bitcoinjs-lib'
import ethUtil from 'ethereumjs-utils'

export default {
  name: 'ConfirmAccount',
  data () {
    return {
      backup_msg: this.$lang.confirm_account.backup_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      btn_back_msg: this.$lang.confirm_account.btn_back_text,
      seed_phrase: ''
    };
  },
  methods: {
    goBack: function (event) {
      this.$router.back()
    },
    checkSeed: function (event) {
      var words = this.$session.get('mnemonicPhrase')
      if (this.seed_phrase !== words) {
        // mnemonic invalid
        this.$notify({
          group: 'flash',
          title: 'Incorrect seed phrase',
          text: 'Seed phrase validation failed, please try again.'
        })
      } else {
        // correct
        this.$notify({
          group: 'flash',
          title: 'Seed phrase correct',
          text: 'Seed phrase correct, opening wallet.'
        })

        var seed = null
        var bip32RootKey = null
        var bip32ExtendedKey = null
        var network = bitcoinjs.bitcoin.networks.bitcoin
        // calculate seed
        seed = bip39.toSeed(words, null)
        // calculate rootKey
        bip32RootKey = bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network)

        // clear words
        this.$session.clear('mnemonicPhrase')
        words = null
        var bip39ExtendedKey = this.calcBip39ExtendedKey(
          'm/44\'/60\'/0\'/0',
          bip32RootKey
        )
        // TODO: calculate currect account index according BIP-44 directions
        // on address gaping
        // create initial wallet structure
        var wallet = {
          rootKey: bip32RootKey,
          extendedKey: bip32ExtendedKey,
          accounts: [
            {
              type: 0,
              name: '',
              password: '',
              derivePath: '',
              balance: ''
            }
          ]
        };
        this.$session.set('wallet', wallet)
        this.$session.set('selectedAccountIndex', 0)
        this.$router.push('/home/name')
      }
    },
    calcBip32ExtendedKey: function(path, bip32RootKey) {
      // Check there's a root key to derive from
      if (!bip32RootKey) {
        return bip32RootKey
      }
      var extendedKey = bip32RootKey
      // Derive the key from the path
      var pathBits = path.split('/')
      for (var i = 0; i < pathBits.length; i++) {
        var bit = pathBits[i]
        var index = parseInt(bit)
        if (isNaN(index)) {
          continue
        }
        var hardened = bit[bit.length - 1] === '\'';
        var isPriv = !extendedKey.isNeutered()
        var invalidDerivationPath = hardened && !isPriv
        if (invalidDerivationPath) {
          extendedKey = null
        } else if (hardened) {
          extendedKey = extendedKey.deriveHardened(index)
        } else {
          extendedKey = extendedKey.derive(index)
        }
      }
      return extendedKey
    },
    deriveKey: function(index, extendedKey) {
      var key = extendedKey.derive(index)
      var privKeyBuffer = key.keyPair.d.toBuffer()
      var addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
      var hexAddress = addressBuffer.toString('hex')
      var checksumAddress = ethUtil.toChecksumAddress(hexAddress)
      var address = ethUtil.addHexPrefix(checksumAddress)
      var privkey = ethUtil.addHexPrefix(privkey)
      var pubkey = ethUtil.addHexPrefix(pubkey)
      return { private: privkey, public: pubkey, address: address }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
