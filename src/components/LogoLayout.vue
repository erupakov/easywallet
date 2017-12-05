<template>
  <div>   
  <div class="row pt-5">
      <img class="logo mx-auto" alt="easyWallet logo" src="../assets/logo.png" />
  </div>
  <div class="row mt-5">
      <router-view></router-view>
  </div>
  </div>
</template>

<script>
export default {
  name: "LogoLayout",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  width: 260px;
  height: 100%;
}
</style>
