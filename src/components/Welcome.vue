<template>
<transition name="slide">
<div>
  <h1 class="logotype-title">{{ $lang.welcome.welcome_text }}</h1>
  <b-button variant="primary" to="/home/name" id="btnCreateAccount" class="my-2 mx-auto">{{ $lang.welcome.create_account_text }}</b-button>
  <b-link to="/home/login" >{{ $lang.welcome.click_text }}</b-link>
</div>
</transition>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
    }
  },
  mounted: function () {
    if (this.$ls.get('wallet', false) !== false) {
      this.$router.push('/home/choose')
    }
  }
}
</script>

<style>
#btnCreateAccount {
    width: 240px;
}
</style>
