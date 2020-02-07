<template>
  <v-card>
    <v-container>
      <v-layout justify-center>
        <v-flex xs12 md8>
          <!-- <h3 class="text-xs-center mt-2">Network Nodes</h3> -->
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
              :loading="loading.includes('registerNode')"
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
    },

    loading () {
      return this.$store.getters.loading;
    }
  },

  methods: {
    async registerNodeToNetwork () {
      const data = {
        registeringNode: this.registeringNode,
        newNodeUrl: this.currentNodeUrl
      };
      this.$store.dispatch('setLoading', ['registerNode']);
      try {
        await this.$emit('registerNodeToNetwork', data);
        this.$store.dispatch('setLoading', []);
      } catch (error) {
        this.$store.dispatch('setLoading', []);
      }
    }
  }
}
</script>
