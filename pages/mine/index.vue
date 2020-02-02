<template>
  <div>
    <v-layout row wrap xs12 md10 justify-center>
      <div v-if="isMined">
        <h3 class="text-xs-center mb-3">Mined Block</h3>
        <Block :block="lastBlock" />
      </div>
    </v-layout>

    <v-layout row justify-center mb-3>
      <v-flex xs12 md7>
       <v-btn block @click="mineBlock" color="success">Mine Block</v-btn>
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
  <!-- </v-container> -->
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
      isMined: false,
    }
  },

  computed: {
    lastBlock () {
      const lastBlockIndex = this.$store.getters.chain.length - 1;
      return this.$store.getters.chain[lastBlockIndex]
    },
  },

  methods: {
    mineBlock () {
      try {
        this.$store.dispatch('mineBlock');
        this.isMined = true;
      } catch (error) {
        console.log("Error mining block");
        
      }
            
    }
  }
  
}
</script>
