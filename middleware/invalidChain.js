export default function ({store, redirect, route}) {
  console.log("Route of invalidChain middleware: ", route);
  console.log("store.getters.invalidBlock: ", store.getters.invalidBlockIndex);
  
  
  if (route.path === '/invalidBlock' && store.getters.invalidBlockIndex === '') {
    redirect('/chain');
  }

  if (route.path !== '/invalidBlock' && store.getters.invalidBlockIndex !== '') {
    redirect('/chain');
  }
}