<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs1>
        <v-checkbox
          v-model="checkbox"
          color="red"
          class="shrink mr-2"
        >
        </v-checkbox>
      </v-flex>
      <v-flex xs10 pr-4>
          <v-textarea
            label="Private Key"
            readonly
            rows=1
            auto-grow
            outline
            :background-color="privateKeyObj.privateKey === activePrivateKey ? 'green' : ''"
            :value="privateKeyObj.privateKey"
          ></v-textarea>
        <!-- </v-layout> -->
      </v-flex>
      <v-flex xs1>
        <v-text-field
          label="Balance"
          readonly
          :value="privateKeyObj.balance"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap justify-center>
      <v-flex xs10 pr-4>
        <v-textarea
          label="Public Key"
          readonly
          rows=1
          auto-grow
          outline
          :background-color="privateKeyObj.privateKey === activePrivateKey ? 'green' : ''"
          :value="getPublicKey(privateKeyObj.privateKey)"
        ></v-textarea>
        <!-- <hr class="mt-3"> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default {
  
  props: {
    privateKeyObj: { // privateKey, balance
      type: Object,
      required: true
    }
  },

  data () {
    return {
      checkbox: false,
    }
  },

  watch: {
    checkbox: function(val) {      
      const type = val === true ?'add' :'remove';
      const data = {
        privateKey: this.privateKeyObj.privateKey,
        type: type
      };

      this.$emit('changeSelection', data)
    }
  },

  computed: {
    activePrivateKey () {      
      return this.$store.getters.privateKey
    },
  },

  methods: {
    getPublicKey (privateKey) {
      const keys = ec.keyFromPrivate(privateKey);
      return keys.getPublic('hex');
    },
  }
}
</script>
