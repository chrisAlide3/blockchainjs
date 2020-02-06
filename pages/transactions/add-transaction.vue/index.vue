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

    // balance () {
    //     this.$axios.$get('/api/address/' + this.senderAddress)
    //       .then(data => {
    //         console.log("Response from get balance: " + data.balance);
    //         return {balance: data.balance};
    //       })
    //       .catch(err => {
    //         return {balance: 0};
    //       })
    //   }
  },

  methods: {
    addTransaction (transaction) {
      console.log("Received addtransaction from emit");
      transaction.amount = parseFloat(transaction.amount);
      this.$store.dispatch('addTransaction', transaction)
        .then(res => {
          console.log("Transaction dispatched successfully");
        })
        .catch(err => {
          console.log("Error in dispatch transaction: " + err);
        })
    }
  },

  middleware: [ 'hasWallet', 'invalidChain']
}
</script>
