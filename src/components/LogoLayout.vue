<template>
  <div class="main-wrapper">
    <div class="login-container"><a class="brand" href="/home"><img src="../assets/images/logo.png" alt="logotype"></a>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'LogoLayout',
  data () {
    return {}
  },
  mounted: function () {
    $('body').removeClass('dashboard')
  }
}
</script>
