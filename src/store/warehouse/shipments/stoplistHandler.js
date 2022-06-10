import { db } from "../../../main";
export default {
	state: {
    // stoplist: null,
  },
	// mutations: {
  //   setStopListToVuex(state, payload) {
  //     state.stoplist = payload
  //   }
  // },
	actions: {
		async addStopListItem(context, payload) {
			return await db
				.collection("warehouse/shipment/stoplist")
				.doc(payload.id)
				.set(payload);
		},
    async deleteStopItem(context, id) {
      return await db.collection("warehouse/shipment/stoplist").doc(id).delete();
    },
    // async setStopListToVuex(context, payload) {
    //   return await context.commit("setStopListToVuex", payload)
    // }
	},
	getters: {},
};
