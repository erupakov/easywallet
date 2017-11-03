<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <h3>{{ welcome_msg }}</h3>
        <b-button variant="primary" to="/home/create" id="btnCreateAccount" class="my-2 mx-auto">{{ create_account_msg }}</b-button>
        <b-link to="/home/login" >{{ click_msg }}</b-link>
    </div>
</div>
</transition>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      welcome_msg: this.$lang.welcome.welcome_text,
      create_account_msg: this.$lang.welcome.create_account_text,
      click_msg: this.$lang.welcome.click_text
    }
  }
}
</script>

<style>
#btnCreateAccount {
    width: 240px;
}
</style>
