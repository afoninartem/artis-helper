import { db } from "../../main";
export default {
	state: {
		info1C7: null,
		info1C8_A21: null,
		info1C8_AP: null,
		info1C8_DP: null,
		extras: {
			// fromOS: [],
			from1C7: null,
			from1C8_A21: null,
			from1C8_AP: null,
			from1C8_DP: null,
		},
	},
	mutations: {
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
			console.log(payload);
			state.extras.from1C7 = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_A21(state, payload) {
			console.log(payload);
			state.extras.from1C8_A21 = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_AP(state, payload) {
			console.log(payload);
			state.extras.from1C8_AP = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
		},
		setExtras1C_DP(state, payload) {
			console.log(payload);
			state.extras.from1C8_DP = payload.from1C;
			// state.extras.fromOS = state.extras.fromOS.concat(payload.fromOS);
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
			console.log(initID, payload.name);
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(initID)
				.set({
					json: JSON.stringify({
						driverID: initID,
						name: payload.name,
						mainPosition: payload.position.toLowerCase(),
						carslist: [],
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

		compareDriversIn1CAndOsDB({ getters, commit }, payload) {
			const dataSource = payload.dataSource;
			const osDrivers = getters.getActualStates.catalogDrivers.map((os) =>
				os.name.split("  ").join(" ").toLowerCase()
			);
			const excelDrivers = Array.from(
				new Set(
					payload.excelDrivers.map((ex) => {
						if (ex.name) {
							return ex.name.split("  ").join(" ").toLowerCase();
						}
						return ex["Сотрудник"]
							.split("  ")
							.join(" ")
							.toLowerCase()
							.split(" ")
							.slice(0, 3)
							.join(" ");
					})
				)
			);
			const extraFrom1C = [],
				extraFromOS = [];
			// check os
			osDrivers.forEach((os) => {
				if (!excelDrivers.filter((x) => x === os).length) extraFromOS.push(os);
			});
			// check excel
			excelDrivers.forEach((ex) => {
				if (!osDrivers.filter((x) => x === ex).length) extraFrom1C.push(ex);
			});

			extraFromOS.sort();
			extraFrom1C.sort();

			switch (dataSource) {
				case "1C7":
					commit("setExtras1C7", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_A21":
					commit("setExtras1C_A21", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_AP":
					commit("setExtras1C_AP", {
						from1C: extraFrom1C,
					});
					break;
				case "1C8_DP":
					commit("setExtras1C_DP", {
						from1C: extraFrom1C,
					});
					break;
			}
		},

		async add1C7info({ getters, commit, dispatch }, payload) {
			const drivers = getters.getActualStates.catalogDrivers;
			const positions = getters.getDriversPositions.map((p) =>
				p.split("  ").join(" ").toLowerCase()
			);
			const info1C7 = payload
				.filter((f) =>
					positions.includes(f["Должность"].split("  ").join(" ").toLowerCase())
				)
				.map((item) => {
					let driverID;
					try {
						driverID = drivers.filter(
							(d) =>
								d.name.split("  ").join(" ").toLowerCase() ===
									item.__EMPTY_1.split("  ").join(" ").toLowerCase() &&
								d.mainPosition.split("  ").join(" ").toLowerCase() ===
									item["Должность"].split("  ").join(" ").toLowerCase()
						)[0].driverID;
					} catch (error) {
						console.log(
							"no driverID: ",
							item.__EMPTY_1,
							" - ",
							item["Должность"]
						);
						console.log(item);
					}
					const workDays = Object.keys(item)
						.filter((i) => i !== "Должность" && !i.includes("__EMPTY"))
						.filter((i) => item[i].trim());
					return {
						name: item.__EMPTY_1,
						position: item["Должность"],
						workDays: workDays,
						driverID: driverID,
					};
				});
			// console.log(info1C7)
			dispatch("compareDriversIn1CAndOsDB", {
				// osDrivers: drivers,
				excelDrivers: info1C7,
				dataSource: "1C7",
			});
			return await commit("add1C7info", info1C7);
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
		// getAddPositionPopupVisibility: (state) => {
		// 	return state.addPositionPopup;
		// },

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

		// getAddDriverPopupVisibility: (state) => {
		// 	return state.addDriverPopupVisibility;
		// },
	},
};
