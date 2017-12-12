<template>
<div>
  <h3>ASSETS</h3>
  <div>
  <b-table striped hover :items="items"></b-table>
  </div>
</div>
</template>

<script>
export default {
  name: 'ManageWallet',
  data () {
    return {
      items: []
    }
  },
  methods: {
    mounted: function () {
      this.$nextTick(function () {
        alert('mounted')
        var wallet = this.$session.get('wallet', [])
        var accountIdx = this.$session.get('selectedAccountIndex', 0)
        this.items = wallet['accounts'][accountIdx]
      })
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
