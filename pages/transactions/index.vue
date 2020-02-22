<template>
  <div>
    <div class="title text-xs-center">Pending Transactions</div>
    <v-btn @click="$router.push('/transactions/add-transaction')" outline class="mb-4" color="success">Add Transaction</v-btn>
    <TransactionsTable />
    <v-btn @click="$router.push('/transactions/add-transaction')" outline class="mt-4" color="success">Add Transaction</v-btn>
  </div>
</template>

<script>
import TransactionsTable from '../../components/transactions/TransactionsTable';

export default {
  components: {
    TransactionsTable,
  },

  computed: {
    pendingTransactions () {
      const reversedTransactions = this.$store.getters.pendingTransactions.map(transaction => {
        return transaction
      });
      reversedTransactions.reverse();
      return reversedTransactions;
    },

    senderAddress () {
      return this.$store.getters.walletAddress;
    }
  }
}
</script>
