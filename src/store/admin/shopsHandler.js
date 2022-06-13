import {db} from "../../main"
export default {
  state: {
    tableOrder: [
      "name",
      "status",
      "email",
      "shipmentTerms",
      "innerPhone",
      "outerPhone",
      "region",
      "adress",
      "workingTime",
      "coffeeMachine",
      "isOpen",
      "isMall",
    ],
    shopPopupVisibility: false,
    currentShop: null,
  },
  mutations: {
    openShopPopup(state, payload) {
      state.currentShop = payload;
      state.shopPopupVisibility = true;
    },
    closeShopPopup(state) {
      state.shopPopupVisibility = false;
      state.currentShop = null;
    },
  },
  actions: {
    async openShopPopup(context, payload) {
      return await context.commit("openShopPopup", payload);
    },
    async closeShopPopup(context) {
      return await context.commit("closeShopPopup");
    },
    async changeShopData(context, payload) {
      await db.collection("shops").doc(payload.name.split("/").join(" ")).set(payload)
    }
  },
  getters: {
    getTableOrder: (state) => {
      return state.tableOrder;
    },
    getShopPopupVisibility: (state) => {
      return state.shopPopupVisibility;
    },
    getCurrentShop: (state) => {
      return state.currentShop;
    },
  },
};
