<template>
  <div>
    <!-- HEADER -->
    <v-layout row align-center>
      <!-- Sender -->
      <v-flex xs11>
        <div class="caption grey--text">Sender</div>
        <PublicKey :publicKey="senderAddress" />
      </v-flex>
      <!-- Button -->
      <v-flex xs2 mb-3>
        <v-btn @click="$router.push('/wallet')" color="orange">Manage Wallet</v-btn>
      </v-flex>
    </v-layout>     
      <!-- Balance -->
    <v-layout row>  
      <v-flex xs12>
        <p class="font-weight-bold orange--text">Balance: {{ balance.toFixed(4) }}</p>
      </v-flex>
    </v-layout>

    <!-- FORM -->
    <v-form v-model="valid" ref="form">
      <v-layout row>
        <v-flex xs6 mr-3>
          <v-text-field
            v-model="recipient"
            :rules="recipientRules"
            label="Recipient"
            ref="recipient"
            autofocus
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs1 mr-5>
          <v-text-field
            v-model="amount"
            :rules= "[ isNumber ]"
            label="Amount"
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs1>
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
    </v-form>
  </div>
</template>

<script>
  import PublicKey from '../wallet/PublicKey'

  export default {
    components: {
      PublicKey,
    },

    created () {
      this.sender = this.senderAddress;
    },

    data: () => ({
      valid: false,

      sender: '',
      // senderRules: [
      //   v => !!v || 'Sender is required',
      // ],

      recipient: '',
      recipientRules: [
        v => !!v || 'Recipient is required',
      ],

      amount: 0,
    }),

    computed: {
      senderAddress () {
        return this.$store.getters.walletAddress
      },

      balance () {
        console.log("TypeOf Balance: ", typeof(this.$store.getters.balance));
        
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
            this.$refs.form.reset();
            this.$refs.recipient.focus();
          } catch (error) {
            console.log('Error in emmiting addTransaction: ' + error);
          }
        }else {
          console.log("Error in form");
        }
      },
    }
  }
</script>
