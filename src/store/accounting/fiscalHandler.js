export default {
	state: {
		fiscalData: null,
	},
	mutations: {
		setFiscalReportData(state, payload) {
			state.fiscalData = payload;
		},
	},
	actions: {
		async setFiscalReportData(context, payload) {
      // console.log(payload)
			return await context.commit("setFiscalReportData", payload);
		},
	},
	getters: {
    getFiscalData: state => {
      return state.fiscalData
    }
  },
};
