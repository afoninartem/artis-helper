import { db } from "../../main.js";
export default {
	state: {
		shedulePopup: false,
		shedulePopupDriverID: null,
	},
	mutations: {
		openShedulePopup(state, payload) {
			state.shedulePopup = true;
			state.shedulePopupDriverID = payload;
		},
		closeShedulePopup(state) {
			state.shedulePopup = false;
			state.shedulePopupDriverID = null;
		},
	},
	actions: {
		async openShedulePopup(context, payload) {
			return await context.commit("openShedulePopup", payload);
		},
		async closeShedulePopup(context) {
			return await context.commit("closeShedulePopup");
		},
		async setShedule({ getters }, payload) {
			console.log("setShedule_payload:", payload);

			const driver = Array.from(getters.getActualStates.catalogDrivers).filter(
				(d) => d.driverID === payload.driverID
			)[0];

			const carslist = driver.carslist;
			carslist.forEach((car) => {
				if (car.car === payload.carNum) {
					car.sheduleType = payload.sheduleType;
					car.sheduleStart = payload.sheduleStart;
					car.sheduleShift = payload.sheduleShift;
				}
			});
      driver.carslist = carslist;
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(payload.driverID)
				.update({ json: JSON.stringify(driver) });
		},
	},
	getters: {
		getShedulePopupVisibility: (state) => {
			return {
				show: state.shedulePopup,
				driverID: state.shedulePopupDriverID,
			};
		},
	},
};
