export default {
  state: {
    shopsinfo: [],
    shopInfoForDownload: [],
  },
  mutations: {
    cleanShopInfo(state) {
      state.shopsinfo = [];
      state.shopInfoForDownload = [];
    },
    addShopInfo(state, payload) {
      state.shopsinfo.push(payload);
    },
    addShopInfoForDownload(state, payload) {
      state.shopInfoForDownload.push(payload);
    },
  },
  getters: {
    getShopsInfo: (state) => {
      if (state.shopsinfo) {
        return state.shopsinfo;
      }
    },
  },
};
