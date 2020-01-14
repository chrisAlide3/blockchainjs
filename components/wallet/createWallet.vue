<template>
  <v-card>
    <v-img
      :src="require('../../assets/images/cryptowallet.jpg')" aspect-ratio="4"
    ></v-img>

    <!-- <v-card-title primary-title> -->
      <h3 class="headline mb-0 text-xs-center">
        Create a CryptoWallet
  </h3>

      <v-card-text class="mt-0 text-xs-center">
        In order to use a Blockchain, you first need to create a Crypto-Wallet
      </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn @click="createWallet" color="primary">Generate Wallet</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    createWallet () {
      console.log("generate wallet clicked");
      
      this.$emit('createWallet');
    }
  }
}
</script>

