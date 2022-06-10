export default {
	state: {
		secondArray: null,
	},
	mutations: {
		setSecondReportData(state, payload) {
			state.secondArray = payload;
		},
	},
	actions: {
		setSecondReportData({ commit, getters }, payload) {
			// console.log(payload);
			const temp = Array.from(getters.getFirstArray);
      // console.log(temp)
			let currentMaterial;
			Array.from(payload).forEach((el) => {
        if (el["Наименование"].includes("%Для учёта остатков")) return
        console.log(el)
				if (el["Поставщик"]) {
					try {
						if (temp.filter((t) => t.name === el["Поставщик"])) {
							temp
								.filter((t) => t.name === el["Поставщик"])[0]
								.materials.filter(
									(m) => m.name === currentMaterial
								)[0].sum += +el["Сумма"];
						} else {
							console.log(el["Поставщик"]);
						}
					} catch (error) {
						console.log(error);
					}
				} else {
					currentMaterial = el["Наименование"];
				}
			});
			commit("setSecondReportData", temp);
		},
	},
	getters: {
		getSecondArray: (state) => {
			return state.secondArray;
		},
	},
};
