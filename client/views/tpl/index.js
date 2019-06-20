import moduleRouters from './router'
import modulesStores from './store'

export default (Vue, store, router, http) => { // eslint-disable-line
  const version = 'v1.0.0'
  router.addRoutes([moduleRouters(version)])
  store.registerModule('tpl', modulesStores(http, version))
}
