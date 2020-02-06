export default function ({ store, redirect}) {
  if (store.getters.walletAddress === '') {
    redirect('/register');
  }
}