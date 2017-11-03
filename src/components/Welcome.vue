<template>
<div id="child-container">
<b-button variant="button">Create account</b-button>
<b-link to="/home/login">Already have account? Login here</b-link>
</div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style>

</style>
