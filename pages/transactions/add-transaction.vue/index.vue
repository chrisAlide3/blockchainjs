<template>
  <div>
    <AddTransactionForm @addTransaction="addTransaction"/>
    <TransactionsTable />
    <!-- <div v-for="transaction in pendingTransactions" :key="transaction.id">
      <Transaction :transaction="transaction"></Transaction>
    </div> -->
  </div>
</template>

<script>
import AddTransactionForm from '../../../components/transactions/addTransactionForm';
import TransactionsTable from '../../../components/transactions/TransactionsTable';

export default {
  components: {
    AddTransactionForm,
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
  },

  methods: {
    async addTransaction (transaction) {
      transaction.amount = parseFloat(transaction.amount);
      this.$store.dispatch('setLoading', ['addTransaction']);
      try {
        await this.$store.dispatch('addTransaction', transaction);
        this.$store.dispatch('setLoading', []);
 
      } catch (error) {
        this.$store.dispatch('setLoading', []);
        console.log("Error in dispatch transaction: " + err);
      }
    }
  },

  middleware: [ 'hasWallet', 'invalidChain']
}
</script>
