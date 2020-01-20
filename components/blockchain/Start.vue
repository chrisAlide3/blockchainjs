<template>
  <v-container>
    <v-layout column justify-center>
      <v-flex xs12 class="text-xs-center">
        <v-card-text>
          <h3 class="green--text">Congratulations! You succesfully registered to the Pseudo-Coin Blockchain</h3>
          <div v-if="!hasNetworkNodes">
            <h4 class="yellow--text mt-2">Warning
              <v-icon left color="yellow">
                warning
              </v-icon>
            </h4>
            
            <p>You haven't registered your Node to the Network yet.<br>
            You still can use the blockchain, but all the Transactions, Blocks will remain on your Node</p>
          </div>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>


<script>
export default {
  props: {
    hasNetworkNodes: Boolean
  },
}
</script>
