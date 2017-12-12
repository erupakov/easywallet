<template>
</template>

<script>
function getTxList (address) {
  this.$http.get('http://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=asc&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
    .then(response => {
      // get body data
      var resp = response.body
      this.items[0].balance = resp.result
    }, response => {
      // error callback
      this.items[0].balance = 'n/a'
    })
}

export default {
  name: 'HistoryWallet',
  data () {
    return {
      msg: ''
    }
  },
  mounted: function () {
    getTxList('')
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
