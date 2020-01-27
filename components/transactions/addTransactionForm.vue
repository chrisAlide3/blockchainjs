<template>
  <div>
    <!-- SNACKBAR FOR MOUSEOVER SENDER -->
    <v-card>
      <v-snackbar
      text-truncate
        v-model="snackbar"
        :timeout="timeout"
        :top="y === 'top'"
      >
        {{ text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
        <v-btn
          color="orange"
          flat
          @click="copySenderToClipboard"
        >
          Copy
        </v-btn>
      </v-snackbar>
    </v-card>
    
    <!-- FORM -->
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-layout column>
          <v-flex
            text-truncate
            xs12
          >
            <!-- <p @mouseover="hoverSender">Sender: {{ senderAddress }}</p> -->
            <v-textarea 
              @mouseover="hoverSender"
              label="Sender Address"
              :value="senderAddress"
              rows=1
              auto-grow
              readonly
              outline
            >
            </v-textarea>
          </v-flex>
          <v-flex
            xs12
          >
          <p class="font-weight-bold orange--text">Balance: {{ balance.toFixed(4) }}</p>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex
            xs12
            md4
          >
            <v-text-field
              v-model="recipient"
              :rules="recipientRules"
              label="Recipient"
              ref="recipient"
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
              :rules= "[ isNumber ]"
              label="Amount"
              required
            ></v-text-field>
          </v-flex>

          <v-flex
            xs12
            md2
          >
            <v-btn
              color="success"
              @click="addTransaction"
              :disabled="!valid"
              >Send</v-btn>

          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs12>
            <p class="red--text">{{ error }}</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    created () {
      this.sender = this.senderAddress;
    },

    data: () => ({
      valid: false,
      // balance: 0,

      sender: '',
      senderRules: [
        v => !!v || 'Sender is required',
      ],

      recipient: '',
      recipientRules: [
        v => !!v || 'Recipient is required',
      ],

      amount: 0,
      // amountRules: [
      //   v => !!v || 'Amount is required',
      //   v => !!isNaN(parseFloat(v)) || 'Amount must be a number. For decimals use .(dot)'
      // ],

      // SNACKBAR
      snackbar: false,
      y: 'top',
      x: null,
      mode: '',
      timeout: 4000,
      text: 'Copy sender address to clipboard '

    }),

    computed: {
      senderAddress () {
        return this.$store.getters.walletAddress
      },

      balance () {
        return this.$store.getters.balance
      },

      error () {
        return this.$store.getters.error;
      },
    },

    methods: {
      isNumber (value) {
        const number = parseFloat(value);
        if (isNaN(value)) {
          return 'Amount must be a number. For decimals use .(dot)!';
        }else if (value <= 0){
          return 'Amount must be greater than 0';
        }else {
          return true;
        }
      },

      addTransaction () {
        if (this.valid) {
          try {
            this.$emit('addTransaction', {sender: this.sender, recipient: this.recipient, amount: this.amount});
            // this.recipient = '';
            // this.amount = 0;
            this.$refs.form.reset();
            this.$refs.recipient.focus();
          } catch (error) {
            console.log('Error in emmiting addTransaction: ' + error);
          }
        }else {
          console.log("Error in form");
        }
      },

      hoverSender () {
          this.snackbar = true;
      },

      copySenderToClipboard () {
        try {
          this.$copyText(this.sender);
          this.snackbar = false;
        } catch (error) {
          
        }
      }
    }
  }
</script>
