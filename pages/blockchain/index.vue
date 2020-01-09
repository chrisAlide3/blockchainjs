<template>
  <div>
    <v-layout>
      <v-flex xs12 text-truncate>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">My Details</h3>
              <v-card-text>
                <p>Wallet Address: {{ walletAddress }}</p>
                <p>Balance: {{ balance.toFixed(4) }}</p>
                <p>Current NodeUrl: {{ currentNodeUrl}}</p>
              </v-card-text>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" @click="addTransaction">Add Transaction</v-btn>
            <v-btn flat color="orange" @click="mineBlock">Mine Block</v-btn>
          </v-card-actions>
        </v-card>
        <br>
      </v-flex>
  </v-layout>

    <v-expansion-panel>
      <v-expansion-panel-content
        v-for="(item,i) in items"
        :key="i"
      >
        <template v-slot:header>
          <h1>{{ item }}</h1>
        </template>
        <v-card v-if="item === 'Chain'">
          <v-layout justify-end class="mr-5">
            <span>Sort:</span><v-icon @click="sort='Desc'" v-if="sort==='Asc'">keyboard_arrow_down</v-icon>
            <v-icon @click="sort='Asc'" v-if="sort==='Desc'">keyboard_arrow_up</v-icon>
          </v-layout>
          <!-- Chain ascending -->
          <div v-if="sort==='Asc'">
            <v-card-text
            v-for="block in chain"
            :key="block.id"
            >
              <block :block="block"></block>
            </v-card-text>
          </div>
          <!-- Chain descending -->
          <div v-if="sort==='Desc'">
            <v-card-text
            v-for="block in chainReversed"
            :key="block.id"
            >
              <block :block="block"></block>
            </v-card-text>
          </div>
          
        </v-card>

        <v-card v-if="item === 'Pending Transactions'">
          <v-layout justify-end class="mr-5">
            <span>Sort:</span><v-icon @click="sort='Desc'" v-if="sort==='Asc'">keyboard_arrow_down</v-icon>
            <v-icon @click="sort='Asc'" v-if="sort==='Desc'">keyboard_arrow_up</v-icon>
          </v-layout>
          <!-- Transactions ascending -->
          <div v-if="sort==='Asc'">
            <v-card-text
              v-for="transaction in pendingTransactions"
              :key="transaction.transactionId"
            >
              <Transaction :transaction="transaction"></Transaction>
            </v-card-text>
          </div>
          <!-- Transactions descending -->
          <div v-if="sort==='Desc'">
            <v-card-text
              v-for="transaction in pendingTransactionsReversed"
              :key="transaction.transactionId"
            >
              <Transaction :transaction="transaction"></Transaction>
            </v-card-text>
          </div>
          
        </v-card>

        <v-card v-if="item === 'Network Nodes'">
          <v-card-text
            v-for="(networkUrl, i) in networkNodes"
            :key="i"
          >
            <div class="ml-3"> {{ networkUrl }}</div>
          </v-card-text>
        </v-card>

      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import Block from '../../components/blockchain/block'
import Transaction from '../../components/transactions/transaction'

export default { 

  components: {
    Block,
    Transaction
  },

  data () {
    return {
      items: ['Chain', 'Pending Transactions', 'Network Nodes'],
      sort: 'Asc'
    }
  },

  computed: {
    chain () {
      return this.$store.getters.chain;
    },

    chainReversed () {
      const reversedChain = this.$store.getters.chain.map(block => {
        return block
      });
      reversedChain.reverse();
      return reversedChain;
    },

    pendingTransactions () {
      return this.$store.getters.pendingTransactions;
    },

    pendingTransactionsReversed () {
      const reversedTransactions = this.$store.getters.pendingTransactions.map(transaction => {
        return transaction
      });
      reversedTransactions.reverse();
      return reversedTransactions;
    },

    networkNodes () {
      return this.$store.getters.networkNodes;
    },

    currentNodeUrl () {
      return this.$store.getters.currentNodeUrl;
    },

    walletAddress () {
      return this.$store.getters.walletAddress;
    },

    balance () {
      return this.$store.getters.balance;
    }

  },

  methods: {
    addTransaction () {
      this.$router.push('/transactions');
    },

    mineBlock () {
      this.$store.dispatch('mineBlock');
    }
  }
}
</script>
