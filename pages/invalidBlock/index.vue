<template>
  <v-container>
    <v-layout v-if="invalidBlockIndex !== ''" column justify-center>
      <h3 class="orange--text mb-3">Invalid Block</h3>
      <Block :block="invalidBlock" />
      <div>
        <v-btn @click="getChain()" light color="orange">Download Valid Chain from Network</v-btn>
      </div>
    </v-layout>

    <!-- Register to Network Dialog -->
    <div class="text-xs-center">
      <v-dialog
        v-model="showRegisterToNetworkDialog"
        width="500"
      >
        <template v-slot:activator="{ on }"></template>

        <v-card>
          <v-card-title
            class="subheading error"
            primary-title
          >
            You must first register your node to the network in order to download a valid Blockchain
          </v-card-title>

          <v-card-text>
            <register-node />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="showRegisterToNetworkDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import Block from '../../components/blockchain/block'
import RegisterNode from '../../components/network/RegisterNode'

export default {
  components: {
    Block,
    RegisterNode,
  },

  data () {
    return {
      showRegisterToNetworkDialog: false,
    }
  },

  computed: {
    invalidBlockIndex () {
      return this.$store.getters.invalidBlockIndex;
    },

    invalidBlock () {
      return this.$store.getters.chain[this.invalidBlockIndex - 1];
    },

    networkNodes () {
      return this.$store.getters.networkNodes;
    }
  },

  methods: {
    async getChain () {
      console.log("Get chain clicked");
      if (this.networkNodes.length === 0) {
        this.showRegisterToNetworkDialog = true;
      }else {
        try {
        
        } catch (error) {
          
        }
      
      }      
    },
  }
}
</script>
