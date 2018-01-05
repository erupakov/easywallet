<template>
<div>
  <h3>ASSETS</h3>
  <div>
    <table class="table table-striped">
      <tbody>
      <tr v-for="(item) in items" :key="item.address">
        <td><img class="img-responsive" style="height: 62px;" :src="logos[item.symbol]" :alt="item.type"></td>
        <td>{{ item.type }}</td>
        <td>{{ item.symbol }}</td>
        <td>{{ item.balance }}</td>
        <td>
          <b-button variant="success" name="btnHistory" v-if="item.type==='Ethereum'" v-b-modal.modalHistory>History</b-button>
          <b-button variant="primary" name="btnSend" v-if="item.type==='Ethereum'" v-b-modal.modalSend>Send</b-button>
          <b-button variant="primary" name="btnJoinICO" v-b-modal.modalICO v-if="item.type!=='Ethereum'">Join ICO!</b-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <!-- Join ICO Modal -->
  <b-modal id="modalICO" title="Join our ICO" ok-only="true" button-size="large">
    <p class="my-4">Join our ICO by sending funds on our bank account:</p>
	<p><strong>Bank of New York</strong></p>
	<p>SWIFT code: BNY</p>
	<p>Beneficinary: ben</p>
	<p>Account: 432423532523</p>
  </b-modal>
  <!-- Send funds modal-->
  <b-modal id="modalSend" title="Send Ethers"  ok-only="true" button-size="large">
	<p><strong>Please fill in fields below to send funds:</strong></p>
    <b-form @submit="sendTo">
      <b-form-group id="igAddress"
                    label="Send funds to address"
                    label-for="ethSendTo"
                    description="Please enter destination Ethereum address (40 hex digits starting from 0x)">
        <b-form-input id="ethSendTo"
                      type="text"
                      v-model="sendform_to"
                      required
                      placeholder="Enter destination address">
        </b-form-input>
      </b-form-group>
      <b-form-group id="igAmount"
                    label="Amount to send (in Ethers)"
                    label-for="ethSendAmount">
        <b-form-input id="ethSendAmount"
                      type="number"
                      v-model="sendform_amount"
                      required
                      placeholder="0.1">
        </b-form-input>
      </b-form-group>
      <b-form-group id="exampleGroup4">
        <b-form-checkbox-group id="ethGasDefault">
          <b-form-checkbox v-model="sendform_gasDefault">Use default gas (21 Gwei)</b-form-checkbox>
          <b-form-input id="ethGasAmount" 
            :disabled="sendform_gasDefault"
            label="Custom gas amount"
            type="number"
            v-model="sendform_customGas"
            placeholder="21">
          </b-form-input>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button type="submit" id="btnSend" variant="primary">Send</b-button>
    </b-form>
  </b-modal>
  <!-- History Modal -->
  <b-modal id="modalHistory" size="lg" title="Account transactions" ok-only="true" button-size="large">
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
      <tr v-for="item in history_items" :key="item.date">
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.address }}</td>
        <td>
          <b-button variant="primary" name="btnCheckEtherscan" :href="item.link" target="_blank">View on Etherscan</b-button>
        </td>
      </tr>
      </tbody>
    </table>
  </b-modal>
</div>

</template>

<script>
import axios from 'axios'
import ethers from 'ethers'
import stripHexPrefix from 'strip-hex-prefix'

var utils = ethers.utils
var providers = ethers.providers

function createTransaction (pKey, to, balance) {
  var wallet = new ethers.Wallet(pKey)

  var transaction = {
    nonce: 0,
    gasLimit: 21000,
    gasPrice: utils.bigNumberify('20000000000'),
    to: to,
    value: utils.parseEther(balance),
    data: '0x',

    // This ensures the transaction cannot be replayed on different networks
    chainId: providers.Provider.chainId.homestead
  }

  return stripHexPrefix(wallet.sign(transaction))
}

export default {
  name: 'ManageWallet',
  data () {
    return {
      items: [],
      logos: [],
      sendform_to: '',
      sendform_amount: 0.1,
      sendform_customGas: 21,
      sendform_gasDefault: true,
      history_items: [],
      history_symbol: ''
    }
  },
  mounted: function () {
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      if (!this.$session.exists('authenticated') ||
        !this.$session.get('authenticated')) {
        this.$router.push('/home')
        return
      }
      var wallet = this.$ls.get('wallet')
      var accountIdx = 0
      if (this.$session.exists('selectedAccountIndex')) {
        accountIdx = this.$session.get('selectedAccountIndex')
      }
      var localItems = []
      localItems.push(wallet['accounts'][accountIdx])
      this.logos['ETH'] = 'static/img/ethereum.png'
      this.updateEthBalance(wallet['accounts'][accountIdx])
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
    updateEthBalance: function (acct) {
      axios.get('https://api.etherscan.io/api?module=account&action=balance&address=' + acct.address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          this.items[0].balance = response.data.result
          acct.balance = parseFloat(response.data.result)
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
      axios.get('https://api.etherscan.io/api?module=account&action=txlist&page=1&offset=0&address=' + this.items[idx].address + '&startblock=0&endblock=99999999&sort=asc&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          var txlist = response.data.result
          for (var i = txlist.length - 1; i >= 0; i--) {
            var txe = []
            txe['amount'] = parseFloat(txlist[i].value) / 1e18
            if (this.items[idx].address.toLowerCase() === txlist[i].from.toLowerCase()) {
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
            this.history_items.push(txe)
          }
        }, response => {
          // error callback
        })
      // this.$router.push('/account/history/' + this.items[idx].symbol + '/' + this.items[idx].address)
    },
    sendTo: function (idx, event) {
      var _token = 'f7948af1945f4f779f4deb8988acec91'
      var wallet = this.$ls.get('wallet')
      var acct = wallet['accounts'][idx]
      var pkey = acct.private
      var ourTx = createTransaction(pkey, this.sendform_to, this.sendform_amount)

      axios.post('https://api.blockcypher.com/v1/eth/main/txs/push?token=' + _token,
        {
          tx: ourTx
        }
      ).then(response => {
      // success
        console.log(JSON.stringify(response))
        this.$notify({
          group: 'flash',
          type: 'success',
          title: 'Fund send success',
          text: 'Funds was successfully sent. TXId: ' + response.data.hash
        })
      }).catch(error => {
        console.log(JSON.stringify(error))
        // error
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Fund send error',
          text: 'There was error sending funds: ' + JSON.stringify(error)
        })
      })
    }
  }
}
</script>

<style>
#btnSend {
    width: 240px;
}
</style>