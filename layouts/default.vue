<template>
  <v-app dark>
    <v-content>

      <Header />
      
      <v-container>
        <nuxt />
      </v-container> 
    </v-content>
  </v-app>
</template>

<script>
import Header from '../components/global/Header'

export default {
  components: {
    Header,
  }
}
</script>
