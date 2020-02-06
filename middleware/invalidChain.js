export default function ({store, redirect, route}) {
  if (route.path === '/invalidBlock' && store.getters.invalidBlockIndex === '') {
    redirect('/chain');
  }

  if (route.path !== '/invalidBlock' && store.getters.invalidBlockIndex !== '') {
    redirect('/chain');
  }
}