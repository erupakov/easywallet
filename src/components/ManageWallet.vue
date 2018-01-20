<template>
<div>
  <div class="wallets-wrapper">
    <h2 class="title">{{ $lang.manage_account.active_wallets_text }}</h2>
    <div class="wallets">
      <account-card v-for="(ac,index) in accounts" :key="index" v-bind:account-id="index" v-bind:account-name="ac.name"
      v-bind:account-address="ac.address" v-bind:account-balance="ac.balance" v-on:removeCard="showRemoveCard" v-on:sendAccount="sendFormShow"
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
        <h3 class="title">{{ $lang.manage_account.add_wallet_title }}</h3>
        <p>{{ $lang.manage_account.add_wallet_intro }}</p>
        <a href="#" v-on:click="goNew()" class="btn btn-primary">{{ $lang.manage_account.add_wallet_new_btn }}</a>
        <a href="#" v-on:click="goRestore()" class="btn btn-primary">{{ $lang.manage_account.add_wallet_restore_btn }}</a>
      </div>
    </div>
  </div>
  <!-- Send funds modal-->
  <div class="modal fade" id="sendFunds" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h3 class="title">{{ $lang.manage_account.send_modal_title }}</h3>
        </div>
	      <p><strong>{{ $lang.manage_account.send_funds_intro_text }}</strong></p>
        <form @submit="sendTo" name="sendEthers" class="register">
          <div class="form-group">
            <label for="ethSendTo" class="control-label"><span>{{ $lang.manage_account.send_funds_address_text }}</span>
            </label>
              <input id="ethSendTo"
                      type="text"
                      v-model="sendform_to"
                      class="form-control"
                      required
                      :placeholder="$lang.manage_account.send_funds_address_placeholder">
          </div>
          <div class="form-group">
            <label for="ethSendAmount" class="control-label">{{ $lang.manage_account.send_funds_amount_text }}</label>
              <input id="ethSendAmount"
                      type="number"
                      pattern="[0-9]+([,\.][0-9]+)?"
                      v-model="sendform_amount"
                      class="form-control"
                      required
                      placeholder="0.1">
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" v-model="sendform_gasDefault">{{ $lang.manage_account.send_funds_use_default_gas }}
                <label for="ethGasAmount" class="control-label">{{ $lang.manage_account.send_funds_custom_gas_amount }}</label>
                <input id="ethGasAmount" name="ethGasAmount"
                  :disabled="sendform_gasDefault"
                  type="number"
                  class="form-control"
                  v-model="sendform_customGas"
                  placeholder="21">
            </div>
          </div>
          <button type="submit" id="btnSend" class="btn btn-primary">{{ $lang.manage_account.send_funds_send_btn }}</button>
        </form>
      </div>
    </div>
  </div>
  <!-- History Modal -->
  <div class="modal fade" id="historyModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">{{ $lang.manage_account.history_modal_title }}</h4>
        </div>
        <div class="history-table-wrapper">
          <div class="title"><img class="icon" src="../assets/images/icon-eth.png" alt="eth"><span>Nexpara</span></div>
          <div class="form-group">
            <input class="form-control" id="wallet-key-1" type="text" :value="history_account_address" readonly>
            <button class="copy-button" type="button" data-id="wallet-key-1">
              <svg>
                <use xlink:href="#icon-copy"></use>
              </svg>
            </button>
          </div>
          <div class="history-table">
            <div class="top-bar">
              <div class="name">Nexpara (NEX) Transaction history</div>
              <div class="price">{{ history_account_balance }}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{{ $lang.manage_account.history_th_date }}</th>
                  <th>{{ $lang.manage_account.history_th_type }}</th>
                  <th>{{ $lang.manage_account.history_th_amount }}</th>
                  <th>{{ $lang.manage_account.history_th_who }}</th>
                  <th>{{ $lang.manage_account.history_th_action }}</th>
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
          <div class="numbers"><a class="number" href="#">1</a><a class="number" href="#">2</a><a class="number" href="#">3</a></div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- Remove modal -->
  <div class="modal fade" id="removeModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">{{ $lang.manage_account.remove_text_title }}</h4>
        </div>
        <p>{{ $lang.manage_account.remove_text_intro }}</p>
	      <div class="alert alert-danger">{{ $lang.manage_account.remove_text_warning }}</div>
	      <p><strong>{{ removemodal_account_name }}</strong></p>
	      <p>{{ removemodal_account_address }}</p>
        <button class="btn btn-danger" v-on:click="removeAccount" id="btnRemoveAccount">{{ $lang.manage_account.btn_remove_text }}</button>
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
import $ from 'jquery'

