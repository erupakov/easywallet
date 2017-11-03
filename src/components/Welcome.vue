<template>
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column">
        <b-button variant="primary" to="/home/create" id="btnCreateAccount" class="mb-2">Create account</b-button>
        <b-link to="/home/login" >Already have account? Login here</b-link>
    </div>
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
#btnCreateAccount {
    width: 240px;
}
</style>
