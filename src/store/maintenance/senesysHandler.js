export default {
	state: {
		senesys: null,
	},
	mutations: {
		addSenesysData(state, payload) {
			state.senesys = payload;
		},
	},
	actions: {
		async addSenesysData({ commit, getters }, payload) {
			// console.log(payload)
			const rawData = payload.filter((e) => e.__EMPTY_7);
			const companies = [];
			rawData.shift();
			const freeEaters = getters.getActualStates.dinners.map((f) => f.name);
			const employeesDetails = getters.getEmployeesDetails;
			const artisEmployeesNames = employeesDetails.map((e) => e.name);
			console.log(rawData);
			rawData.forEach((row) => {
				row.__EMPTY_7 = row.__EMPTY_7.split("  ").join(" ");

				if (!freeEaters.includes(row.__EMPTY_7)) {
					row.__EMPTY_10 === "Арс Холдинг" || row.__EMPTY_10 === "Артис-XXI век"
						? (row.__EMPTY_10 = "Артис")
						: null;
					row.__EMPTY_10 === "Эмульсии" ? (row.__EMPTY_10 = "Эмульком") : null;

					if (companies.some((company) => company.name === row.__EMPTY_10)) {
						const c_Company = companies.filter(
							(company) => company.name === row.__EMPTY_10
						)[0];
						c_Company.employees.some(
							(employee) => employee.name === row.__EMPTY_7.trim()
						)
							? row.__EMPTY_5
								? c_Company.employees
										.filter(
											(employee) => employee.name === row.__EMPTY_7.trim()
										)[0]
										.markList.push(row.__EMPTY_3, row.__EMPTY_5)
								: c_Company.employees
										.filter(
											(employee) => employee.name === row.__EMPTY_7.trim()
										)[0]
										.markList.push(row.__EMPTY_3)
							: row.__EMPTY_5
							? c_Company.employees.push({
									name: row.__EMPTY_7.trim(),
									markList: [row.__EMPTY_3, row.__EMPTY_5],
							  })
							: c_Company.employees.push({
									name: row.__EMPTY_7.trim(),
									markList: [row.__EMPTY_3],
							  });
					} else {
						if (!freeEaters.includes(row.__EMPTY_7)) {
							companies.push({
								name: row.__EMPTY_10,
								employees: [
									{
										name: row.__EMPTY_7,
										markList: row.__EMPTY_5
											? [row.__EMPTY_3, row.__EMPTY_5]
											: [row.__EMPTY_3],
									},
								],
							});
						}
					}
				}
			});
			const artis = companies.filter((c) => c.name === "Артис")[0];
			artis.departments = [
				{ name: "Уволенные и неопределенные", employees: [], total: 0 },
			];
			artis.employees.forEach((a) => {
				if (artisEmployeesNames.includes(a.name)) {
					const department = employeesDetails.filter(
						(e) => e.name === a.name
					)[0].department;
					if (artis.departments.some((d) => d.name === department)) {
						artis.departments
							.filter((d) => d.name === department)[0]
							.employees.push(a);
						artis.departments.filter((d) => d.name === department)[0].total +=
							a.markList.length;
					} else {
						artis.departments.push({
							name: department,
							employees: [a],
							total: +a.markList.length,
						});
					}
				} else {
					artis.departments
						.filter((d) => d.name === "Уволенные и неопределенные")[0]
						.employees.push(a);
					artis.departments.filter(
						(d) => d.name === "Уволенные и неопределенные"
					)[0].total += a.markList.length;
				}
			});
			companies.forEach((company) => {
				company.departments
					? (company.departments.sort((a, b) =>
							a.name > b.name ? 1 : b.name > a.name ? -1 : 0
					  ),
					  company.departments.forEach((d) =>
							d.employees.sort((a, b) =>
								a.name > b.name ? 1 : b.name > a.name ? -1 : 0
							)
					  ))
					: company.employees.sort((a, b) =>
							a.name > b.name ? 1 : b.name > a.name ? -1 : 0
					  );
			});
			console.log(companies);
			return await commit("addSenesysData", companies);
		},
	},
	getters: {
		getHandledSenesys: (state) => {
			return state.senesys;
		},
	},
};
