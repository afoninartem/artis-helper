export default {
	state: {
		originalData: null,
		loadCounter: 0,
		name: null,
	},
	mutations: {
		setOriginalData(state, payload) {
			state.originalData = payload;
		},
		incrementCounter(state) {
			state.loadCounter++;
		},
		setOriginalFileName(state, payload) {
			state.name = payload.replace(".xls", "");
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
		getOriginalFileName: (state) => {
			return state.name;
		},
	},
};
