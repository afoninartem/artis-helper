export default {
	state: {
		showManuals: null,
	},
	mutations: {
		manualsShowTrue(state) {
			state.showManuals = true;
		},
		manualsShowFalse(state) {
			state.showManuals = false;
		},
	},
	actions: {
		async manualsShowTrue(context) {
			return await context.commit("manualsShowTrue");
		},
		async manualsShowFalse(context) {
			return await context.commit("manualsShowFalse");
		},
	},
	getters: {
		getShowManual: (state) => {
			return state.showManuals;
		},
	},
};
