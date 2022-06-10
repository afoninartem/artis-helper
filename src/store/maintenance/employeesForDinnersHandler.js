export default {
	state: {
		// detailsIsLoaded: false,
		employeesDetails: null,
	},
	mutations: {
		setEmployeesDetails(state, payload) {
			state.employeesDetails = payload;
		},
	},
	actions: {
		async setEmployeesDetails(context, payload) {
			const data = [];
			payload.forEach((row) => {
				if (row["ФИО сотрудника"] && row["Подразделение"]) {
					data.push({
						name: row["ФИО сотрудника"]
							.split("  ")
							.join(" ")
							.trim(),
						department: row["Подразделение"]
							.split("  ")
							.join(" ")
							.trim(),
					});
				}
			});
			return await context.commit("setEmployeesDetails", data);
		},
	},
	getters: {
		getEmployeesDetails: (state) => {
			return state.employeesDetails;
		},
	},
};
