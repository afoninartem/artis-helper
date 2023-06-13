import { db } from "../../../main";
export default {
	state: {},
	mutations: {},
	actions: {
		async addPackage(context, payload) {
			return await db
				.collection("warehouse/shipment/packages")
				.doc(payload.id.toString())
				.set(payload);
		},
		async updatePackage(context, payload) {
      console.log(payload)
			return await db
				.collection("warehouse/shipment/packages")
				.doc(payload.id.toString())
				.update({ quan: payload.quan });
		},
		async deletePackage(context, payload) {
			return await db
				.collection("warehouse/shipment/packages")
				.doc(payload.id.toString())
				.delete();
		},
	},
	getters: {},
};
