import { db } from "../../main";

export default {
	state: {
		show: false,
		driver: null,
		days: null,
		carID: null,
	},
	mutations: {
		openDriverExtraPopup(state, payload) {
			state.show = true;
			state.driver = payload.driver;
			state.days = payload.days;
			state.carID = payload.carID;
		},
		closeDriverExtraPopup(state) {
			state.show = false;
			state.driver = null;
			state.day = null;
			state.carID = null;
		},
	},
	actions: {
		async openDriverExtraPopup(context, payload) {
			console.log(payload)
			return await context.commit("openDriverExtraPopup", payload);
		},
		async closeDriverExtraPopup(context) {
			return await context.commit("closeDriverExtraPopup");
		},
		async updateExtras({ getters }, payload) {
			console.log(`payload from ExtraJS: `, payload);
			const driver0 = getters.getActualStates.catalogDrivers.filter(
				(d) => d.driverID === payload.driverID
			)[0];
			const driver = { ...driver0 }; 
			driver.extras
				? Array.from(payload.days).forEach((day) => {
						driver.extras.map((e) => e.day).includes(day.day)
							? driver.extras.splice(
									driver.extras.map((e) => e.day).indexOf(day.day),
									1,
									day
							  )
							: driver.extras.push(day);
				  })
				: (driver.extras = payload.days);
			const extras = driver.extras.filter((e) => e.cut.length > 0);
			// console.log(extras);
			driver.extras = extras;
			driver.carslist.forEach((cl) => {
				delete cl.extras;
				delete cl.todayExtra;
			});
			await db
				.collection("service/catalog/drivers_JSON")
				.doc(driver.driverID)
				// .update({ extras: extras });
				.update({ json: JSON.stringify(driver) });
		},
	},
	getters: {
		getDriverExtraPopupVisibility: (state) => {
			return state.show;
		},
		getDriverExtraPopupDetails: (state) => {
			return { driver: state.driver, days: state.days, carID: state.carID };
		},
	},
};
