<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <p>{{ backup_msg }}</p>
        <b-form-textarea rows="4"  v-model="seed_phrase" placeholder="Enter seed phrase"/>
        <div class="my-2 mx-auto">
	        <b-button variant="danger" v-on:click="goBack" id="btnBack">{{ btn_back_msg }}</b-button>        
	        <b-button variant="primary" v-on:click="checkSeed" id="btnNameAccount">{{ btn_confirm_msg }}</b-button>
        </div>
    </div>
</div>
</transition>
</template>

<script>
export default {
  name: 'ConfirmAccount',
  data () {
    return {
      backup_msg: this.$lang.confirm_account.backup_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      btn_back_msg: this.$lang.confirm_account.btn_back_text,
      seed_phrase: ''
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

        this.$router.to('/home/name')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
