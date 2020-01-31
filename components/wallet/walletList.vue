<template>
  <v-card class="mt-2">
    <!-- Active wallet -->
    <v-layout row justify-center>
      <v-card-title>
        <h3>Active Wallet</h3>
      </v-card-title>
    </v-layout>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 pr-4>
          <WalletDetail
            :privateKeyObj="{privateKey: activePrivateKey, balance: activeWalletBalance}"
            @changeSelection="changeSelection"  
          />
        </v-flex>
      </v-layout>    
    </v-card-text>
    <!-- Additional Wallets -->
    <div v-if="walletAddresses.length > 1">
      <h3 class="text-xs-center">Additional wallets</h3>
      <v-card-text
        class="text-xs-center"
        v-for="(privateKey, index) in walletAddressesWithoutActiveAddress"
        :key="privateKey"
      >
        <v-layout row wrap>
          <v-flex xs12 pr-4>
            <WalletDetail
              :privateKeyObj="{privateKey: privateKey, balance: balanceOfAddresses[index]}"
              @changeSelection="changeSelection"  
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </div>
    <!-- Actions -->
    <v-layout row wrap justify-center>
      <v-flex xs12>  
        <div class="justify-space-around">
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
            :disabled="selected.length !== 1 || selected[0] === activePrivateKey"
          >
            Switch Active Wallet
          </v-btn>
          <v-btn
            @click="$router.go(-1)"
          >
            Back
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import WalletDetail from '../../components/wallet/walletDetail'
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default {
  components: {
    WalletDetail,
  },

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

    walletAddressesWithoutActiveAddress () {
      return this.$store.getters.walletAddresses.filter(privateKey => privateKey !== this.activePrivateKey);
    },

    activeWalletAddress () {
      return this.$store.getters.walletAddress;
    },

    activePrivateKey () {
      return this.$store.getters.privateKey
    },

    activeWalletBalance () {
      return this.$store.getters.balance;
    },

    balanceOfAddresses () {
      return this.$store.getters.balanceOfAddresses;
    }
  },

  methods: {
    createWallet () {
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
        this.selected = [];
      }
    },

    getPublicKey (privateKey) {
      const keys = ec.keyFromPrivate(privateKey);
      return keys.getPublic('hex');
    },

    changeSelection (data) {      
      if (data.type === 'add') {
        this.selected.push(data.privateKey);
      }else {
        const index = this.selected.indexOf(data.privateKey);
        if (index >= 0) {
          this.selected.splice(index, 1);
        }
      }
    }
  }
}
</script>
