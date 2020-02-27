export default function ({ store, redirect, app}) {

  if (store.getters.walletAddress === '') {
    if (process.client) {
      let myToast = app.$toast.error("You have been redirected as you need a wallet to access this page!");
      redirect('/register');
      myToast.goAway(5000);
    }
    // Toast module is not accessible server side
    if (process.server) {
      redirect('/register');
    }
       
  }
}