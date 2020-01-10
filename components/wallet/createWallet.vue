<template>
      <v-card>
        <v-img
          :src="require('../../assets/images/cryptowallet.jpg')" aspect-ratio="4"
        ></v-img>

        <!-- <v-card-title primary-title> -->
          <h3 class="headline mb-0 text-xs-center">
            Generate CryptoWallet
      </h3>

          <v-card-text class="mt-0">
            In order to use a Blockchain, you first need to create a Crypto-Wallet
            <br>
            A Crypto-Wallet is a Keypair generated with some Cryptographical functions
            <p>It will generate a PrivateKey which is used to Sign your Transactions and a PublicKey which will be your Address that you share in the Blockchain</p>
          </v-card-text>

        <v-card-actions>
          <v-btn flat color="success">Generate Wallet</v-btn>
        </v-card-actions>
      </v-card>
</template>
