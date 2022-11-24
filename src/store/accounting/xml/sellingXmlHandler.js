export default {
	state: {
		sellingData: null,
	},
	mutations: {
		setSellingData(state, payload) {
			state.sellingData = payload;
		},
	},
	actions: {
		setSellingData(context, payload) {
			const xml = payload.children[0].children[0].children;
			const data = Array.from(xml).map((x) => ({
				docNum: x.children[0].innerHTML,
				clientName: x.children[2].children[3].innerHTML,
				clientCode: x.children[2].children[0].innerHTML,
				date: x.children[1].innerHTML,
				summ: Array.from(x.children[3].children)
					.map((el) => el.attributes.amount.value)
					.reduce((a, b) => +a + +b, 0)
					.toFixed(2)
					.toString(),
			}));
			context.commit("setSellingData", data);
		},
	},
	getters: {
		getSellingData: (state) => {
			return state.sellingData;
		},
	},
};
