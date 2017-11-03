<template>
  <transition name="slide">
      <div>
  <div class="row" style="padding-top: 2em;">
      <img class="logo mx-auto" alt="easyWallet logo" src="../assets/logo.png" />
  </div>
  <div class="row" style="margin-top: 2em;">
      <router-view slot="child-container"></router-view>
  </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: 'LogoLayout',
  data () {
    return {
      msg: this.$lang.messages.hello_world
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
    width: 260px;
    height: 100%;
}

</style>
