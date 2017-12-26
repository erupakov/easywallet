<template>
<div>
  <h3>ASSETS</h3>
  <div>
    <table class="table table-striped">
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
      <tr v-for="(item,index) in items" :key="item.index">
        <td><img class="img-responsive" style="height: 62px;" :src="logos[item.symbol]" :alt="item.type"></td>
        <td>{{ item.type }}</td>
        <td>{{ item.symbol }}</td>
        <td>{{ item.balance }}</td>
        <td>
          <b-button variant="success" name="btnHistory" v-on:click="viewHistory(index)">History</b-button>
          <b-button variant="primary" name="btnSend" v-on:click="sendTo(index)">Send</b-button>
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
      if (!this.$session.get('authenticated', false)) {
        this.$router.push('/home')
        return
      }
      var wallet = this.$session.get('wallet', [])
      var accountIdx = this.$session.get('selectedAccountIndex', 0)
      var localItems = []
      localItems.push(wallet['accounts'][accountIdx])
      this.logos['ETH'] = 'static/img/ethereum.png'
      this.updateEthBalance(wallet['accounts'][accountIdx].address)
      var tokens = this.$session.get('erc20_tokens', [])
      for (var i = 0; i < tokens.length; i++) {
        var tE = {}
        Object.assign(tE, wallet['accounts'][accountIdx])
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
          this.items[0].balance = response.data.result
        }, response => {
          // error callback
          this.items[0].balance = 'n/a'
        })
    },
    updateTokenBalance: function (symbol, address) {
      var contractaddress = ''
      var tokens = this.$session.get('erc20_tokens', [])
      var tokenIdx = 0
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol === symbol) {
          contractaddress = tokens[i].contract
          tokenIdx = i + 1
        }
      }

      if (contractaddress === '') {
        alert('no contractddress')
        return
      }

      axios.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=' + contractaddress + '&address=' + address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          this.items[tokenIdx].balance = response.data.result
        }, response => {
          // error callback
          alert('error retrieving token balance:' + JSON.stringify(response))
        })
    },
    viewHistory: function (idx, event) {
      this.$router.push('/account/history/' + this.items[idx].symbol + '/' + this.items[idx].address)
    },
    sendTo: function (idx, event) {
      alert('sent!')
    }
  }
}
</script>
