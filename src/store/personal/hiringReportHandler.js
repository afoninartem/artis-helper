export default {
	state: {
    correctData: [],
    incorrectData: []
	},
	mutations: {
		setData(state, payload) {
      Array.from(payload).forEach(row => {
        if (row["Руководитель"]) {
          state.correctData.push(row)
        } else {
          state.incorrectData.push(row)
        }
      })
		},
	},
	actions: {
		async setData(context, payload) {
			return await context.commit("setData", payload);
		},
	},
	getters: {},
};
