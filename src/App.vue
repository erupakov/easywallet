<template>
<div>
    <notifications group="flash" />
    <router-view />
</div>
</template>

<script>
const erc20Tokens = [
  {
    name: 'Monaco',
    symbol: 'MCO',
    contract: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
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