var utils = ethers.utils
var providers = ethers.providers
const infuraUrl = 'https://mainnet.infura.io/o5HPGsZu5t6YBRWo6YFQ'

function createTransaction (pKey, to, balance) {
  var wallet = new ethers.Wallet(pKey)

  var transaction = {
    nonce: 0,
    gasLimit: 60000,
    gasPrice: utils.bigNumberify('23000000000'),
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
      history_account_address: '',
      history_account_balance: 0,
      accounts: [],
      remove_idx: 0,
      removemodal_account_name: '',
      removemodal_account_address: '',
      send_idx: 0
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
      for (var i = 0; i < wallet['accounts'].length; i++) {
        this.updateTokenBalance(wallet['accounts'][i])
      }
      this.accounts = wallet['accounts']
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
    updateTokenBalance: function (acct) {
      const symbol = 'NEX'
      var contractaddress = ''
      this.$session.set('infura', infuraUrl)
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

      axios.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=' + contractaddress + '&address=' + acct.address + '&tag=latest&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          this.items[tokenIdx].balance = response.data.result
        }, response => {
          // error callback
          alert('error retrieving token balance:' + JSON.stringify(response))
        })
    },
    viewHistory: function (idx, event) {
      this.history_account_address = this.accounts[idx].address
      this.history_account_balance = this.accounts[idx].balance
      axios.get('https://api.etherscan.io/api?module=account&action=txlist&page=1&offset=0&address=' + this.history_account_address + '&startblock=0&endblock=99999999&sort=asc&apikey=AA34ZUFBTWM45APMWEFZ5XGKZM2B6YWTHH')
        .then(response => {
          // get body data
          var txlist = response.data.result
          for (var i = txlist.length - 1; i >= 0; i--) {
            var txe = []
            txe['amount'] = parseFloat(txlist[i].value) / 1e18
            if (this.accounts[idx].address.toLowerCase() === txlist[i].from.toLowerCase()) {
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
          $('#historyModal').modal('show')
        }, response => {
          // error callback
        })
      // this.$router.push('/account/history/' + this.items[idx].symbol + '/' + this.items[idx].address)
    },
    sendTo: function (event) {
      // check parameters for validity
      const _token = 'f7948af1945f4f779f4deb8988acec91'
      var wallet = this.$ls.get('wallet')
      var acct = wallet['accounts'][this.send_idx]
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
          title: 'Fund send results',
          text: 'Funds was successfully sent. TXId: ' + response.data.hash
        })
      }).catch(error => {
        console.log(JSON.stringify(error))
        // error
        this.$notify({
          group: 'flash',
          type: 'error',
          title: 'Fund send results',
          text: 'There was error sending funds: ' + JSON.stringify(error)
        })
      })
    },
    removeAccount: function (event) {
      $('#removeModal').modal('hide')
      var wallet = this.$ls.get('wallet', [])
      wallet['accounts'].splice(this.remove_idx, 1)
      this.accounts.splice(this.remove_idx, 1)
      this.$ls.set('wallet', wallet)
    },
    showRemoveCard: function (idx, event) {
      this.remove_idx = idx
      var wallet = this.$ls.get('wallet', [])
      this.removemodal_account_address = wallet['accounts'][idx].address
      this.removemodal_account_name = wallet['accounts'][idx].name
      $('#removeModal').modal('show')
    },
    sendFormShow: function (idx, event) {
      this.send_idx = idx
      $('#sendFunds').modal('show')
    },
    goNew: function (event) {
      $('#addWallet').modal('hide')
      this.$router.push('/home/name')
    },
    goRestore: function (event) {
      $('#addWallet').modal('hide')
      this.$router.push('/home/login')
    }
  }
}
</script>

<style>
#btnSend {
    width: 240px;
}
</style>
