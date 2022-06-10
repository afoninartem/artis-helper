import { db } from "../../main";
export default {
	actions: {
		async addCatalogPersonalItem(context, payload) {
			await db
				.collection("personal/hiring/catalog")
				.doc(payload.id)
				.set(payload);
		},
		async removeCatalogPersonalItem(context, payload) {
			await db
				.collection("personal/hiring/catalog")
				.doc(payload)
				.delete();
		},
	},
};
