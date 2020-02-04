<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex
        v-for="block in chain"
        :key="block.id"
        xs4
      >
        <Block :block="block" :show-transactions="false" />
        <!-- <v-card flat tile>
          <v-img
            :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
            height="150px"
          ></v-img>
        </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Block from './block'

export default {
  components: {
    Block,
  },

  computed: {
    chain () {
      return this.$store.getters.chain;
    }
  }
}
</script>
