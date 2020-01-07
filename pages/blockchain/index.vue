<template>
  <div>
    <p>Blockchain: {{ chain }}</p>
    <p>Pending Transactions: {{ pendingTransactions }}</p>
    <p>Network Nodes: {{ networkNodes }}</p>
    <p>Current NodeUrl: {{ currentNodeUrl}}</p>
    <p>Wallet Address: {{ walletAddress }}</p>
  </div>
</template>

<script>
export default { 
  computed: {
    chain () {
      return this.$store.getters.chain;
    },

    pendingTransactions () {
      return this.$store.getters.pendingTransactions;
    },

    networkNodes () {
      return this.$store.getters.networkNodes;
    },

    walletAddress () {
      return this.$store.getters.walletAddress;
    }

  }
}
</script>
