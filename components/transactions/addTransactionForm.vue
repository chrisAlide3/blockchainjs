<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout>
        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="sender"
            :rules="senderRules"
            label="Sender"
            required
            readonly
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="recipient"
            :rules="recipientRules"
            label="Recipient"
            autofocus
            required
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md2
        >
          <v-text-field
            v-model="amount"
            :rules="amountRules"
            label="Amount"
            required
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md2
        >

          <v-btn color="success" @click="addTransaction">Send</v-btn>

        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    created () {
      this.sender = this.senderAddress;
    },

    data: () => ({
      valid: false,

      sender: '',
      senderRules: [
        v => !!v || 'Sender is required',
      ],

      recipient: '',
      recipientRules: [
        v => !!v || 'Recipient is required',
      ],

      amount: 0,
      amountRules: [
        v => !!v || 'Amount is required',
      ]

    }),

    computed: {
      senderAddress () {
        return this.$store.getters.walletAddress
      }
    },

    methods: {
      addTransaction () {
        if (this.valid) {
          this.$emit('addTransaction', {sender: this.sender, recipient: this.recipient, amount: this.amount});
        }else {
          console.log(Error in form);
        }
      }
    }
  }
</script>
