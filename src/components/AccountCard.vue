<template>
<div class="card">
  <div class="card-header">Ethereum</div>
  <div class="card-body">
    <h4 class="card-title">{{ account_name }}</h4>
    <p class="card-text">{{ account_address }}</p>
    <b-button v-on:click="removeAccount" variant="danger">{{ btn_remove_msg }}</b-button>
    <b-button v-on:click="chooseAccount" variant="primary">{{ btn_choose_msg }}</b-button>
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
      image_src: '',
      image_alt: ''
    }
  },
  methods: {
    chooseAccount: function (event) {
      alert('Chosen!')
    },
    removeAccount: function (event) {
      alert('Removed!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
