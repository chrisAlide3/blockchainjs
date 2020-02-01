<template>
  <v-container fluid>
    <v-expansion-panel v-model="panel" expand>
      <v-expansion-panel-content
        v-for="(item,i) in items"
        :key="i"
      >
        <template v-slot:header>
          <h1>{{ item }}</h1>
        </template>

        <!-- Active Wallet -->
        <v-card v-if="item === 'Active Wallet'">
          <v-card-text>
            <WalletDetail :privateKey="activePrivateKey" />
          </v-card-text>
        </v-card>

        <!-- Wallet -->
        <v-card v-if="item === 'Wallets'">
          <v-card-text>
            <WalletList />
          </v-card-text>
        </v-card>

        <!-- Chain -->
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

        <!-- Pending Transactions -->
        <v-card v-if="item === 'Pending Transactions'">
          <div v-if="pendingTransactions.length > 0">

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
            </div>

          <div v-else class="text-xs-center red--text mb-2">
            <h3>No Pending Transactions</h3>
          </div>
        </v-card>

        <!-- Network Nodes -->
        <v-card v-if="item === 'Network Nodes'">
          <div v-if="networkNodes.length > 0">
            <v-card-text>
              <NetworkNodesList />
            </v-card-text>
          </div>

          <div v-else>
            <v-card-text>
              <RegisterNode />
            </v-card-text>
          </div>       
        </v-card>

      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-layout>
      <v-card-actions class="mt-3">
        <v-btn @click="mineBlock" color='success'>Mine Block</v-btn>
      </v-card-actions>
    </v-layout>
  </v-container>
</template>

<script>
import Block from '../../components/blockchain/block'
import Transaction from '../../components/transactions/transaction'
import WalletDetail from '../../components/wallet/walletDetail'
import WalletList from '../../components/wallet/walletList'
import NetworkNodesList from '../../components/network/NetworkNodesList'
import RegisterNode from '../../components/network/RegisterNode'

export default { 
  components: {
    Block,
    Transaction,
    WalletDetail,
    WalletList,
    NetworkNodesList,
    RegisterNode
  },

  data () {
    return {
      items: ['Active Wallet', 'Wallets', 'Chain', 'Pending Transactions', 'Network Nodes'],
      sort: 'Asc',
      panel: [true],
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

    activePrivateKey () {
      return this.$store.getters.privateKey;
    },

    activeBalance () {
      return this.$store.getters.balance;
    }

  },

  methods: {
    addTransaction () {
      this.$router.push('/transactions');
    },

    mineBlock () {
      this.$store.dispatch('mineBlock');
    },
  }
}
</script>
