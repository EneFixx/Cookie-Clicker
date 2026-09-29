// src/store/index.js
import { createStore } from 'vuex'
import mine from './modules/mine'
import utilisateurs from './modules/utilisateurs'

export default createStore({
  modules: {
    mine,
    utilisateurs
  }
})