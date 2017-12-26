<template>
<div>
  <h3>{{ symbol }} Transaction history</h3>
  <b-link to="/account/manage"></b-link>
  <div>
    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Type</th>
          <th scope="col">Amount</th>
          <th scope="col">Recipient/Sender</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.date">
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.address }}</td>
        <td>
          <b-button variant="primary" name="btnSend" :href="item.link" target="_blank">View on Etherscan</b-button>
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
  name: 'HistoryWallet',
  data () {
    return {
      items: [],
      symbol: ''
    }
  },
  methods: {
    getTxList: function (address) {
      axios.get('https://api.etherscan.io/api?module=account&action=txlist&page=1&offset=0&address=' + address + '&startblock=0&endblock=99999999&sort=asc&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          var txlist = response.data.result
          for (var i = txlist.length - 1; i >= 0; i--) {
            var txe = []
            txe['amount'] = parseFloat(txlist[i].value) / 1e18
            if (this.$route.params.address.toLowerCase() === txlist[i].from.toLowerCase()) {
              txe['address'] = txlist[i].to
              txe['type'] = 'Spend'
            } else {
              txe['type'] = 'Receive'
              txe['address'] = txlist[i].from
            }

            txe['link'] = 'https://etherscan.io/tx/' + txlist[i].hash
            var d = new Date()
            d.setTime(txlist[i].timeStamp * 1000)
            txe['date'] = d.toLocaleString()
            this.items.push(txe)
          }
        }, response => {
          // error callback
        })
    }
  },
  mounted: function () {
    if (!this.$session.get('authenticated', false)) {
      this.$router.push('/home')
      return
    }
    this.symbol = this.$route.params.symbol
    this.getTxList(this.$route.params.address)
  }
}
</script>
