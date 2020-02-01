<template>
  <v-container>
    <v-layout row wrap mb-3>
      <v-flex xs6>
        <v-card>
          <div>
           <h2 class="text-xs-center">Active Wallet</h2>
          </div>
          <v-card-text>
           <WalletDetail :privateKey="activePrivateKey"/>
          </v-card-text>
          <div>
            <v-btn @click="$router.push('/wallet')" color="primary">See all</v-btn>
          </div>
        </v-card>
      </v-flex>

      <v-flex xs6 class="pl-3">
        <v-card>
          <h2 class="text-xs-center">Network Nodes</h2>
          <NetworkNodesList />
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs6>
        <v-card>
          <h2 class="text-xs-center">Create Transaction</h2>
          <AddTransactionForm @addTransaction="addTransaction" />
        </v-card>
      </v-flex>

      <v-flex xs6 class="pl-3">
        <v-card>
          <h2 class="text-xs-center">Last Transaction</h2>
          <div v-if="lastTransaction !== null">
            <Transaction :transaction="lastTransaction" />
          </div>
          <div v-else>
            <h3 class="text-xs-center mt-5 red--text">No Pending Transactions available</h3>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddTransactionForm from '../../components/transactions/addTransactionForm'
import Transaction from '../../components/transactions/transaction'
import WalletDetail from '../../components/wallet/walletDetail'
import NetworkNodesList from '../../components/network/NetworkNodesList'

export default {
  components: {
    AddTransactionForm,
    Transaction,
    WalletDetail,
    NetworkNodesList,
  },

  computed: {
    lastTransaction () {
      const lastIndex = this.$store.getters.pendingTransactions.length -1;
      if (lastIndex < 0) {
        return null;
      }else {
        return this.$store.getters.pendingTransactions[lastIndex];
      }
    },

    activePrivateKey () {
      return this.$store.getters.privateKey;
    },

    balanceOfActiveWallet () {
      return this.$store.getters.balance
    },
  },

  methods: {
    addTransaction (transaction) {
      this.$store.dispatch('addTransaction', transaction);
    }
  }
  
}
</script>
