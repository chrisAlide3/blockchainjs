<template>
  <div>
    <!-- HORIZONTAL STEPPER FOR BIGGER SCREENS -->
    <div class="hidden-sm-and-down">
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
            class="mb-1"
            color="grey lighten-1"
            
          >
            <CreateWallet
            v-if="!hasWallet"
            @createWallet="createWallet" 
            />

            <WalletDetail
            v-else          
            @createWallet="createWallet"
            @deleteWallet="deleteWallet"
            @switchActiveWallet="switchActiveWallet"
            />
          </v-card>
          <span v-if="error!==''" class="red--text">{{ error }}</span>
          <br>
          <v-btn
            color="orange"
            :disabled="!hasWallet"
            @click="nextStep"
          >
            Continue
          </v-btn>

          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card
            class="mb-5"
            color="grey lighten-1"
          >
            <RegisterNode @registerNodeToNetwork="registerNodeToNetwork" />
          </v-card>

          <v-btn
            color="orange"
            :disabled="!hasNetworkNodes"
            @click="nextStep"
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
            @click="nextStep"
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
    </div>

    <!-- VERTICAL FOR SMALLER SCREENS -->
    <div class="hidden-md-and-up">
f     <v-stepper dark v-model="e1" vertical>
        <v-stepper-step :complete="e1 > 1" step="1" color="orange">Create Wallet</v-stepper-step>

        <v-stepper-content step="1">
          <v-card color="grey lighten-1" class="mb-1">
            <CreateWallet
              v-if="!hasWallet"
              @createWallet="createWallet" 
              />

            <WalletDetail
              v-else
              @createWallet="createWallet"
              @deleteWallet="deleteWallet"
              @switchActiveWallet="switchActiveWallet"
            />
          </v-card>
          <span v-if="error!==''" class="red--text">{{ error }}</span>
          <br>
          <v-btn 
            color="primary"
            :disabled="!hasWallet"
            @click="nextStep">
            Continue
          </v-btn>
          <v-btn @click="cancel" flat>Cancel</v-btn>
        </v-stepper-content>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2" color="orange">Register your Node to Network</v-stepper-step>
        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-1">
            <RegisterNode @registerNodeToNetwork="registerNodeToNetwork" /> 
          </v-card>
          <span v-if="error!==''" class="red--text">{{ error }}</span>
          <br>
          <v-btn
            color="primary"
            :disabled="!hasNetworkNodes"
            @click="nextStep">
            Continue
          </v-btn>
          <v-btn
            color="primary"
            @click="e1 = 1"
          >
            Back
          </v-btn>
          <v-btn @click="cancel" flat>Cancel</v-btn>
        </v-stepper-content>

        <v-divider></v-divider>

        <v-stepper-step step="3" color="orange">Start using PseudoCoin</v-stepper-step>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-1">
            
          </v-card>
          <span v-if="error!==''" class="red--text">{{ error }}</span>
          <br>
          <v-btn color="primary" @click="nextStep">Continue</v-btn>
          <v-btn
            color="primary"
            @click="e1 = 2"
          >
            Back
          </v-btn>
          <v-btn @click="cancel" flat>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper>
    </div>
  </div>
</template>


<script>
  import CreateWallet from '../../components/wallet/createWallet'
  import WalletDetail from '../../components/wallet/walletDetail'
  import RegisterNode from '../../components/network/RegisterNode'
  import Start from '../../components/blockchain/Start'

  export default {
    components: {
      CreateWallet,
      WalletDetail,
      RegisterNode,
      Start
    },

    created () {
      if (!this.hasWallet) {
        this.e1 = 1;
      }else if (!this.hasNetworkNodes) {
        this.e1 = 2;
      }else {
        this.e1 = 3;
      }
    },

    data () {
      return {
        e1: 0,
        error: ''
      }
    },

    computed: {
      hasWallet () {
        if (this.$store.getters.walletAddress === '') {
          return false;
        }else {
          return true;
        }
      },

      hasNetworkNodes () {
        if (this.$store.getters.networkNodes.length <= 0) {
          return false;
        }else {
          return true;
        }
      },
    },

    methods: {
      nextStep () {
        if (this.e1 === 1) {          
          if (!this.hasWallet) {
            this.error = 'You must generate a wallet in order to continue';
          }else {
            this.error = '';
            this.e1 = 2;
          }
        }   
      },

      createWallet () {        
        try {
          this.$store.dispatch("createWallet");
          console.log("Wallet created");
          
        } catch (error) {
          console.log("Error creating wallet");
          
        }
      },

      deleteWallet (privateKey) {
        console.log("PrivateKey in emmit delete: " + privateKey);
        try {
          this.$store.dispatch("deleteWallet", privateKey);
        } catch (error) {
          console.log("Error in dispatch deleteWallet: " + error);
        }
      },

      switchActiveWallet (privateKey) {
        try {
          this.$store.dispatch("switchActiveWallet", privateKey);
        } catch (error) {
          console.log("Error in dispatch switchActiveWallet: " + error);
        }
      },

      registerNodeToNetwork (networkNode) {
        try {
          this.$store.dispatch('registerNodeToNetwork', networkNode);
        } catch (error) {
          console.log("Error in dispatch register node: " + error);
        }
      },

      cancel () {
        this.$router.push('/');
      }
    }
  }
</script>