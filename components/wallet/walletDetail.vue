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

      <v-flex xs10>
        <PrivateKey :privateKey="privateKey"/>
      </v-flex>
      
      <v-flex xs1>
        <v-text-field
          label="Balance"
          readonly
          reverse
          :value="balance"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap justify-center>
      <v-flex xs10>
        <PublicKey :publicKey="getPublicKey(privateKey)" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
import PrivateKey from './PrivateKey';
import PublicKey from './PublicKey';

export default {
  components: {
    PrivateKey,
    PublicKey,
  },

  props: {
    privateKey: {
      type: String,
      required: true
    }
  },

  mounted () {
    this.$axios.$get(this.$store.getters.currentNodeUrl + '/address/' + this.getPublicKey(this.privateKey))
      .then(data => {
            console.log("Mounted " + this.privateKey + data.balance);
        this.balance = data.balance;
      })
      .catch(err => {
        console.log("Error in get balance: ", err);
      })
  },

  data () {
    return {
      checkbox: false,
      balance: 0,
    }
  },

  watch: {
    checkbox: function(val) {      
      const type = val === true ?'add' :'remove';
      const data = {
        privateKey: this.privateKey,
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
