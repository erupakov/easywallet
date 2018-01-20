<template>
<transition name="slide">
<div>
  <h1 class="logotype-title">{{ $lang.welcome.welcome_text }}</h1>
  <form class="login">
    <h3>{{ $lang.create_account.title_text }}</h3>
    <p class="alert alert-warning">{{ $lang.create_account.backup_text }}</p>
    <div class="form-group generated-phrase">
      <input class="form-control" id="inputPhrase" type="text" :value="seed_phrase" readonly required>
      <button class="copy-button" type="button" data-id="inputPhrase">
        <svg>
          <use xlink:href="#icon-copy"></use>
        </svg>
      </button>
    </div>
  </form>
  <div class="underform-line clearfix"><a class="pull-left" :href="$router.back()">Forgot Phrase?</a><a class="pull-right" href="#" v-on:click="$router.push('/home/confirm')" id="btnManageAccount">Confirm</a></div>
</div>
</transition>
</template>

<script>
import bip39 from 'bip39'

export default {
  name: 'CreateAccount',
  data () {
    return {
      seed_phrase: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // show the words
      var words = bip39.generateMnemonic()
      this.$session.set('mnemonicPhrase', words)
      this.seed_phrase = words
      this.$notify({
        group: 'flash',
        type: 'success',
        title: this.$lang.create_account.notif_account_created_title,
        text: this.$lang.create_account.notif_account_created_text
      })
    })
  },
  methods: {
    goBack: function (event) {
      this.$router.back()
    }
  }
}
</script>

