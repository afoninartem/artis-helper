export default {
	state: {
		incomeArray: null,
		directoryArray: null,
	},
	mutations: {
		setArrays(state, payload) {
			state.incomeArray = payload.incomeArray;
			state.directoryArray = payload.directoryArray;
		},
	},
	actions: {
		komusHandler(context, payload) {
			const incomeArray = [];
			const directoryArray = [];
			payload.forEach((row) => {
				if (
					row["% НДС"] &&
					row["Артикул"] &&
					row["Коли-\nчество"] &&
					row["Цена с НДС\nРУБ"] &&
					row["Сумма с НДС\nРУБ"]
				) {
          // console.log(typeof row["% НДС"])
					incomeArray.push({
						НДС: row["% НДС"],
						КОД_ВЫГРУЗКИ: `${row["Артикул"]}.0ЕР`,
						КОЛИЧЕСТВО: row["Коли-\nчество"],
						ЦЕНА_С_НДС: row["Цена с НДС\nРУБ"],
						СУММА_С_НДС: +row["Сумма с НДС\nРУБ"].split("").map(s => s.replace(/\s+/g, "")).join("").trim().replace(/,/g, ".")
					});
					directoryArray.push({
						Артикул: row["Артикул"],
						Наименование: row["Наименование товара"],
						Единица_измерения: row["Ед.\nизм."],
						Цена: row["Цена с НДС\nРУБ"],
					});
				}
			});

			context.commit("setArrays", { incomeArray, directoryArray });
		},
	},
	getters: {
		getKomusArrays: (state) => {
			return { incs: state.incomeArray, dicts: state.directoryArray };
		},
	},
};
