<template>
  <v-container grid-list-md>
    <v-alert
      outline
      dismissible
      :value="isChainValid"
      type="success"
    >
      Your actual Blockchain is valid
    </v-alert>
    <v-alert
      outline
      :value="!isChainValid"
      type="error"
    >
      Your actual blockchain is invalid
    </v-alert>

    <v-layout row wrap>
      <v-flex
        v-for="block in chain"
        :key="block.id"
        xs4
      >
        <Block :block="block" :show-transactions="false" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Block from '../../components/blockchain/block'

export default {
  components: {
    Block,
  },

  mounted () {
    this.$store.dispatch('checkChainValidity');
  },

  computed: {
    chain () {
      return this.$store.getters.chain;
    },

    isChainValid () {
      return this.$store.getters.isChainValid;
    },

    invalidBlockIndex () {
      return this.$store.getters.invalidBlockIndex;
    },
  }
}
</script>

