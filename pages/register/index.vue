<template>
  <v-stepper dark v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" color="orange">Create Wallet</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" color="orange">Register your Node to Network</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3" color="orange">Start using PseudoCoin</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          
        >
          <CreateWallet />
        </v-card>

        <v-btn
          color="orange"
          @click="e1 = 2"
        >
          Continue
        </v-btn>

        <v-btn flat @click="cancel">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        >
          <RegisterNode />
        </v-card>

        <v-btn
          color="orange"
          @click="e1 = 3"
        >
          Continue
        </v-btn>

        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Back
        </v-btn>

        <v-btn flat @click="cancel">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        >
          <Start />
        </v-card>

        <v-btn
          color="orange"
          @click="e1 = 1"
        >
          Continue
        </v-btn>

        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Back
        </v-btn>

        <v-btn flat @click="cancel">Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import CreateWallet from '../../components/wallet/createWallet'
  import RegisterNode from '../../components/network/RegisterNode'
  import Start from '../../components/blockchain/Start'

  export default {
    components: {
      CreateWallet,
      RegisterNode,
      Start
    },

    data () {
      return {
        e1: 0
      }
    },

    methods: {
      cancel () {
        this.$router.push('/');
      }
    }
  }
</script>