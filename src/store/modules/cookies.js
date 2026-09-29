export default {
  namespaced: true,
  state: {
    cookies: 0
  },
  getters: {
    doubleCookies: state => state.cookies * 2
  },
  mutations: {
    ajouterCookie(state) {
      state.cookies++
    }
  },
  actions: {
    async ajouterCookieAvecDelai({ commit }) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      commit('ajouterCookie')
    }
  }
}