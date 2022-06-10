export default {
	state: {
		onlineShopData: null,
		onlineShopFiltered: null,
		onlineShopResultData: null,
		onlineShopResultVisibility: false,
		onlineShopTaxcomVisibility: false,
	},
	mutations: {
		setOnlineShopData(state, payload) {
			state.onlineShopData = payload;
		},
		setOnlineShopFiltered(state, payload) {
			state.onlineShopFiltered = payload;
		},
		setOnlineShopResultData(state, payload) {
			state.onlineShopResultData = payload;
		},
		toggleOnlineShopResultVisibility(state) {
			state.onlineShopResultVisibility = !state.onlineShopResultVisibility;
		},
		toggleOnlineShopTaxcomVisibility(state) {
			state.onlineShopTaxcomVisibility = !state.onlineShopTaxcomVisibility;
		},
	},
	actions: {
		async setOnlineShopData(context, payload) {
			const arr = payload.filter(
				(el) => el["Статус транзакции "] === "Успешно"
			);
			return await context.commit("setOnlineShopData", arr);
		},
		async setOnlineShopFiltered(context, payload) {
			return await context.commit("setOnlineShopFiltered", payload);
		},
		async setOnlineShopResultData(context, payload) {
			return await context.commit("setOnlineShopResultData", payload);
		},
		async toggleOnlineShopResultVisibility(context) {
			return await context.commit("toggleOnlineShopResultVisibility");
		},
		async toggleOnlineShopTaxcomVisibility(context) {
			return await context.commit("toggleOnlineShopTaxcomVisibility");
		},
	},
	getters: {
		getOnlineShopData: (state) => {
			return state.onlineShopData;
		},
		getOnlineShopFiltered: (state) => {
			return state.onlineShopFiltered;
		},
		getOnlineShopResultData: (state) => {
			return state.onlineShopResultData;
		},
		getOnlineShopResultVisibility: (state) => {
			return state.onlineShopResultVisibility;
		},
		getOnlineShopTaxcomVisibility: (state) => {
			return state.onlineShopTaxcomVisibility;
		},
	},
};
