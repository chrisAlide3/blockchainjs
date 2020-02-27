export default function ({ store, redirect, app}) {
  if (store.getters.walletAddress === '') {
    // app.$toast.error('You have been redirected as you need a wallet to access this page!');
    let myToast = app.$toast.error("You have been redirected as you need a wallet to access this page!");
    redirect('/register');
    myToast.goAway(5000);   
  }
}