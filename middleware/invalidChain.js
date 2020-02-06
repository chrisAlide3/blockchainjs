export default function ({store, redirect}) {
  if (store.getters.invalidBlock !== '') {
    console.log("Invalid block found");
    redirect('/chain');
  }
}