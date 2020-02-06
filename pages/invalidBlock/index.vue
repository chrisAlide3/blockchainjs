<template>
  <v-container>
    <v-layout v-if="invalidBlockIndex !== ''" column justify-center>
      <h3 class="orange--text mb-3">Invalid Block</h3>
      <Block :block="invalidBlock" />
      <div>
        <v-btn @click="checkIfChainCanBeDownloaded()" light color="orange">Download Valid Chain from Network</v-btn>
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
            <register-node v-if="!nodeRegistered" @registerNodeToNetwork="registerNodeToNetwork" />
            <network-nodes-list v-else />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="nodeRegistered"
              color="orange"
              flat
              @click="hasRegisteredToNetwork()"
            >
              Download
            </v-btn>
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
import NetworkNodesList from '../../components/network/NetworkNodesList'

export default {
  components: {
    Block,
    RegisterNode,
    NetworkNodesList,
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

    nodeRegistered () {
      if (this.$store.getters.networkNodes.length > 0) {
        return true;
      }else {
        return false;
      }
    },
  },

  methods: {
    checkIfChainCanBeDownloaded () {
      if (!this.nodeRegistered) {
        this.showRegisterToNetworkDialog = true;
      }else {
        this.getChain();  
      }
    },     

    hasRegisteredToNetwork () {
      this.showRegisterToNetworkDialog = false;
      this.getChain();
    },

    async registerNodeToNetwork (networkNode) {
      try {
        this.$store.dispatch('registerNodeToNetwork', networkNode);
      } catch (error) {
        console.log("Error in dispatch register node: " + error);
      }
    },

    async getChain () {
      try {
        console.log("get chain");
        
      } catch (error) {
        console.log("Error getting chain");
      }
    }
  }
}
</script>
