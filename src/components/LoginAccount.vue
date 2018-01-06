<template>
<transition name="slide">
  <h1 class="logotype-title">{{ $lang.welcome.welcome_text }}</h1>
  <div class="relogin">
    <div class="form-group">
      <label class="control-label" for="inputPhrase">{{ $lang.login_account.backup_text }}</label>
      <input class="form-control" id="inputPhrase" v-model="seed_phrase" type="text" :placeholder="$lang.login_account.enter_seed_phrase_text" required>
        <button type="submit">
          <svg>
            <use xlink:href="#icon-arrow-right"></use>
          </svg>
        </button>
    </div>
  </div>
  <div class="underform-line clearfix">
    <a class="pull-left" href="#" v-on:click="goBack">{{ $lang.login_account.btn_back_msg }}</a>
    <a class="pull-right" v-on:click="checkSeed" id="btnProceed" href="#">{{ $lang.login_account.btn_proceed_text }}</a>
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

async function restoreWallet (words, obj) {
  var seed = null
  var bip32RootKey = null
  var network = bitcoinjs.networks.bitcoin
  // calculate seed
  seed = bip39.mnemonicToSeed(words, null)
  // calculate rootKey
  bip32RootKey = bitcoinjs.HDNode.fromSeedHex(seed, network)

  // clear words
  var derivePath = 'm/44\'/60\'/0\'/0'
  var bip32ExtendedKey = calcBip32ExtendedKey(
    derivePath,
    bip32RootKey
  )
  // TODO: calculate currect account index according BIP-44 directions
  // on address gaping
  var account0 = deriveKey(0, bip32ExtendedKey)
  // create initial wallet structure
  var acct = {
    index: 0,
    type: 'Ethereum',
    name: '',
    password: '',
    derivePath: derivePath,
    extendedKey: bip32ExtendedKey.toBase58(),
    balance: 0,
    symbol: 'ETH',
    private: account0.private,
    public: account0.public,
    address: account0.address
  }
  var wallet = obj.$ls.get('wallet', { accounts: [] })
  wallet['accounts'].push(acct)
  obj.$session.set('selectedAccountIndex', wallet['accounts'].length - 1)
  obj.$session.set('authenticated', true)
  return obj
}

export default {
  name: 'LoginAccount',
  data () {
    return {
      seed_phrase: '',
      show_spinner: false,
    }
  },
  methods: {
    goBack: function (event) {
      this.$router.back()
    },
    checkSeed: function (event) {
      if (!bip39.validateMnemonic(this.seed_phrase)) {
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

        this.show_spinner = true
        restoreWallet(this.seed_phrase, this)
          .then(function (obj) {
            obj.show_spinner = false
            obj.$router.push('/home/restore')
          })
      }
    }
  }
}
</script>

