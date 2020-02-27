<template>
  <div>
    <v-layout row wrap xs12 md10 justify-center>
      <div class="text-xs-center">
        <v-dialog
          v-model="minedDialog"
          width="700"
        >
          <template v-slot:activator="{ on }">
            
          </template>

          <v-card>
            <v-card-title
              class="headline orange"
              primary-title
            >
              Mined block
            </v-card-title>

            <v-card-text>
              <Block :block="lastBlock" :show-transactions="true" />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="minedDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-layout>

    <v-layout row justify-center mb-3>
      <v-flex xs12 md9>
       <v-btn
        :loading="loading.includes('mine')"
        block
        outline
        @click="mineBlock" 
        color="success"
      >
        Mine Block
        </v-btn>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-card>
        <v-card-title class="justify-center">
          <h3>Pending Transactions to mine</h3>
        </v-card-title>
        <v-card-text>
          <transactions-table />
        </v-card-text>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import Block from '../../components/blockchain/block'
import TransactionsTable from '../../components/transactions/TransactionsTable'

export default {
  components: {
    Block,
    TransactionsTable,
  },

  data () {
    return {
      // isMined: false,
      loading: [],
      minedDialog: false,
    }
  },

  computed: {
    lastBlock () {
      const lastBlockIndex = this.$store.getters.chain.length - 1;
      return this.$store.getters.chain[lastBlockIndex]
    },

  },

  methods: {
    async mineBlock () {
      this.loading.push('mine');
      try {
        await this.$store.dispatch('mineBlock');
        // this.isMined = true;
        this.minedDialog = true;
        this.loading = [];
      } catch (error) {
        console.log("Error mining block");
        this.loading = [];
      }
            
    }
  },

  middleware: [ 'hasWallet', 'invalidChain']
  
}
</script>
