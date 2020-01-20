<template>
  <!-- <v-card> -->
    <v-layout align-center justify-space-around row fill-height>
      <v-flex xs6>
        <v-checkbox
          v-model="checkbox"
          :label="networkUrl"
          color="red"
          >
        </v-checkbox>
      </v-flex>

      <v-flex xs2>
        <v-chip v-if="isOnline"
          color="green"
          text-color="white"
        >
        online
        </v-chip>

        <v-chip v-else
          color="red"
          text-color="white"
        >
        offline
        </v-chip>
      </v-flex>      
    </v-layout>
  <!-- </v-card> -->
</template>

<script>
export default {
  async created () {
    console.log("Enter created hook");
    
    try {
      await this.$axios.$get(this.networkUrl + '/current-nodeurl');
      console.log('found status');
      
      this.isOnline = true;
    } catch (error) {
      this.isOnline = false;
            console.log('didnt find status');
    }
  },

  props: {
    networkUrl: String
  },

  data () {
    return {
      isOnline: false,
      checkbox: false
    }
  },

  watch: {
    checkbox: function (val) {
      this.emitSelection(val);
    }
  },

  methods: {
    emitSelection (val) {
      const networkUrl = this.networkUrl;
      let type = null;
      if (val) {
        type = 'add';
      }else {
        type = 'remove';
      }
      const payload = {
        networkUrl: networkUrl,
        type: type
      };      
      this.$emit('updateSelection', payload)
    }
  }
}
</script>
