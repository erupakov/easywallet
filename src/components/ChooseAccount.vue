<template>
<transition name="slide">
<div class="container-fluid">
	<div class="row">
    <account-card v-for="ac in test_accounts" :key="ac.id" v-bind:account-id="ac.id" v-bind:account-name="ac.name"
    v-bind:account-address="ac.address" v-bind:account-type="ac.type"></account-card>
	</div>
	<div class="row">
	<div class="col-xs-6 col-sm-5 col-md-4">
    <b-button variant="primary" block="true" to="/home/newaccount" class="my-2" id="btnCreateAccount">{{ create_account_msg }}</b-button>
	</div>
	</div>
</div>
</transition>
</template>

<script>
import AccountCard from '@/components/AccountCard'

export default {
  name: 'ChooseAccount',
  data () {
    return {
      choose_msg: this.$lang.choose_account.choose_text,
      create_account_msg: 'Create new account',
      test_accounts: [
        {
          id: 1,
          name: 'Main account',
          address: '0x34239286742378234',
          type: 'eth'
        },
        {
          id: 2,
          name: 'Second account',
          address: '0xfed3928c6b74aa230b78234',
          type: 'eth'
        },
        {
          id: 3,
          name: 'Third account',
          address: '0xca21ed3928c6b74aa230b78234',
          type: 'eth'
        }
      ]
    }
  },
  methods: {
    mounted: function () {
      this.$nextTick(function () {
      })
    },
    accounts: function () {
      return this.test_accounts
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
