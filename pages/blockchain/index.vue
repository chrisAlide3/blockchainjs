<template>
  <div>
    <p>Blockchain {{ chain }}</p>
  </div>
</template>

<script>
export default {
  
  asyncData ({$axios}) {
    return $axios.$get('/api/blockchain')
      .then((res) => {
        console.log("response received")
        console.log("Response from server " + JSON.stringify(res));
        return { chain: res.chain }
      })
      .catch(err => {
        console.error("error in axios call: " + err);
        return { blockchain: []};
      })
  }
}
</script>
