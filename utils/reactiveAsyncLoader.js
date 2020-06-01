import { ReactiveVar } from 'meteor/reactive-var'

export const reactiveAsyncLoader = (loadFnPromise) => {
  const loaded = new ReactiveVar()
  loadFnPromise
    .then(result => {
      loaded.set(result)
    })
    .catch(e => loaded.set(e))
  return loaded
}
