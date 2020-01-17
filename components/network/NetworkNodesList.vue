<template>
  <v-card>
    <v-img
      :src="require('../../assets/images/networkNodes.png')" aspect-ratio="4"
    ></v-img>

    <v-layout justify-center>
      <v-flex xs12>
        <h3 class="text-xs-center mt-2">Whole Network of Pseudo Coin</h3> 
        <v-card-text v-for="(networkUrl, index) in networkNodes"
          :key="index"
        >
          <NetworkNodeUrl :networkUrl="networkUrl" @updateSelection="updateSelection"/>         
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            color="primary"    
          >
          Check if Active
          </v-btn>
        </v-card-actions>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import NetworkNodeUrl from '../../components/network/NetworkNodeUrl'

export default {
  components: {
    NetworkNodeUrl
  },

  data () {
    return {
      selected: []
    }
  },

  computed: {
    networkNodes () {
      return this.$store.getters.networkNodes;
    }
  },

  methods: {
    updateSelection (payload) {
      if (payload.type === 'add') {
        this.selected.push(payload.networkUrl);
      }else {
        const index = this.selected.indexOf(payload.networkUrl);        
        if (index >= 0) {
          this.selected.splice(index, 1);
        }
      }
    }
  }
}
</script>
