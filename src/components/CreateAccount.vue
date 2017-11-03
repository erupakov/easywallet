<template>
<transition name="slide">
<div style="width: 100%;" class="d-flex justify-content-center">
    <div class="d-flex flex-column text-center">
        <h3>{{ title_msg }}</h3>
        <p>{{ backup_msg }}</p>
        <b-form-textarea :value="seed_phrase" rows="6"/>
        <div class="my-2 mx-auto">
        <b-button variant="danger" to="/home" id="btnBack">{{ btn_back_msg }}</b-button>        
        <b-button variant="primary" to="/account/manage" id="btnManageAccount">{{ btn_copied_msg }}</b-button>
        </div>
    </div>
</div>
</transition>
</template>

<script>
export default {
  name: 'CreateAccount',
  data () {
    return {
      title_msg: this.$lang.create_account.title_text,
      backup_msg: this.$lang.create_account.backup_text,
      btn_copied_msg: this.$lang.create_account.btn_copied_text,
      btn_back_msg: this.$lang.create_account.btn_back_text,
      seed_phrase: 'HJgdfyu sdftsuidf wehjklw fweyfuisdyfuio'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$notify({
        group: 'flash',
        title: 'Account created',
        text: 'Your new account was successfully created.'
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
