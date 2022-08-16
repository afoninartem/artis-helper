import { db } from "../../../main";
export default {
	state: {},
	mutations: {},
	actions: {
		async setMarker(context, payload) {
			await db
				.collection("warehouse/shipment/markers")
				.doc(payload.id)
				.set(payload);
		},
		async deleteMarker(context, payload) {
			await db.collection("warehouse/shipment/markers").doc(payload).delete();
		},
	},
	getters: {},
};
