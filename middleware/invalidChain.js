export default function ({store, redirect, route}) {
  if (route.path === '/chain/invalid-block' && store.getters.invalidBlockIndex === '') {
    redirect('/chain');
  }

  if (route.path !== '/chain/invalid-block' && store.getters.invalidBlockIndex !== '') {
    redirect('/chain');
  }
}