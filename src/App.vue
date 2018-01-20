<template>
<div>
    <notifications group="flash" />
    <router-view />
</div>
</template>

<script>
const erc20Tokens = [
  {
    name: 'Nexpara',
    symbol: 'NEX',
    contract: '0x143122137e723f209da6ed9fabe723d3f88b99c0',
    logo: 'static/img/logo-small.png'
  }
]

export default {
  name: 'easyWallet',
  mounted: function () {
    this.$el.className = 'main-wrapper'
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      this.$session.set('erc20_tokens', erc20Tokens)
    }
  }
}
</script>

