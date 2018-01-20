<template>
<transition name="slide" v-on:submit.prevent="checkSeed">
<div>
        <form class="relogin" ref="formConfirm">
          <div class="form-group">
            <label for="inputPhrase" class="control-label">{{ $lang.confirm_account.backup_text }}</label>
            <input class="form-control" id="inputPhrase" name="inputPhrase" v-model="seed_phrase" type="text" :placeholder="$lang.confirm_account.enter_seed_text" required>
            <button type="submit">
              <svg>
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </button>
          </div>
        </form>
        <div class="underform-line clearfix">
            <a class="pull-left" href="#" @click="$router.back()">{{ $lang.confirm_account.btn_back_text }}</a>
            <a class="pull-right" href="#" @click="this.$refs.formConfirm.submit()">{{ $lang.confirm_account.btn_confirm_text.btn_confirm_text }}</a>
        </div>
</div>
</transition>
</template>

<script>
import bip39 from 'bip39'
import bitcoinjs from 'bitcoinjs-lib'
import ethUtil from 'ethereumjs-util'

function calcBip32ExtendedKey (path, bip32RootKey) {
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
    var hardened = bit[bit.length - 1] === '\''
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
}

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
  name: 'ConfirmAccount',
  data () {
    return {
      backup_msg: this.$lang.confirm_account.backup_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      btn_back_msg: this.$lang.confirm_account.btn_back_text,
      seed_phrase: '',
      show_spinner: false,
      modal_label: this.$lang.confirm_account.generating_account_text
    }
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
          type: 'error',
          title: 'Incorrect seed phrase',
          text: 'Seed phrase validation failed, please try again.'
        })
      } else {
        // correct
        this.$notify({
          group: 'flash',
          type: 'success',
          title: 'Seed phrase correct',
          text: 'Seed phrase correct, opening wallet.'
        })

        var seed = null
        var bip32RootKey = null
        var network = bitcoinjs.networks.bitcoin
        // calculate seed
        seed = bip39.mnemonicToSeed(words, null)
        // calculate rootKey
        bip32RootKey = bitcoinjs.HDNode.fromSeedHex(seed, network)

        // clear words
        this.$session.remove('mnemonicPhrase')
        words = null
        var derivePath = 'm/44\'/60\'/0\'/0'
        var bip32ExtendedKey = calcBip32ExtendedKey(
          derivePath,
          bip32RootKey
        )
        // TODO: calculate currect account index according BIP-44 directions
        // on address gaping
        var account0 = deriveKey(0, bip32ExtendedKey)
        // create initial wallet structure
        var selectedIdx = this.$session.get('selectedAccountIndex')
        var wallet = this.$ls.get('wallet')
        wallet['accounts'][selectedIdx].derivePath = derivePath
        wallet['accounts'][selectedIdx].extendedKey = bip32ExtendedKey.toBase58()
        wallet['accounts'][selectedIdx].private = account0.private
        wallet['accounts'][selectedIdx].public = account0.public
        wallet['accounts'][selectedIdx].address = account0.address

        this.$ls.set('wallet', wallet)
        this.$router.push('/account/manage')
      }
    }
  }
}
</script>
