<template>
<div>
  <h3>ASSETS</h3>
  <div>
    <table class="table table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Logo</th>
          <th scope="col">Name</th>
          <th scope="col">Symbol</th>
          <th scope="col">Balance</th>
          <th scope="col">Actions</th>          
        </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.index">
        <td><img class="img-responsive" style="height: 62px;" :src="logos[item.symbol]" :alt="item.type"></td>
        <td>{{ item.type }}</td>
        <td>{{ item.symbol }}</td>
        <td>{{ item.balance }}</td>
        <td>
          <b-button name="btnHistory">History</b-button>
          <b-button name="btnSend">Send</b-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ManageWallet',
  data () {
    return {
      items: [],
      logos: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.onPageLoad()
    })
  },
  methods: {
    onPageLoad: function () {
      var wallet = this.$session.get('wallet', [])
      var accountIdx = this.$session.get('selectedAccountIndex', 0)
      var localItems = []
      localItems.push(wallet['accounts'][accountIdx])
      this.logos['ETH'] = 'static/img/ethereum.png'
      this.updateEthBalance(wallet['accounts'][accountIdx].address)
      var tokens = this.$session.get('erc20_tokens', [])
      for (var i = 0; i < tokens.length; i++) {
        var tE = new Array(wallet['accounts'][accountIdx])
        tE.index += i + 1
        tE.type = tokens[i].name
        tE.symbol = tokens[i].symbol
        localItems.push(tE)
        this.logos[tokens[i].symbol] = tokens[i].logo
        this.updateTokenBalance(tE.symbol, wallet['accounts'][accountIdx].address)
      }
      this.items = localItems
    },
    updateEthBalance: function (address) {
      axios.get('https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          var resp = response.body
          this.items[0].balance = resp.result
        }, response => {
          // error callback
          this.items[0].balance = 'n/a'
        })
    },
    updateTokenBalance: function (symbol, address) {
      var contractaddress = ''
      var tokens = this.$session.get('erc20_tokens', [])
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol === tokens.symbol) {
          contractaddress = tokens[i].contract
        }
      }

      if (contractaddress === '') {
        return
      }

      axios.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=' + contractaddress + '&address=' + address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          var resp = response.body
          this.items[0].balance = resp.result
        }, response => {
          // error callback
          this.items[0].balance = 'n/a'
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
