export default {
	state: {
		// orders: null,
		// actualOrdersLoaded: null,
		added: {
			regular: [],
			spbnn: [],
		},
		deleted: {
			regular: [],
			spbnn: [],
		},
	},
	mutations: {
		checkOrders(state, payload) {
			state.actualOrdersLoaded = localStorage.getItem("actualOrdersLoaded")
				? +JSON.parse(localStorage.getItem("actualOrdersLoaded"))
				: false;
			if (payload.dayOfMonth === state.actualOrdersLoaded) {
				const lastOrders = JSON.parse(localStorage.getItem("actualOrders"));
				// console.log(lastOrders, payload);
        // console.log(payload.shipmentDate)
				const cuttedShipmentDate = +payload.shipmentDate.slice(0, 2);
				// console.log(cuttedShipmentDate, payload.dayOfMonth);
				if (cuttedShipmentDate === payload.dayOfMonth) {
					payload.spbnn.forEach((order) => {
						!lastOrders.spbnn.some((o) => o === order)
							? state.added.spbnn.push(order)
							: null;
					});
					lastOrders.spbnn.forEach((order) => {
						!payload.spbnn.some((o) => o === order)
							? state.deleted.spbnn.push(order)
							: null;
					});
					localStorage.setItem("actualOrders", JSON.stringify(payload));
				} else {
					payload.regular.forEach((order) => {
						!lastOrders.regular.some((o) => o === order)
							? state.added.regular.push(order)
							: null;
					});
					lastOrders.regular.forEach((order) => {
						!payload.regular.some((o) => o === order)
							? state.deleted.regular.push(order)
							: null;
					});
					localStorage.setItem("actualOrders", JSON.stringify(payload));
				}
			} else {
				localStorage.setItem(
					"actualOrdersLoaded",
					JSON.stringify(payload.dayOfMonth)
				);
				// localStorage.removeItem("actualOrders");
				localStorage.setItem("actualOrders", JSON.stringify(payload));
				state.orders = payload;
			}
		},
	},
	actions: {
		async checkOrders(context, payload) {
			return await context.commit("checkOrders", payload);
		},
	},
	getters: {
		getChanges: (state) => {
			return {
				regular: {
					added: state.added.regular,
					deleted: state.deleted.regular,
				},
				spbnn: {
					added: state.added.spbnn,
					deleted: state.deleted.spbnn,
				},
			};
		},
	},
};
