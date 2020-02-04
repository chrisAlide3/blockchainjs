<template>
  <v-layout row wrap>
      <v-flex xs12 text-truncate pr-auto>
        <v-card :style="invalidBlockIndex === block.index ?{border: 'solid red 2px'} : {}">
          <v-card-title primary-title>
            <h3 class="headline mb-0 orange--text">ID: {{ block.index }}</h3>
            <v-card-text>
              <div class="caption mb-1">Nonce</div>
              <p  class="grey--text text--lighten-2">{{block.nonce}}</p>
              <v-divider class="mb-2"></v-divider>

              <div class="caption mb-1">Hash</div>
              <p :class="block.index %2 === 0 ?'pink--text' : 'blue--text'">{{block.hash}}</p>

              <div class="caption mb-1">Previous Hash</div>
              <p :class="block.index %2 === 0 ?'blue--text' : 'pink--text'">{{block.previousHash}}</p>
              <v-divider class="mb-2"></v-divider>


              <div class="caption mb-1">Created</div>
              <p class="grey--text text--lighten-2">{{convertTimestampToDate()}}</p>
              <v-divider class="mb-2"></v-divider>

              <div v-if="!showTransactions">
                <div class="caption mb-1">Number Of Transactions</div>
                <p class="grey--text text--lighten-2">{{block.transactions.length}}</p>
              </div>
              <div v-else>
                <div class="caption mb-1">Transactions</div>
                <v-expansion-panel>
                  <v-expansion-panel-content
                    v-for="transaction in block.transactions" 
                    :key="transaction.transactionId"
                  >
                    <template v-slot:header>
                      <h3 class="orange--text">Transaction: {{transaction.transactionId}}</h3>
                    </template>
                    <v-card>
                      <v-card-text>
                        <Transaction :transaction="transaction"/>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>

            </v-card-text>
          </v-card-title>
        </v-card>
        <br>
      </v-flex>
    </v-layout>
</template>

<script>
import Transaction from '../../components/transactions/transaction'

export default {
  components: {
    Transaction
  },

  props: {
    block: {
      type: Object,
      required: true,
    },

    showTransactions: {
      type: Boolean,
      required: false,
      default: true,
    },

    // isValid: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // }

  },

  computed: {
    invalidBlockIndex () {
      return this.$store.getters.invalidBlockIndex;
    }
  },

  methods: {
    convertTimestampToDate () {
      let date = new Date(this.block.timestamp);
      return date;
    }
  }
}
</script>

