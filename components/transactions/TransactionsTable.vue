<template>
  <!-- <v-card> -->
    <v-layout row justify-center>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="pendingTransactions"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              No Pending Transactions
            </v-alert>
          </template>
          
          <template v-slot:items="props">
            <td class="text-xs-right">
              <v-textarea
                readonly
                rows=1
                auto-grow
                :value="props.item.transactionId"
              ></v-textarea>
            </td>
            <td class="text-xs-right">
              <v-textarea
                readonly
                rows=1
                auto-grow
                :value="props.item.sender"
              ></v-textarea>
            </td>
            <td class="text-xs-right">
              <v-textarea
                readonly
                rows=1
                auto-grow
                :value="props.item.recipient"
              ></v-textarea>
            </td>
            <td class="text-xs-left">{{ props.item.amount }}</td>
          </template>
        </v-data-table>

        <!-- <v-card v-for="transaction in pendingTransactions" :key="transaction.transactionId">
          <Transaction :transaction="transaction" />
        </v-card> -->
      </v-flex>
    </v-layout>
  <!-- </v-card> -->
</template>

<script>
import Transaction from './transaction'

export default {
  components: {
    Transaction,
  },

  data () {
    return {
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Sender', value: 'sender' },
        { text: 'Recipient', value: 'recipient' },
        { text: 'Amount', value: 'amount' },
      ]
    }
  },

  computed: {
    pendingTransactions () {
      return this.$store.getters.pendingTransactions
    }
  }
}
</script>
