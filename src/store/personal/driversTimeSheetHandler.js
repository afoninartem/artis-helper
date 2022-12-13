import { db } from "../../main";
export default {
	state: {
		// addPositionPopup: false,

		info1C7: null,
		info1C8_A21: null,
		info1C8_AP: null,
		info1C8_DP: null,
	},
	mutations: {
		// openCarPopup(state) {
		// 	state.carPopup = true;
		// },
		// closeCarPopup(state) {
		// 	state.carPopup = false;
		// },
		// openAddPositionPopup(state) {
		// 	state.addPositionPopup = true;
		// },
		// closeAddPositionPopup(state) {
		// 	state.addPositionPopup = false;
		// },
		// openCarCrewPopup(state, payload) {
		// 	state.carIDForCrewPopup = payload;
		// 	state.carCrewPopup = true;
		// },
		// closeCarCrewPopup(state) {
		// 	state.carCrewPopup = false;
		// },
		// openShedulePopup(state, payload) {
		// 	state.driverNameForShedulePopup = payload;
		// 	state.shedulePopup = true;
		// },
		// closeShedulePopup(state) {
		// 	state.shedulePopup = false;
		// },
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
		// changeCarData(state, payload) {
		// 	state.changeCarPopupData = payload;
		// },
		// stopChangeCarData(state) {
		// 	state.changeCarPopupData = null;
		// },
		// openAddDriverPopup(state) {
		// 	state.addDriverPopupVisibility = true;
		// },
		// closeAddDriverPopup(state) {
		// 	state.addDriverPopupVisibility = false;
		// },
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
		// async openAddPositionPopup(context) {
		// 	return await context.commit("openAddPositionPopup");
		// },
		// async closeAddPositionPopup(context) {
		// 	return await context.commit("closeAddPositionPopup");
		// },
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

		async add1C7info({ getters, commit }, payload) {
			const drivers = getters.getActualStates.catalogDrivers;
			console.log(
				drivers.map((d) => ({
					name: d.name,
					mainPosition: d.mainPosition,
					ID: d.driverID,
				}))
			);
			const positions = getters.getDriversPositions;
			const info1C7 = payload
				.filter((f) => positions.includes(f["Должность"].split("  ").join(" ").toLowerCase()))
				.map((item) => {
					let driverID;
					try {
						driverID = drivers.filter(
							(d) =>
								d.name.split("  ").join(" ").toLowerCase() === item.__EMPTY_1.split("  ").join(" ").toLowerCase() &&
								d.mainPosition.split("  ").join(" ").toLowerCase() === item["Должность"].split("  ").join(" ").toLowerCase()
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
			return await commit("add1C7info", info1C7);
		},
		async add1C8info_A21(context, payload) {
			return await context.commit(
				"add1C8info_A21",
				payload.filter((o) => Object.keys(o).length !== 3)
			);
		},
		async add1C8info_AP(context, payload) {
			return await context.commit(
				"add1C8info_AP",
				payload.filter((o) => Object.keys(o).length !== 3)
			);
		},
		async add1C8info_DP(context, payload) {
			return await context.commit(
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

		// getAddDriverPopupVisibility: (state) => {
		// 	return state.addDriverPopupVisibility;
		// },
	},
};
