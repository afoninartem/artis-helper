export default {
	state: {
		show: false,
		driver: null,
		day: null,
	},
	mutations: {
		openDriverExtraPopup(state, payload) {
			state.show = true;
			state.driver = payload.driver;
			state.day = payload.day;
		},
		closeDriverExtraPopup(state) {
			state.show = false;
			state.driver = null;
			state.day = null;
		},
	},
	actions: {
		async openDriverExtraPopup(context, payload) {
			return await context.commit("openDriverExtraPopup", payload);
		},
		async closeDriverExtraPopup(context) {
			return await context.commit("closeDriverExtraPopup");
		},
	},
	getters: {
		getDriverExtraPopupVisibility: (state) => {
			return state.show;
		},
		getDriverExtraPopupDetails: (state) => {
			return { driver: state.driver, day: state.day };
		},
	},
};
