<template>
<div>
  <h3>ASSETS</h3>
  <div>
    <table class="table table-striped">
      <tbody>
      <tr v-for="(item,index) in items" :key="item.index">
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
  <b-modal id="modalSend" title="Send Ethers" button-size="large">
	<p><strong>Please fill in fields below to send funds:</strong></p>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="igAddress"
                    label="Send funds to address"
                    label-for="ethSendTo"
                    description="Please enter destination Ethereum address (40 hex digits starting from 0x)">
        <b-form-input id="ethSendTo"
                      type="text"
                      v-model="form.to"
                      required
                      placeholder="Enter destination address">
        </b-form-input>
      </b-form-group>
      <b-form-group id="igAmount"
                    label="Amount to send (in Ethers)"
                    label-for="ethSendAmount">
        <b-form-input id="ethSendAmount"
                      type="number"
                      v-model="form.amount"
                      required
                      placeholder="0.1">
        </b-form-input>
      </b-form-group>
      <b-form-group id="exampleGroup4">
        <b-form-checkbox-group v-model="form.gasDefault" id="ethGasDefault">
          <b-form-checkbox value="yes">Use default (21 Gwei)</b-form-checkbox>
          <b-form-input id="ethGasAmount" 
            label="Custom gas amount"
            v-model="form.customGas"
            placeholder="21">
          </b-form-input>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button type="submit" variant="primary">Send</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
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
  var privateKey = pKey
  var wallet = new ethers.Wallet(privateKey)

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
      logos: []
    }
  },
  mounted: function () {
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      if (!this.$session.get('authenticated', false)) {
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
      var _token = 'f7948af1945f4f779f4deb8988acec91'

      var pkey = '0x' + this.$session.get('eth_pkey')
      var ourTx = createTransaction(pkey, this.eth_send_address, this.eth_send_amount)

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
