export default {
	state: {
		senesys: null,
		totalByDate: null,
		dateSheets: null,
	},
	mutations: {
		addSenesysData(state, payload) {
			state.senesys = payload;
		},
		addTotalByDate(state, payload) {
			state.totalByDate = payload;
		},
		addDateSheets(state, payload) {
			state.dateSheets = payload;
		},
	},
	actions: {
		async addSenesysData({ commit, getters }, payload) {
			const rawHeader = Object.entries(payload[1]);
			// console.log(rawHeader);
			const dateKey = rawHeader.filter((x) => x[1] === "Дата")[0][0];
			const nameKey = rawHeader.filter((x) => x[1] === "ФИО")[0][0];
			const companyKey = rawHeader.filter((x) => x[1] === "Компания")[0][0];
			const datetimeKey = rawHeader.filter((x) => x[1] === "Вход")[0][0];
			const tableAlert = rawHeader.filter((x) => x[1] === "Выход")[0][0];
			const rawData = payload.filter((e) => e[nameKey]);
			const companies = [];
			rawData.shift();
			const freeEaters = getters.getActualStates.dinners.map((f) => f.name);
			const employeesDetails = getters.getEmployeesDetails;
			const artisEmployeesNames = employeesDetails.map((e) => e.name);
			// console.log(rawData);

			//golang backend experiment
			// const todayDate = new Date().toLocaleDateString("ru-Ru");
			// rawData.forEach( async (row) => {
			// 	const senesysMarkObject = {
			// 		todaydate: todayDate,
			// 		date: row.__EMPTY_1,
			// 		datetime: row.__EMPTY_3,
			// 		name: row.__EMPTY_7.split("  ").join(" "),
			// 		company: row.__EMPTY_10,
			// 	};
			//   // await fetch("")
			// });

			const totalByDate = [];
			const dateSheets = [];

			rawData.forEach((row) => {
				if (row[tableAlert])
					return alert(
						"При выгрузке данных из Senesys надо убрать обе галочки над таблицей."
					);

				row[nameKey] = row[nameKey].split("  ").join(" ");

				if (!freeEaters.includes(row[nameKey])) {
					row[companyKey] === "Арс Холдинг" ||
					row[companyKey] === "Артис-XXI век"
						? (row[companyKey] = "Артис")
						: null;
					row[companyKey] === "Эмульсии"
						? (row[companyKey] = "Эмульком")
						: null;

					// totalByDate calculation ↓
					totalByDate.some((x) => x["Дата"] === row[dateKey])
						? (totalByDate.filter((x) => x["Дата"] === row[dateKey])[0][
								row[companyKey]
						  ] += 1)
						: totalByDate.push({
								Дата: row[dateKey],
								Артис: row[companyKey] === "Артис" ? 1 : 0,
								"Гуд Вуд": row[companyKey] === "Гуд Вуд" ? 1 : 0,
								Эмульком: row[companyKey] === "Эмульком" ? 1 : 0,
						  });

					// totalByDate calculation ↑

					if (companies.some((company) => company.name === row[companyKey])) {
						const c_Company = companies.filter(
							(company) => company.name === row[companyKey]
						)[0];
						c_Company.employees.some(
							(employee) => employee.name === row[nameKey].trim()
						)
							? c_Company.employees
									.filter(
										(employee) => employee.name === row[nameKey].trim()
									)[0]
									.markList.push(row[datetimeKey])
							: c_Company.employees.push({
									name: row[nameKey].trim(),
									markList: [row[datetimeKey]],
							  });
					} else {
						if (!freeEaters.includes(row[nameKey])) {
							companies.push({
								name: row[companyKey],
								employees: [
									{
										name: row[nameKey],
										markList: [row[datetimeKey]],
									},
								],
							});
						}
					}
				}
			});
			companies.sort((a, b) =>
				a.name > b.name ? 1 : b.name > a.name ? -1 : 0
			);
      const periodTotalByCompany = { Дата: "Итого:" };
      totalByDate.forEach((date) => {
        for (let key in date) {
          if (key != "Дата") {
            periodTotalByCompany[key]
              ? (periodTotalByCompany[key] += date[key])
              : (periodTotalByCompany[key] = date[key]);
          }
        }
      });
      totalByDate.push(periodTotalByCompany)
			commit("addTotalByDate", totalByDate);

			totalByDate.forEach((total) => {
				const sheetName = total["Дата"];
				let sheetData = [];
				companies.forEach((c) => {
					const todayEaters = c.employees
						.map((e) => {
							return e.markList.map((m) => ({ name: e.name, mark: m }));
						})
						.flat()
						.filter((m) => m.mark.includes(sheetName))
						.map((x) => x.name)
						.sort()
						.map((x) => ({ [c.name]: x }));
					sheetData = sheetData.concat(todayEaters);
				});
				const sheetHandledData = [];
				sheetData.forEach((data) => {
					const companyName = Object.keys(data)[0];
					const companyNameAndTotal = `${companyName} (${total[companyName]})`;
					const employeeName = Object.values(data)[0];
					sheetHandledData.some((item) => !item[companyNameAndTotal])
						? (sheetHandledData.filter((item) => !item[companyNameAndTotal])[0][
								companyNameAndTotal
						  ] = employeeName)
						: sheetHandledData.push({
								[`Список отметившихся за обед ${sheetName}`]: "",
								[companyNameAndTotal]: employeeName,
						  });
				});
				dateSheets.push({
					sheetName,
					sheetHandledData,
				});
			});

			commit("addDateSheets", dateSheets);

			const artis = companies.filter((c) => c.name === "Артис")[0];
			artis.departments = [
				{ name: "Неопределенные", employees: [], total: 0 },
			];
			artis.employees.forEach((a) => {
				if (artisEmployeesNames.includes(a.name)) {
					const department = employeesDetails.filter(
						(e) => e.name === a.name
					)[0].department;
          a.code = employeesDetails.filter(e => e.name == a.name)[0].code
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
						.filter((d) => d.name === "Неопределенные")[0]
						.employees.push(a);
					artis.departments.filter(
						(d) => d.name === "Неопределенные"
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
			return await commit("addSenesysData", companies);
		},
	},
	getters: {
		getHandledSenesys: (state) => {
			return state.senesys;
		},
		getTotalByDate: (state) => {
			return state.totalByDate;
		},
		getDateSheets: (state) => {
			return state.dateSheets;
		},
	},
};
