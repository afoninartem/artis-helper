import { db } from "../../main";
export default {
	state: {
		// positionsDiffs: null,
		pickedMonth: null,
		//
		info1C7: null,
		info1C8_A21: null,
		info1C8_AP: null,
		info1C8_DP: null,
		shedule1C8_A21: null,
		shedule1C8_AP: null,
		shedule1C8_DP: null,
		extras: {
			// fromOS: [],
			from1C7: null,
			from1C8_A21: null,
			from1C8_AP: null,
			from1C8_DP: null,
		},
	},
	mutations: {
		addPositionsDiffs(state, payload) {
			state.positionsDiffs = payload;
		},
		//
		add1C8Shedule_A21(state, payload) {
			state.shedule1C8_A21 = payload;
		},
		add1C8Shedule_AP(state, payload) {
			state.shedule1C8_AP = payload;
		},
		add1C8Shedule_DP(state, payload) {
			state.shedule1C8_DP = payload;
		},
		add1C7info(state, payload) {
			state.info1C7 = payload;
		},
		add1C8info_A21(state, payload) {
			state.info1C8_A21 = payload;
		},
		add1C8info_AP(state, payload) {
			state.info1C8_AP = payload;
		},
		add1C8info_DP(state, payload) {
			state.info1C8_DP = payload;
		},
		setExtras1C7(state, payload) {
			// console.log(payload);
			state.extras.from1C7 = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_A21(state, payload) {
			// console.log(payload);
			state.extras.from1C8_A21 = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_AP(state, payload) {
			// console.log(payload);
			state.extras.from1C8_AP = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_DP(state, payload) {
			// console.log(payload);
			state.extras.from1C8_DP = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setPickedMonth(state, payload) {
			state.pickedMonth = payload;
		},
	},
	actions: {
		async openAddDriverPopup(context) {
			return await context.commit("openAddDriverPopup");
		},
		async closeAddDriverPopup(context) {
			return await context.commit("closeAddDriverPopup");
		},
		async addDriverToCatalog(context, payload) {
			let initID = Date.now().toString();
			// console.log(initID, payload.name);
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(initID)
				.set({
					json: JSON.stringify({
						driverID: initID,
						name: payload.name,
						tin: payload.tin,
						mainPosition: payload.position.toLowerCase(),
						carslist: [],
					}),
				});
		},
		async editDriverTin(context, payload) {
			// console.log(payload);
			let driver;
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(payload.driverID)
				.get()
				.then((doc) => (driver = JSON.parse(doc.data().json)))
				.catch((error) => {
					console.log("Error getting cached document:", error);
				});
			// console.log(driver);
			driver.tin = payload.tin;
			console.log(driver);
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(driver.driverID)
				.set({
					json: JSON.stringify({
						...driver,
					}),
				});
		},
		async addDriversCatalog({ getters }, payload) {
			let initID = Date.now();
			const positions = getters.getDriversPositions;
			payload.forEach((el) => {
				positions.forEach((position) => {
					initID += 1;
					db.collection("service/catalog/drivers").doc(initID.toString()).set({
						driverID: initID.toString(),
						name: el["ФИО сотрудника"],
						mainPosition: el["Должность"].toLowerCase(),
						position: position.toLowerCase(),
						carslist: [],
					});
				});
			});
		},

		compareDriversIn1CAndOsDB({ commit, getters }, payload) {
			// console.log(payload);
			const dataSource = payload.dataSource;
			console.log(dataSource);
			const osDriversCatalog = getters.getActualStates.catalogDrivers;
			const osDrivers = Array.from(osDriversCatalog)
				.filter((d) => d.carslist && d.carslist.length)
				.map((d) => ({ name: d.name, tin: d.tin }));
			const excelDrivers = Array.from(payload.excelDrivers).map((d) => ({
				name: d.name,
				tin: d.tin,
			}));
			const osTins = Array.from(osDriversCatalog)
				.filter((d) => d.carslist && d.carslist.length)
				.map((d) => d.tin);
			const excelTins = Array.from(payload.excelDrivers).map((d) => d.tin);
			// console.log(osTins)
			// console.log(excelTins)

			const extraFrom1C = [];
			const extraFromOS = [];
			if (dataSource === "1C7") {
				osTins.forEach((osTin) =>
					!excelTins.includes(osTin)
						? extraFromOS.push(osDrivers.filter((d) => d.tin === osTin)[0])
						: null
				);
			}

			excelTins.forEach((exTin) =>
				!osTins.includes(exTin)
					? extraFrom1C.push(excelDrivers.filter((d) => d.tin === exTin)[0])
					: null
			);
			// console.log(extraFromOS);
			// console.log(extraFrom1C);

			extraFromOS.sort((a, b) =>
				a.name > b.name ? 1 : b.name > a.name ? -1 : 0
			);
			extraFrom1C.sort((a, b) =>
				a.name > b.name ? 1 : b.name > a.name ? -1 : 0
			);
			// // console.log(extraFrom1C);
			switch (dataSource) {
				case "1C7":
					commit("setExtras1C7", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_A21":
					// console.log(`case 1C8_A21`);
					commit("setExtras1C_A21", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_AP":
					// console.log(`case 1C8_AP`);
					commit("setExtras1C_AP", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_DP":
					// console.log(`case 1C8_DP`);
					commit("setExtras1C_DP", {
						from1C: extraFrom1C,
					});
					break;
			}
		},

		async add1C7info({ commit, dispatch }, payload) {
			const info1C7 = payload.filter(
				(p) =>
					p["Официальная должность"] == p["Должность"] &&
					(p["Должность"] === "Водитель" ||
						p["Должность"] === "Экспедитор" ||
						p["Должность"] === "Водитель на своем  авто")
			);
			const finalInfo1C7 = [];
			info1C7.forEach((info) => {
				const dates = Object.keys(info).filter(
					(k) => k.length === 8 && k.includes(".") && info[k].trim()
				);
				const name = info["Фамилия Имя Отчество"];
				const position = info["Должность"];
				const tin = info["ИНН"];
				const finalInfo = { name, tin, position, dates };
				finalInfo1C7.push(finalInfo);
			});
			const pickedDate = finalInfo1C7[0].dates[0];
			dispatch("setPickedMonth", pickedDate);
			dispatch("compareDriversIn1CAndOsDB", {
				// osDrivers: drivers,
				excelDrivers: finalInfo1C7,
				dataSource: "1C7",
			});
			return await commit("add1C7info", finalInfo1C7);
		},

		setPickedMonth({ commit }, payload) {
			// console.log(`recieved payload is ${payload}`)
			const date = payload.split(".");
			const result = `20${date[2]}-${date[1]}-`;
			commit("setPickedMonth", result);
		},

		async add1C8info_A21({ dispatch, commit }, payload) {
			dispatch("compareDriversIn1CAndOsDB", {
				// osDrivers: drivers,
				excelDrivers: payload,
				dataSource: "1C8_A21",
			});
			return await commit(
				"add1C8info_A21",
				payload.filter((o) => Object.keys(o).length !== 3)
			);
		},

		async add1C8Shedule({ commit, dispatch, getters }, payload) {
			// get object with dates
			console.log(payload);
			const pickedDate = getters.getPickedMonth;
			const driversShedules = [];
			payload.data
				.filter((driver) => driver["Должность"].includes("-экспедитор"))
				.forEach((driver) => {
					const name = driver["Сотрудник"].trim();
					const tin = driver["ИНН"].trim();
					const [position, carNumber] = driver["Должность"]
						.split("/")
						.map((x) => x.trim());
					// console.log(name, tin, position, carNumber, driversShedules)
					// const dates = Object.keys(driver)
					// 	.filter((d) => d.split(" ").length == 2)
					// 	.map((dated) => {
					// 		const day = dated.split(" ")[0];
					// 		const date = new Date(pickedDate + day);
					// 		const [mark, val] =
					// 			driver[dated].split(" ").length == 2
					// 				? driver[dated].split(" ")
					// 				: [driver[dated].trim(), null];
					// 		return { date, mark, val };
					// 	});
					const shedule = {};
					Object.keys(driver)
						.filter((d) => d.split(" ").length == 2)
						.forEach((dated) => {
							const day = dated.split(" ")[0];
							const date = new Date(pickedDate + day).toLocaleDateString("ru-RU");
							const [mark, val] =
								driver[dated].split(" ").length == 2
									? driver[dated].split(" ")
									: [driver[dated].trim(), null];

							shedule[date] = { mark, val };
						});
					driversShedules.push({
						name,
						tin,
						position,
						carNumber,
						// dates,
            shedule
					});
				});
			console.log(driversShedules);
			///
			payload.company === "A21"
				? (commit("add1C8Shedule_A21", driversShedules),
				  dispatch("compareDriversIn1CAndOsDB", {
						excelDrivers: driversShedules,
						dataSource: "1C8_A21",
				  }))
				: payload.company === "AP"
				? (commit("add1C8Shedule_AP", driversShedules),
				  dispatch("compareDriversIn1CAndOsDB", {
						excelDrivers: driversShedules,
						dataSource: "1C8_AP",
				  }))
				: (commit("add1C8Shedule_DP", driversShedules),
				  dispatch("compareDriversIn1CAndOsDB", {
						excelDrivers: driversShedules,
						dataSource: "1C8_DP",
				  }));
		},
		async add1C8info_AP({ dispatch, commit }, payload) {
			dispatch("compareDriversIn1CAndOsDB", {
				// osDrivers: drivers,
				excelDrivers: payload,
				dataSource: "1C8_AP",
			});
			return await commit(
				"add1C8info_AP",
				payload.filter((o) => Object.keys(o).length !== 3)
			);
		},
		async add1C8info_DP({ dispatch, commit }, payload) {
			dispatch("compareDriversIn1CAndOsDB", {
				// osDrivers: drivers,
				excelDrivers: payload,
				dataSource: "1C8_DP",
			});
			return await commit(
				"add1C8info_DP",
				payload.filter((o) => Object.keys(o).length !== 3)
			);
		},
	},
	getters: {
		get1C7info: (state) => {
			return state.info1C7;
		},
		get1C8info_A21: (state) => {
			return state.info1C8_A21;
		},
		get1C8info_AP: (state) => {
			return state.info1C8_AP;
		},
		get1C8info_DP: (state) => {
			return state.info1C8_DP;
		},
		getExtraDriversFrom1C: (state) => {
			return state.extras;
		},
		getShedule1C8_A21: (state) => {
			return state.shedule1C8_A21;
		},
		getShedule1C8_AP: (state) => {
			return state.shedule1C8_AP;
		},
		getShedule1C8_DP: (state) => {
			return state.shedule1C8_DP;
		},
		getPickedMonth: (state) => {
			return state.pickedMonth;
		},

		// getAddDriverPopupVisibility: (state) => {
		// 	return state.addDriverPopupVisibility;
		// },
		// getPositionsDiffs: (state) => {
		// 	return state.positionsDiffs;
		// },
	},
};
