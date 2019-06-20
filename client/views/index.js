

import * as modules from './*/index.js'

export default (Vue, store, router, http) => {
  Object.keys(modules).forEach(key => {
    Vue.use(modules[key], store, router, http)
  })
}