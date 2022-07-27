import { db } from "../../main";
export default {
	state: {
		addDriverPopupVisibility: false,
		carPopup: false,
		changeCarPopupData: null,
		carCrewPopup: false,
		addPositionPopup: false,
		carIDForCrewPopup: null,
		driverNameForShedulePopup: null,
		shedulePopup: false,
		driverPopup: false,
		info1C7: null,
		info1C8_A21: null,
		info1C8_AP: null,
		info1C8_DP: null,
		positions: [
			"Водитель",
			"экспедитор",
			"Водитель на своем  авто",
			"ночной экспедитор",
			"д. экспедитор",
			"Рекламатор",
		],
	},
	mutations: {
		openCarPopup(state) {
			state.carPopup = true;
		},
		closeCarPopup(state) {
			state.carPopup = false;
		},
		openAddPositionPopup(state) {
			state.addPositionPopup = true;
		},
		closeAddPositionPopup(state) {
			state.addPositionPopup = false;
		},
		openCarCrewPopup(state, payload) {
			state.carIDForCrewPopup = payload;
			state.carCrewPopup = true;
		},
		closeCarCrewPopup(state) {
			state.carCrewPopup = false;
		},
		openShedulePopup(state, payload) {
			state.driverNameForShedulePopup = payload;
			state.shedulePopup = true;
		},
		closeShedulePopup(state) {
			state.shedulePopup = false;
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
		changeCarData(state, payload) {
			state.changeCarPopupData = payload;
		},
		stopChangeCarData(state) {
			state.changeCarPopupData = null;
		},
		openAddDriverPopup(state) {
			state.addDriverPopupVisibility = true;
		},
		closeAddDriverPopup(state) {
			state.addDriverPopupVisibility = false;
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
			// console.log(payload);
			let initID = Date.now().toString();
			// const positions = getters.getDriversPositions;
			// positions.forEach(async (position) => {
				// initID += 1;
				await db
					.collection("service/catalog/drivers")
					.doc(initID)
					.set({
						driverID: initID,
						name: payload.name,
						mainPosition: payload.position.toLowerCase(),
						// position: position,
						carslist: [],
					});
			// });
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
		async openShedulePopup(context, payload) {
			return await context.commit("openShedulePopup", payload);
		},
		async closeShedulePopup(context) {
			return await context.commit("closeShedulePopup");
		},
		async openCarPopup(context) {
			return await context.commit("openCarPopup");
		},
		async closeCarPopup(context) {
			return await context.commit("closeCarPopup");
		},
		async addCar(context, payload) {
			payload.carID = Date.now().toString();
			payload.crew = [];
			await db
				.collection("service/catalog/cars")
				.doc(payload.carID)
				.set(payload);
		},
		async saveCar({ getters }, payload) {
			console.log(payload);
			const drivers = getters.getActualStates.catalogDrivers;
			const cars = getters.getActualStates.catalogCars;
			const carID = payload.oldData.carID;
			const crew = payload.oldData.crew;
			const crewDetails = crew
				.map(
					(id) => drivers.filter((d) => d.driverID === id)[0]
					// .carslist.filter((car) => car.carID === carID)
				)
				.flat();
			const car = cars.filter((car) => car.carID === carID)[0];
			car.mark = payload.newData.mark ? payload.newData.mark : car.mark;
			car.number = payload.newData.number ? payload.newData.number : car.number;
			// console.log(car);
			await db
				.collection("service/catalog/cars")
				.doc(carID)
				.update({ mark: car.mark, number: car.number });
			crewDetails.forEach(async (driver) => {
				const newCarslist = driver.carslist;
				newCarslist.forEach((c) => {
					if (c.carID === carID) c.car = car.number;
				});
				// console.log(newCarslist);
				await db
					.collection("service/catalog/drivers")
					.doc(driver.driverID)
					.update({ carslist: newCarslist });
			});
		},
		async openChangeCarPopup(context, payload) {
			await context.commit("changeCarData", payload);
			await context.commit("openCarPopup");
		},
		async stopChangeCarData(context) {
			await context.commit("stopChangeCarData");
		},
		async openCarCrewPopup(context, payload) {
			return await context.commit("openCarCrewPopup", payload);
		},
		async closeCarCrewPopup(context) {
			return await context.commit("closeCarCrewPopup");
		},
		async updateCrewOrder(context, payload) {
			// console.log(payload);
			return await db
				.collection("service/catalog/cars")
				.doc(payload.carID)
				.update({ crew: payload.crewNewOrder });
		},
		async updateCarCrew(context, payload) {
			console.log(payload);
			const newCrew = payload.car.crew;
			// console.log(newCrew, typeof newCrew)
			// newCrew.push(payload.driver.driverID);
			newCrew.includes(payload.driver.driverID)
				? null
				: newCrew.push(payload.driver.driverID);
			const carslist = payload.driver.carslist;
			carslist.push({
				car: payload.car.number,
				carID: payload.car.carID,
				sheduleStart: null,
				sheduleType: null,
				sheduleShift: null,
			});
			await db
				.collection("service/catalog/cars")
				.doc(payload.car.carID)
				.update({ crew: newCrew });
			await db
				.collection("service/catalog/drivers")
				.doc(payload.driver.driverID)
				// .update({ carslist: carslist }).then(() => console.log("Список машин добавлен в объект водителя")).catch((error) => console.log(error));
				.set({ carslist: carslist }, { merge: true });
		},
		async removeDriverFromCar({ getters }, payload) {
			// console.log(`payload: `, payload);
			const drivers = getters.getActualStates.catalogDrivers;
			const driver = drivers.filter((d) => d.driverID === payload.driverID)[0];
			// console.log(`driver: `, driver)
			const carslist = driver.carslist;
			// console.log(`driver.carslist: `, driver.carslist)
			const newCarslist = carslist.filter((car) => car.carID !== payload.carID);
			// console.log(`newCarslist: `, newCarslist)
			const cars = getters.getActualStates.catalogCars;
			const car = cars.filter((car) => car.carID === payload.carID)[0];
			const crew = car.crew;
			const newCrew = crew.filter((cmID) => cmID !== payload.driverID);

			await db
				.collection("service/catalog/drivers")
				.doc(payload.driverID)
				.update({ carslist: newCarslist });

			await db
				.collection("service/catalog/cars")
				.doc(payload.carID)
				.update({ crew: newCrew });
		},
		async setShedule({ getters }, payload) {
			console.log("setShedule_payload:", payload);

			const driver = Array.from(getters.getActualStates.catalogDrivers).filter(
				(d) => d.driverID === payload.driverID.id
			)[0];

			const carslist = driver.carslist;
			carslist.forEach((car) => {
				if (car.car === payload.driverID.car) {
					car.sheduleType = payload.sheduleType;
					car.sheduleStart = payload.sheduleStart;
					car.sheduleShift = payload.sheduleShift;
				}
			});

			await db
				.collection("service/catalog/drivers")
				.doc(payload.driverID.id)
				.update({ carslist: carslist });
		},
		async add1C7info({ getters, commit }, payload) {
			const drivers = getters.getActualStates.catalogDrivers;
			const positions = getters.getDriversPositions;
			const info1C7 = payload
				.filter((f) => positions.includes(f["Должность"]))
				.map((item) => {
					let driverID;
					try {
						driverID = drivers.filter(
							(d) =>
								d.name === item.__EMPTY_1 &&
								d.position === item["Должность"].toLowerCase()
						)[0].driverID;
					} catch (error) {
						console.log(
							"no driverID: ",
							item.__EMPTY_1,
							" - ",
							item["Должность"]
						);
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
		getCarPopupVisibility: (state) => {
			return state.carPopup;
		},
		// getAddPositionPopupVisibility: (state) => {
		// 	return state.addPositionPopup;
		// },
		getCarCrewPopupVisibility: (state) => {
			return { show: state.carCrewPopup, id: state.carIDForCrewPopup };
		},
		getShedulePopupVisibility: (state) => {
			return {
				show: state.shedulePopup,
				name: state.driverNameForShedulePopup,
			};
		},
		getDriversPositions: (state) => {
			return state.positions;
		},
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
		getCarChangeData: (state) => {
			return state.changeCarPopupData;
		},
		getAddDriverPopupVisibility: (state) => {
			return state.addDriverPopupVisibility;
		},
	},
};
