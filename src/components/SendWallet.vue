<template>

</template>

<script>
export default {
  name: 'SendWallet',
  data () {
    return {
      msg: ''
    }
  },
  mounted: function () {
    if (!this.$session.get('authenticated', false)) {
      this.$router.push('/home')
      // return
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
