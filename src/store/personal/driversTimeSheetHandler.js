import { db } from "../../main";
export default {
	state: {
		carPopup: false,
		carCrewPopup: false,
		carIDForCrewPopup: null,
		driverNameForShedulePopup: null,
		shedulePopup: false,
		driverPopup: false,
		info1C7: null,
	},
	mutations: {
		openCarPopup(state) {
			state.carPopup = true;
		},
		closeCarPopup(state) {
			state.carPopup = false;
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
	},
	actions: {
		async addDriversCatalog(context, payload) {
			let initID = Date.now();
			payload.forEach((el) => {
				initID += 1;
				db.collection("service/catalog/drivers")
					.doc(initID.toString())
					.set({
						driverID: initID.toString(),
						name: el.__EMPTY_1,
						position: el["Должность"],
						carslist: [],
					});
			});
		},
		async migrate(context, payload) {
			payload.forEach((item) => {
				db.collection("service/collections/drivers")
					.doc(item.id.toString())
					.set(item);
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
		async openCarCrewPopup(context, payload) {
			return await context.commit("openCarCrewPopup", payload);
		},
		async closeCarCrewPopup(context) {
			return await context.commit("closeCarCrewPopup");
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
			console.log(payload);
			const drivers = getters.getActualStates.catalogDrivers;
			const driver = drivers.filter(d => d.driverID === payload.driverID)[0];
			const carslist = driver.carslist;
			const newCarslist = carslist.filter((car) => car.carID !== payload.carID);
			await db
				.collection("service/catalog/drivers")
				.doc(payload.driverID)
				.update({ carslist: newCarslist });
			const cars = getters.getActualStates.catalogCars;
			const car = cars.filter((car) => car.carID === payload.carID)[0];
			const crew = car.crew;
			const newCrew = crew.filter((cmID) => cmID !== payload.driverID);
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
		async add1C7info({getters, commit}, payload) {
      const drivers = getters.getActualStates.catalogDrivers;
			const info1C7 = payload.map((item) => {
        // console.log(drivers.filter(d => d.name === item.__EMPTY_1 && d.position === item["Должность"])[0].name, item)
        const driverID = drivers.filter(d => d.name === item.__EMPTY_1 && d.position === item["Должность"])[0].driverID
				const workDays = Object.keys(item)
					.filter((i) => i !== "Должность" && !i.includes("__EMPTY"))
					.filter((i) => !item[i].trim());
				return {
					name: item.__EMPTY_1,
					position: item["Должность"],
					workDays: workDays,
          driverID: driverID,
				};
			});
			// console.log(info1C7);

			return await commit("add1C7info", info1C7);
		},
		// async updateCarsLists(context, payload) {
		//   console.log(payload)
		//   await db.collection("service/collections/drivers").doc(payload.id).update({
		//     id: payload.id,
		//     carslist: payload.carslist
		//   })
		// }
	},
	getters: {
		getCarPopupVisibility: (state) => {
			return state.carPopup;
		},
		getCarCrewPopupVisibility: (state) => {
			return { show: state.carCrewPopup, id: state.carIDForCrewPopup };
		},
		getShedulePopupVisibility: (state) => {
			return {
				show: state.shedulePopup,
				name: state.driverNameForShedulePopup,
			};
		},
		get1C7info: (state) => {
			return state.info1C7;
		},
	},
};
