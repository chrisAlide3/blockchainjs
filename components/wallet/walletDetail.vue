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
      <v-flex xs9 pr-2>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :type="show1 ? 'text' : 'password'"
          label="Private Key"
          readonly
          @click:append="show1 = !show1"
        >
        </v-text-field>
        <!-- Tooltip for Copy message -->
        <v-layout justify-end>
          <v-flex xs1>
            <v-tooltip v-model="showPrivateKeyCopyMessage" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>Private Key copied to clipboard</span>
              <v-icon small right @click="showPrivateKeyCopyMessage=false">close</v-icon>
            </v-tooltip>
          </v-flex>
        </v-layout>
        
      </v-flex>

      <v-flex xs1 pt-4 grow>
        <v-icon small @click="copyPrivateKey">mdi-content-copy</v-icon>
        <v-icon small @click="showBarcode('privateKey')">mdi-barcode</v-icon>
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
      <v-flex xs9 pr-4>
        <v-textarea
          label="Public Key"
          readonly
          rows=1
          auto-grow
          outline
          :background-color="privateKeyObj.privateKey === activePrivateKey ? 'green' : ''"
          :value="getPublicKey(privateKeyObj.privateKey)"
        ></v-textarea>

        <!-- Tooltip for Copy message -->
        <v-layout justify-end>
          <v-flex xs1>
            <v-tooltip v-model="showWalletCopyMessage" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"></span>
              </template>
              <span>Wallet address copied to clipboard</span>
              <v-icon small right @click="showWalletCopyMessage=false">close</v-icon>
            </v-tooltip>
          </v-flex>
        </v-layout>

      </v-flex>

      <v-flex xs1 pt-4>
        <v-icon small @click="copyWalletAddress">mdi-content-copy</v-icon>
        <v-icon small @click="showBarcode('privateKey')">mdi-barcode</v-icon>
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
      show1: false,
      password: this.privateKeyObj.privateKey,
      showPrivateKey: false,
      showPrivateKeyCopyMessage: false,
      showWalletCopyMessage: false
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

    copyPrivateKey () {
      try {
        this.$copyText(this.privateKeyObj.privateKey);
        this.showPrivateKeyCopyMessage = true;
        setTimeout(() => {
          this.showPrivateKeyCopyMessage = false
        }, 3000);
      } catch (error) {
        alert('Could not copy sender to clipboard');
      }
    },

    copyWalletAddress () {
      try {
        this.$copyText(this.getPublicKey(this.privateKeyObj.privateKey));
        this.showWalletCopyMessage = true;
        setTimeout(() => {
          this.showWalletCopyMessage = false
        }, 3000);
      } catch (error) {
        alert('Could not copy sender to clipboard');
      }
    },

    showBarcode (field) {
      
    },
  }
}
</script>
