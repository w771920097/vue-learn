import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import globe from './globe'

Vue.use(Vuex)

const state = {}

const mutations = {}

const actions = {}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    globe,
  },
  plugins: [createPersistedState({ paths: ['globe'] })],
})

export default store
