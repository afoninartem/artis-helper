import { db } from "../../main";
export default {
	state: {
		positions: [
			"Водитель",
			"экспедитор",
			"Водитель на своем  авто",
			"ночной экспедитор",
			"д. экспедитор",
			"Рекламатор",
		],

		driverNameForShedulePopup: null,
		shedulePopup: false,
		driverPopup: false,
		addDriverPopupVisibility: false,

	},
	mutations: {

		openShedulePopup(state, payload) {
			state.driverNameForShedulePopup = payload;
			state.shedulePopup = true;
		},
		closeShedulePopup(state) {
			state.shedulePopup = false;
		},

		openAddDriverPopup(state) {
			state.addDriverPopupVisibility = true;
		},
		closeAddDriverPopup(state) {
			state.addDriverPopupVisibility = false;
		},
	},
	actions: {
		async addCar(context, payload) {
			payload.carID = Date.now().toString();
			payload.crew = [];
			await db
				.collection("service/catalog/cars")
				.doc(payload.carID)
				.set(payload);
		},
	},
	getters: {
		getDriversPositions: (state) => {
			return state.positions;
		},
	},
};
