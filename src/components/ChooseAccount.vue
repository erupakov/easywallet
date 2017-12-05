<template>
<transition name="slide">
    <b-card-group columns>
        <account-card v-for="(ac, index) in accounts" :key="ac.account-id" account-id="ac.id" account-name="ac.name"
        account-address="ac.address" account-type="ac.type" ></account-card>
    </b-card-group>
</transition>
</template>

<script>
export default {
  name: 'ChooseAccount',
  data() {
    return {
      choose_msg: this.$lang.choose_account.choose_text,
      accounts: ''
    }
  },
  methods: {
    mounted: function() {
      accounts = [
        {
          id: 1,
          name: "Main account",
          address: "0x34239286742378234",
          type: "eth"
        },
        {
          id: 2,
          name: "Second account",
          address: "0xfed3928c6b74aa230b78234",
          type: "eth"
        },
        {
          id: 3,
          name: "Third account",
          address: "0xca21ed3928c6b74aa230b78234",
          type: "eth"
        }
      ]
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
