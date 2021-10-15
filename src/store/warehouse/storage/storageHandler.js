import { db } from "../../../main";
export default {
  state: {
    storage: null,
  },
  mutations: {
    setStorage(state, payload) {
      state.storage = payload;
    },
  },
  actions: {
    async addStorage( payload) {
      db.collection("warehouse/storage/roomStorage")
        .doc(payload.split("/").join(" "))
        .set({ name: payload });
    },
    async setStorage(context, payload) {
      return await context.commit("setStorage", payload)
    }
  },
  getters: {
    getRoomMaterials: (state) => {
      return state.storage
    }
  },
};
