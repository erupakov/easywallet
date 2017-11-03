<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <p>{{ backup_msg }}</p>
        <b-form-textarea rows="6"/>
        <div class="my-2 mx-auto">
        <b-button variant="danger" v-on:click="goBack" id="btnBack">{{ btn_back_msg }}</b-button>        
        <b-button variant="primary" to="/home/name" id="btnNameAccount">{{ btn_confirm_msg }}</b-button>
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
      btn_back_msg: this.$lang.confirm_account.btn_back_text
    }
  },
  methods: {
    goBack: function (event) {
      this.$router.back()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
