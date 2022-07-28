import { update } from "vue-click-outside";
import { db } from "../../main.js";
export default {
	state: { carPopup: false, changeCarPopupData: null },
	mutations: {
		openCarPopup(state) {
			state.carPopup = true;
		},
		closeCarPopup(state) {
			state.carPopup = false;
		},
		changeCarData(state, payload) {
			state.changeCarPopupData = payload;
		},
		stopChangeCarData(state) {
			state.changeCarPopupData = null;
		},
	},
	actions: {
		async openCarPopup(context) {
			return await context.commit("openCarPopup");
		},
		async closeCarPopup(context) {
			return await context.commit("closeCarPopup");
		},
		async openChangeCarPopup(context, payload) {
			await context.commit("changeCarData", payload);
			await context.commit("openCarPopup");
		},
		async stopChangeCarData(context) {
			await context.commit("stopChangeCarData");
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
				driver.carslist = newCarslist
				// console.log(newCarslist);
				await db
					.collection("service/catalog/drivers_JSON")
					.doc(driver.driverID)
					// .update({ carslist: newCarslist });
					update({json: JSON.stringify(driver)})
			});
		},
	},
	getters: {
		getCarPopupVisibility: (state) => {
			return state.carPopup;
		},
		getCarChangeData: (state) => {
			return state.changeCarPopupData;
		},
	},
};
