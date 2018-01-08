<template>
<div class="wallet main">
  <div class="title">
    <div class="icon"><img src="../assets/images/icon-eth.png" alt="eth"></div>
    <div class="name"><span class="curr-name">Etherium</span><span class="curr-sub">ETH</span></div>
  </div>
  <div class="code">
    <div class="code-title"><span>{{ account_name }}</span></div>
    <div class="form-group">
      <input class="form-control" id="wallet-key-1" type="text" :value="account_address" readonly>
      <button class="copy-button" type="button" data-id="wallet-key-1">
        <svg>
          <use xlink:href="#icon-copy"></use>
        </svg>
      </button>
    </div>
  </div>
  <div class="price"><span>{{ account_balance }}</span></div>
  <div class="buttons"><a href="#" v-on:click="passHistory(account_idx)"><span>{{ $lang.choose_account.history_btn_text }}</span>
    <svg>
      <use xlink:href="#icon-arrow-right"></use>
    </svg></a><a href="#" v-on:click="passSend(account_idx)"><span>{{ $lang.choose_account.send_btn_text }}</span>
    <svg>
      <use xlink:href="#icon-arrow-right"></use>
    </svg></a><a class="remove" v-on:click="passRemove(account_idx)" :data-id="account_idx" href="#">{{ $lang.choose_account.btn_remove_text }}</a>
  </div>
</div>
</template>

<script>
export default {
  name: 'AccountCard',
  props: [ 'accountId', 'accountName', 'accountAddress', 'accountBalance' ],
  data () {
    return {
      account_name: this.accountName,
      account_address: this.accountAddress,
      account_idx: this.accountId,
      account_balance: this.accountBalance
    }
  },
  methods: {
    passRemove: function (event) {
      this.$emit('removeCard', this.account_idx)
    },
    passSend: function (event) {
      this.$emit('sendAccount', this.account_idx)
    },
    passHistory: function (event) {
      this.$emit('historyAccount', this.account_idx)
    }
  }
}
</script>
