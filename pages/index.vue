<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      justify-center
    >
      <v-card>
        <v-img
          :src="require('../assets/images/cryptocurrency.jpg')"
          aspect-ratio="2.75"
        ></v-img>
        <v-card-title class="headline justify-center orange--text">Welcome to PseudoCoin</v-card-title>

        <div class="text-xs-center">
          <v-btn @click="getStarted" color="orange" class="text-xs-center">Get Started ...</v-btn>
        </div>

        <v-card-text class="text-xs-center">
          <p>PseudoCoin is a Bitcoin clone to help Cryptocurrency begginers understanding how Cryptos work</p>
          <div class="text-xs-right">
            <em><small>&mdash; Chris Bracher</small></em>
          </div>
          <hr class="my-3">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla blanditiis dolor nesciunt nam placeat rerum soluta cumque, vitae earum enim. Quas, deleniti ratione possimus veritatis doloribus ea molestiae iste aperiam!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore soluta aperiam dolores nihil ducimus consectetur iusto eligendi porro pariatur odio rem unde culpa veritatis assumenda, est nemo accusantium placeat eos?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/inspire"
          >Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },

  methods: {
    getStarted () {
      // Check if wallet available
      // If yes go to /blockchain
      // If no go to register
      this.$router.push('/register');
    }
  }
}
</script>
