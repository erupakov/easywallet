<template>
    <div class="login-container"><a class="brand" href="/home"><img src="./images/logo.png" alt="logotype"></a>
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'LogoLayout',
  data () {
    return {}
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
