<template>
  <v-layout wrap>
      <v-flex xs12 text-truncate pr-auto>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0 orange--text">ID: {{ block.index }}</h3>
            <v-card-text>              
              <p>Nonce {{ block.nonce }}</p>
              <p>Hash: {{ block.hash }}</p>
              <p>Previous Hash: {{ block.previousHash }}</p>
              <p>Created: {{ block.timestamp }}</p>
              <!-- <h3 v-if="block.transactions.length > 0">Transactions</h3>
              <h3 v-else>No Transactions in this block</h3> -->
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

              <!-- <div v-for="transaction in block.transactions" :key="transaction.transactionId">
                <Transaction :transaction="transaction"/>
              </div> -->
            </v-card-text>
          </v-card-title>

          <v-card-actions>
            <!-- <v-btn flat color="orange">Copy sender to clipboard</v-btn>
            <v-btn flat color="orange">Copy recipient to clipboard</v-btn> -->
          </v-card-actions>
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

  props: ['block']
}
</script>

