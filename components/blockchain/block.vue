<template>
  <v-layout row wrap>
      <v-flex xs12 text-truncate pr-auto>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0 orange--text">ID: {{ block.index }}</h3>
            <v-card-text>
              <div class="caption">Nonce</div>
              <p class="grey--text text--lighten-2">{{block.nonce}}</p>
              <v-divider class="mb-2"></v-divider>

              <div class="caption">Hash</div>
              <p class="grey--text text--lighten-2">{{block.hash}}</p>

              <div class="caption">Previous Hash</div>
              <p class="grey--text text--lighten-2">{{block.previousHash}}</p>
              <v-divider class="mb-2"></v-divider>


              <div class="caption">Created</div>
              <p class="grey--text text--lighten-2">{{convertTimestampToDate()}}</p>

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

  props: ['block'],

  methods: {
    convertTimestampToDate () {
      let date = new Date(this.block.timestamp);
      return date;
    }
  }
}
</script>

