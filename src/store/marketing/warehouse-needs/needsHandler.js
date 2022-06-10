import { db } from "../../../main";
export default {
	state: {
		popup: null,
	},
	mutations: {
		showPopUp(state, payload) {
			state.popup = payload;
		},
		closePopUp(state) {
			state.popup = null;
		},
	},
	actions: {
		async showPopUp(context, payload) {
			payload.background =
				payload.context === `createOrder` || payload.context === `gotOrder`
					? `rgb(133, 148, 175)`
					: `rgb(165, 72, 77)`;
			return await context.commit("showPopUp", payload);
		},
		async closePopUp(context) {
			return await context.commit("closePopUp");
		},
		async createNewRequest({ dispatch }, payload) {
			payload.created = await dispatch("convertDate", payload.id);
			payload.deadline = await dispatch("convertDate", payload.reserve);
			await db
				.collection("warehouse/internal/needs")
				.doc(payload.id.toString())
				.set(payload);
		},
		async createOrder({ dispatch }, payload) {
			const ordered = await dispatch("convertDate", Date.now());
			await db
				.collection("warehouse/internal/needs")
				.doc(payload)
				.update({ ordered: ordered, inProgress: true });
		},
		async deleteRequest(context, payload) {
			await db
				.collection("warehouse/internal/needs")
				.doc(payload)
				.delete();
		},
		async backToRequest(context, payload) {
			await db
				.collection("warehouse/internal/needs")
				.doc(payload)
				.update({ ordered: null, inProgress: false });
		},
		async editRequest({ dispatch }, payload) {
      payload.deadline = await dispatch("convertDate", payload.reserve);
			await db
				.collection("warehouse/internal/needs")
				.doc(payload.id)
				.update({
					name: payload.name,
					quantity: payload.quantity,
					reserve: payload.reserve,
          deadline: payload.deadline,
					urgent: payload.urgent,
				});
		},
		async convertDate(context, payload) {
			const date = new Date(payload);
			const day =
				date.getDate() > 10 ? date.getDate().toString() : `0${date.getDate()}`;
			const month =
				date.getMonth > 8
					? (date.getMonth() + 1).toString()
					: `0${date.getMonth() + 1}`;
			const year = date.getFullYear();
			return `${day}.${month}.${year}`;
		},
	},
	getters: {
		getPopUp: (state) => {
			return state.popup;
		},
	},
};
