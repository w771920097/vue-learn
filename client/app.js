import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import IView from 'iview'
import App from './components/App/index.vue'
import router from './router'
import store from './store'
import components from './components'
import views from  './views'

import 'iview/dist/styles/iview.css'
// import 'root/assets/font/iconfont.css'
import 'root/assets/css/reset-1.3.3.css'

Vue.use(IView)
Vue.use(components)
sync(store, router)

const app = new Vue({
  router,
  store,
  ...App,
})

const { http } = app

Vue.use(views, store, router, http)

// http.setErrorHook((httpError, fetchUrl) => {
//   console.log('[HTTP ERROR]', fetchUrl) // eslint-disable-line

//   if (httpError.code === 40101) {
//     // token 失效 handle
//     store.dispatch('user/clearUserInfo', () => {
//       const theRequest = new Object()
//       const url = window.location.search
//       if (url.indexOf('?') !== -1) {
//         const str = url.substr(1)
//         const strs = str.split('&')
//         for (let i = 0; i < strs.length; i++) {
//           theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
//         }
//       }
//       const { path } = theRequest
//       if (router.currentRoute.path !== '/login' && !path) {
//         // app.$Message.error(HttpErrorMap[httpError.code])
//         // router.replace('/login')
//         const config =  store.getters['user/conf']
//         if (config.logout) {
//           window.location.replace(`//${config.logout}`)
//         } else {
//           router.replace('/login')
//         }
//       }
//     })
//   }
//   if (httpError.code !== 40101 && httpError.httpStatus !== 'REQUEST_TIMEOUT') {
//     app.$Message.error(httpError.message)
//   }
//   return false
// })

// TODO 鉴权

router.addRoutes([{
  path: '*', // 此处需特别注意至于最底部
  redirect: '/404',
},
{
  path: '/404', // 此处需特别注意至于最底部
  component: () => import('./components/NotFound'),
}])

// 单点登录
window.addEventListener('pageshow', () => {
  const theRequest = new Object()
  const url = window.location.search
  if (url.indexOf('?') !== -1) {
    const str = url.substr(1)
    const strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
    }
  }
  const { path } = theRequest // eslint-disable-line
  // if (path) {
  //   app.$store.dispatch('user/doLoginSso', { flag: 5 })
  //     .then(() => {
  //       window.location.replace(`//${window.location.host}/#${path}`)
  //     })
  // }
})

export {
  app,
  router,
  store,
  http,
}
