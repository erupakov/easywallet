<template>
<div>
  <div class="wallets-wrapper">
    <h2 class="title">{{ $lang.manage_account.active_wallets_text }}</h2>
      <div class="wallets">
        <account-card v-for="(ac,index) in accounts" :key="index" v-bind:account-id="index" v-bind:account-name="ac.name"
        v-bind:account-address="ac.address" v-bind:account-balance="ac.balance" v-on:removeCard="showRemoveCard" v-on:sendAccount="sendTo"
        v-on:historyAccount="viewHistory"></account-card>
        <a class="wallet add" href="#" data-toggle="modal" data-target="#addWallet">
          <span class="circle"><span class="plus"><img src="../assets/images/icon-plus.png"></span></span>
          <span class="name">{{ $lang.manage_account.add_wallet_text }}</span>
        </a>
      </div>
    </div>

<!-- Enter password modal -->
  <div class="modal fade" id="addWallet" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <h1 class="logotype-title">{{ account_name }}</h1>
        <div class="login">
          <div class="form-group">
            <input class="form-control" id="inputPhrase" type="text" :placeholder="$lang.manage_account.your_password_text" required>
            <button type="submit">
              <svg>
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="underform-line clearfix">
          <a class="pull-right" href="#">{{ $lang.manage_account.submit_btn_text }}</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Send funds modal-->
  <div class="modal fade" id="sendFunds" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">

	<p><strong>Please fill in fields below to send funds:</strong></p>
    <form @submit="sendTo" name="sendEthers">
      <div class="form-group">
        <label for="ethSendTo"><span>Send funds to address</span>
        <small>Please enter destination Ethereum address (40 hex digits starting from 0x)</small>
        </label>
        <input id="ethSendTo"
                      type="text"
                      v-model="sendform_to"
                      required
                      placeholder="Enter destination address">
      </div>
      <div class="form-group">
                    <label for="ethSendAmount">Amount to send (in Ethers)</label>
        <input id="ethSendAmount"
                      type="number"
                      v-model="sendform_amount"
                      required
                      placeholder="0.1">
      </div>
      <div class="form-group">
        <div class="checkbox-group">
          <input type="checkbox" v-model="sendform_gasDefault">Use default gas (21 Gwei)
          <input id="ethGasAmount" 
            :disabled="sendform_gasDefault"
            label="Custom gas amount"
            type="number"
            v-model="sendform_customGas"
            placeholder="21">
        </div>
      </div>
      <button type="submit" id="btnSend" class="btn btn-primary">Send</button>
    </form>
      </div>
    </div>
  </div>
  <!-- History Modal -->
  <div class="modal fade" id="historyModal" ref="historyModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
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
            <a class="btn btn-primary" name="btnCheckEtherscan" :href="item.link" target="_blank">View on Etherscan</a>
          </td>
        </tr>
        </tbody>
      </table>
      </div>
      </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import ethers from 'ethers'
import stripHexPrefix from 'strip-hex-prefix'
import AccountCard from '@/components/AccountCard'

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
      logos: [],
      sendform_to: '',
      sendform_amount: 0.1,
      sendform_customGas: 21,
      sendform_gasDefault: true,
      history_items: [],
      accounts: [],
      remove_idx: 0
    }
  },
  components: {
    'account-card': AccountCard
  },
  mounted: function () {
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      var wallet = this.$ls.get('wallet')
      for (i = 0; i < wallet['accounts'].length; i++) {
        this.updateEthBalance(wallet['accounts'][i])
      }
    },
    updateEthBalance: function (acct) {
      axios.get('https://api.etherscan.io/api?module=account&action=balance&address=' + acct.address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          acct.balance = parseFloat(response.data.result)
        }, response => {
          // error callback
          console.log('Error getting balance: ' + response)
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
          this.$refs.historyModal.show()
        }, response => {
          // error callback
        })
      // this.$router.push('/account/history/' + this.items[idx].symbol + '/' + this.items[idx].address)
    },
    sendTo: function (idx, event) {
      // check parameters for validity
      const _token = 'f7948af1945f4f779f4deb8988acec91'
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
    },
    removeAccount: function (event) {
      var wallet = this.$ls.get('wallet', [])
      wallet['accounts'].splice(this.remove_idx, 1)
      this.test_accounts.splice(this.remove_idx, 1)
      this.$ls.set('wallet', wallet)
    },
    showRemoveCard: function (idx, event) {
      this.remove_idx = idx
      var wallet = this.$ls.get('wallet', [])
      this.removemodal_account_address = wallet['accounts'][idx].address
      this.removemodal_account_name = wallet['accounts'][idx].name
      this.$refs.modalRemoveWindow.show()
    }
  }
}
</script>

<style>
#btnSend {
    width: 240px;
}
</style>