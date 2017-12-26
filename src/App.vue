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
    logo: 'static/img/monaco.png'
  },
  {
    name: 'Bankor',
    symbol: 'BNT',
    contract: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    logo: 'static/img/bankor.png'
  }
]

export default {
  name: 'easyWallet',
  mounted: function () {
    this.onPageLoad()
  },
  methods: {
    onPageLoad: function () {
      this.$session.set('erc20_tokens', erc20Tokens)
    }
  }
}
</script>
