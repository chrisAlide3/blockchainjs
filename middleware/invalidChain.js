export default function ({store, redirect, route, app}) {
  if (route.path === '/chain/invalid-block' && store.getters.invalidBlockIndex === '') {
    if (process.client) {
      let myToast = app.$toast.error("You cannot access /invalid-block page. Your chain is valid");
      redirect('/chain');
      myToast.goAway(5000)
    }
    // Toast module is not accessible server side
    if (process.server) {
      redirect('/chain');
    }
    
  }

  if (route.path !== '/chain/invalid-block' && store.getters.invalidBlockIndex !== '') {
    if (process.client) {
      let myToast = app.$toast.error("Your chain is invalid. You must first get a new chain from the Network!");
      redirect('/chain');
      myToast.goAway(6000)
    }
    // Toast module is not accessible server side
    if (process.server) {
      redirect('/chain');
    }
    
  }
}