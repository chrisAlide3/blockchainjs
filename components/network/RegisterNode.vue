<template>
  <v-card>
    <!-- <v-img
      :src="require('../../assets/images/networkNodes.png')" aspect-ratio="4"
    ></v-img> -->

    <v-container>
      <v-layout justify-center>
        <v-flex xs12 md8>
          <h3 class="text-xs-center mt-2">Network Nodes</h3>
          <v-card-title>
            Register your node to the network
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="registeringNode"
              label="Node Address"
              placeholder="http://localhost:3001"
            ></v-text-field>            
          </v-card-text>

          <p class="red--text">{{ error }}</p>
          <v-card-actions>
            <v-btn
              color="success"
              @click="registerNodeToNetwork"
            >
            Register
            </v-btn>

          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      registeringNode: ''
    }
  },

  computed: {
    currentNodeUrl () {
      return this.$store.getters.currentNodeUrl;
    },

    error () {
      return this.$store.getters.error;
    }
  },

  methods: {
    registerNodeToNetwork () {
      const data = {
        registeringNode: this.registeringNode,
        newNodeUrl: this.currentNodeUrl
      };
      this.$emit('registerNodeToNetwork', data);
    }
  }
}
</script>
