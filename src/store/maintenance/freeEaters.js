import { db } from "../../main";
export default {
	state: {
		freeEaters: null,
	},
	mutations: {
	},
	actions: {
		async addNewEater(context, payload) {
			await db
				.collection("maintenance/dinners/freeEaters")
				.doc(payload.id)
				.set(payload);
		},
		async deleteEater(context, payload) {
			await db
				.collection("maintenance/dinners/freeEaters")
				.doc(payload)
				.delete();
		},
	},
	getters: {},
};
