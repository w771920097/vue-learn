import * as stores from './views/children/*/store.js'

export default (http, v) => {
  const modules = {}
  Object.keys(stores).forEach(k => { modules[k] = stores[k](http, v) })
  return {
    namespaced: true,
    modules,
  }
}