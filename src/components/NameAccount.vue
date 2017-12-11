<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <label for="account_name">{{ enter_name_msg }}
          <small>{{ enter_name_tip_msg }}</small>
        </label>
        <b-form-input v-model="account_name" placeholder="Enter account name" name="account_name" />
        <label for="account_password">{{ enter_pwd_msg }}</label>
        <b-form-input v-model="account_password" placeholder="Enter password" name="account_password"/>
        <div class="my-2 mx-auto">
	        <b-button variant="primary" v-on:click="checkSeed" id="btnManageAccount">{{ btn_confirm_msg }}</b-button>
        </div>
    </div>
</div>
</transition>
</template>

<script>
export default {
  name: 'NameAccount',
  data () {
    return {
      enter_name_msg: this.$lang.confirm_account.enter_name_text,
      enter_name_tip_msg: this.$lang.confirm_account.enter_name_tip_text,
      btn_confirm_msg: this.$lang.confirm_account.btn_confirm_text,
      enter_pwd_msg: this.$lang.confirm_account.enter_pwd_text
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
