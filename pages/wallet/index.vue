<template>
  <WalletList 
    @createWallet="createWallet"
    @deleteWallet="deleteWallet"
    @switchActiveWallet="switchActiveWallet"
  />
</template>

<script>
import WalletList from '../../components//wallet/walletList'

export default {
  components: {
    WalletList,
  },

  methods: {
    async createWallet () {
      this.$store.dispatch('setLoading', ['generateWallet'])      
      try {
        await this.$store.dispatch("createWallet");
        this.$store.dispatch('setLoading', [])
        console.log("Wallet created");
        
      } catch (error) {
        console.log("Error creating wallet");
        this.$store.dispatch('setLoading', []);
      }
    },

      deleteWallet (privateKey) {
        console.log("PrivateKey in emmit delete: " + privateKey);
        try {
          this.$store.dispatch("deleteWallet", privateKey);
        } catch (error) {
          console.log("Error in dispatch deleteWallet: " + error);
        }
      },

      switchActiveWallet (privateKey) {
        try {
          this.$store.dispatch("switchActiveWallet", privateKey);
        } catch (error) {
          console.log("Error in dispatch switchActiveWallet: " + error);
        }
      },

  },
}
</script>
