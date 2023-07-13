export default {
	state: {
		originalData: null,
		loadCounter: 0,
	},
	mutations: {
		setOriginalData(state, payload) {
			state.originalData = payload;
		},
		incrementCounter(state) {
			state.loadCounter++;
		},
	},
	actions: {
		setMaterialConsumptionData(context, payload) {
			context.commit("setOriginalData", payload);
		},
	},
	getters: {
		getCounter: (state) => {
			return state.loadCounter;
		},
		getOriginalData: (state) => {
			return state.originalData;
		},
	},
};
