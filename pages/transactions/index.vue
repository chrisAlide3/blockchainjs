<template>
  <div>
    <AddTransactionForm @addTransaction="addTransaction"/>
    <div v-for="transaction in pendingTransactions" :key="transaction.id">
      <Transaction :transaction=transaction></Transaction>
    </div>
  </div>
</template>

<script>
import AddTransactionForm from '../../components/transactions/addTransactionForm';
import Transaction from '../../components/transactions/transaction';

export default {
  components: {
    AddTransactionForm,
    Transaction
  },

  computed: {
    pendingTransactions () {
      const reversedTransactions = this.$store.getters.pendingTransactions.map(transaction => {
        return transaction
      });
      reversedTransactions.reverse();
      return reversedTransactions;
    },
  },

  methods: {
    addTransaction (transaction) {
      console.log("Received addtransaction from emit");
      this.$store.dispatch('addTransaction', transaction)
        .then(res => {
          console.log("Transaction dispatched successfully");
        })
        .catch(err => {
          console.log("Error in dispatch transaction: " + err);
        })
    }
  }
}
</script>
