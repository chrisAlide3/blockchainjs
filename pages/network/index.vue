<template>
  <network-nodes-list v-if="hasNetworkNodes" />
  <register-node v-else />
</template>

<script>
import NetworkNodesList from '../../components/network/NetworkNodesList'
import RegisterNode from '../../components/network/RegisterNode'

export default {
  components: {
    NetworkNodesList,
    RegisterNode,
  },

  computed: {
    hasNetworkNodes () {
      if (this.$store.getters.networkNodes.length === 0) {
        return false;
      }else {
        return true;
      }
    }
  }
}
</script>
