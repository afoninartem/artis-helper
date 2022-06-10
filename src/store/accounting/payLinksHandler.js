export default {
  state: {
    payLinks: null,
  },
  mutations: {
    setPayLinksData(state, payload) {
      state.payLinks = payload;
    }
  },
  actions: {
   async setPayLinksData(context, payload) {
    return await context.commit("setPayLinksData", payload)
   }
  },
  getters: {
    getPayLinks: state => {
      return state.payLinks
    }
  }
}