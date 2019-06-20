
import waterMarker from 'root/lib/water-marker'
import { Debounce, Throttle } from '../lib/function-tool'
import * as components from './*/index.vue'
import Http from '../lib/http'
import imgPreview from 'tq-img-preview'

const formatName = (name) => {
  const firstIndex = 0
  const deleteCount = 1
  const str = name.replace(/([A-Z])/g, '-$1').toLowerCase()
  return str.indexOf('-') === firstIndex ? str.substr(deleteCount) : str
}

const component = {
  install: function (Vue) { // eslint-disable-line
    for (const key in components) {
      if (components.hasOwnProperty(key)) {
        const c = components[key]
        Vue.component(formatName(c.name), c)
        console.log(`${formatName(c.name)} component registered ！`)
      }
    }

    // 请求框架
    Vue.use(Http)

    Vue.prototype.$Debounce = Debounce
    Vue.prototype.$Throttle = Throttle
    Vue.use(waterMarker)
    Vue.use(imgPreview)
  },
}

export default component