import { db } from "../../main.js";
export default {
	state: {
		carIDForCrewPopup: null,
		carCrewPopup: false,
	},
	mutations: {
		openCarCrewPopup(state, payload) {
			state.carIDForCrewPopup = payload;
			state.carCrewPopup = true;
		},
		closeCarCrewPopup(state) {
			state.carCrewPopup = false;
		},
	},
	actions: {
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
	},
	getters: {
		getCarCrewPopupVisibility: (state) => {
			return { show: state.carCrewPopup, id: state.carIDForCrewPopup };
		},
	},
};
