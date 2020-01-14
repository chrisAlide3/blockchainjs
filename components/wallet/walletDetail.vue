<template>
  <v-card>
    <v-img
      :src="require('../../assets/images/cryptowallet.jpg')" aspect-ratio="4"
    ></v-img>

    <h3 class="headline mt-2 mb-0 text-xs-center">
      Wallet Detail
    </h3>

    <p>{{ selected }}</p>

    <v-card-text
      class="mt-1 text-xs-center"
      v-for="(privateKey, index) in walletAddresses"
      :key="index">
      <v-layout row wrap>
        <v-flex xs11 pr-4 pl-1>
          <v-layout>
            <v-checkbox
              multiple
              v-model="selected"
              :value="privateKey"
              color="red"
              hide-details
              class="shrink mr-2"
            >
            </v-checkbox>
            <v-textarea
              label="Private Key"
              readonly
              rows=1
              auto-grow
              outline
              :background-color="privateKey === activePrivateKey ? 'green' : 'grey'"
              :value="privateKey"
            ></v-textarea>
          </v-layout>
        </v-flex>
        <v-flex xs1>
          <v-text-field
            label="Balance"
            readonly
            :value="balanceOfAddresses[index]"
          >
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row wrap justify-center>
        <v-flex xs10 class="mr-5 pl-1">
          <v-textarea
            label="Public Key"
            readonly
            rows=1
            auto-grow
            outline
            :background-color="privateKey === activePrivateKey ? 'green' : 'grey'"
            :value="getPublicKey(privateKey)"
          ></v-textarea>
        <hr class="mt-3">
      </v-flex>
      </v-layout>
    </v-card-text>

    <v-layout justify-center>
      <v-flex xs9>
        <v-card-actions class="justify-space-around">
          <v-btn
            @click="createWallet"
            color="primary"
          >
            Generate Wallet
          </v-btn>
          <v-btn
            @click="deleteWallet"
            color="error"
            :disabled="selected.length === 0"
          >
            Delete Wallet
          </v-btn>
          <v-btn
            @click="switchActiveWallet"
            color="green"
            :disabled="selected.length !== 1"
          >
            Switch Active Wallet
          </v-btn>
        </v-card-actions>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default {

  created () {
    this.walletAddresses.forEach(privateKey => {
      const publicKey = this.getPublicKey(privateKey);
      this.$store.dispatch('getBalancebyAddress', publicKey)
    })    
  },

  data () {
    return {
      selected: [],
    }
  },

  computed: {
    walletAddresses () {
      return this.$store.getters.walletAddresses;
    },

    activeWalletAddress () {
      return this.$store.getters.walletAddress;
    },

    activePrivateKey () {      
      return this.$store.getters.privateKey
    },

    balanceOfAddresses () {
      return this.$store.getters.balanceOfAddresses;
    }
  },

  methods: {
    createWallet () {
      console.log("generate wallet clicked");  
      this.$emit('createWallet');
    },

    deleteWallet () {
      this.selected.forEach(privateKey => {
        const index = this.walletAddresses.indexOf(privateKey);
        const balance = this.balanceOfAddresses[index];
        if (balance > 0) {
          console.log("Wallet has balance! Show dialog");
        }else {
          this.$emit("deleteWallet", {privateKey: privateKey});
        }
      })
      this.selected = [];
    },

    switchActiveWallet () {
      const index = this.selected.indexOf(this.activePrivateKey);
      if (index < 0) {
        this.$emit("switchActiveWallet", {privateKey: this.selected[0]});
        this.selected = [];
      }else {
        console.log("Selected wallet is already active");
      }
    },

    getPublicKey (privateKey) {
      const keys = ec.keyFromPrivate(privateKey);
      return keys.getPublic('hex');
    },
  }
}
</script>
