<template>
  <b-card :title="account-name"
          :img-src="image_src"
          :img-alt="image_alt"
          img-top
          :tag="account-name"
          style="max-width: 20rem;"
          class="mb-2">
    <p class="card-text">{{ account-address }}</p>
    <b-button v-on:click="removeAccount" variant="danger">{{ btn_remove_msg }}</b-button>
    <b-button v-on:click="chooseAccount" variant="primary">{{ btn_choose_msg }}</b-button>
  </b-card>
</template>

<script>
export default {
  name: 'AccountCard',
  props: [ 'account-id', 'account-name', 'account-address', 'account-type'],
  data () {
    return {
      btn_remove_msg: this.$lang.choose_account.btn_remove_text,
      btn_choose_msg: this.$lang.choose_account.btn_choose_text
    }
  },
  methods: {
    chooseAccount: function (event) {
      alert('Chosen!')
    },
    removeAccount: function (event) {
      alert('Removed!')
    },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
