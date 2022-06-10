export default {
	state: {
		firstArray: null,
	},
	mutations: {
		setFirstReportData(state, payload) {
			state.firstArray = payload;
		},
	},
	actions: {
		setFirstReportData(context, payload) {
			// console.log(payload);
			// const result = {}
			const result = [];
			payload.forEach((el, i) => {
				if (el["Наименование"] !== "Итого") {
					if (
						!payload[i + 1]["Наименование"].match(/\d\d\.\d\d.\d\d\d\d/g) &&
						!el["Наименование"].match(/\d\d\.\d\d.\d\d\d\d/g)
					) {
						//  result[el["Наименование"]] ? alert(`${el["Наименование"]} уже записан в объект`) : result[el["Наименование"]] = [];
						result.push({ name: el["Наименование"], materials: [] });
					} else if (
						payload[i + 1]["Наименование"].match(/\d\d\.\d\d.\d\d\d\d/g) &&
						!el["Наименование"].match(/\d\d\.\d\d.\d\d\d\d/g)
					) {
						result[result.length - 1].materials.push({
							name: el["Наименование"],
							quan: el["Количество"],
              sum: 0
						});
					}
				}
			});
			context.commit("setFirstReportData", result);
		},
	},
	getters: {
		getFirstArray: (state) => {
			return state.firstArray;
		},
	},
};
