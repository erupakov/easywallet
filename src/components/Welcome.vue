<template>
<transition name="slide">
<div>
  <h1 class="logotype-title">{{ $lang.welcome.welcome_text }}</h1>
  <button class="center-block btn btn-primary" v-on:click="$router.push('/home/name')" id="btnCreateAccount">{{ $lang.welcome.create_account_text }}</button>
  <a class="btn btn-link center-block" v-on:click="$router.push('/home/login')" >{{ $lang.welcome.click_text }}</a>
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
      this.$router.push('/account/manage')
    }
  }
}
</script>

<style>
#btnCreateAccount {
    width: 240px;
}
</style>
