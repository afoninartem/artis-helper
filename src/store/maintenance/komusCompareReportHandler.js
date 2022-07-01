export default {
	state: { komusReportData: null, komusCompareActData: null },
	mutations: {
		setKomusReportData(state, payload) {
			state.komusReportData = payload;
		},
		setKomusCompareActData(state, payload) {
			state.komusCompareActData = payload;
		},
	},
	actions: {
		async setKomusCompareActData(context, payload) {
      const compareData = Array.from(payload).filter(d => d["Наименование документа"] === "Универсальный передаточный документ")
      const unitedData = {};
      compareData.forEach(item => {
        unitedData[item["№ заказа"]] ? unitedData[item["№ заказа"]] += item["Дебет"] : unitedData[item["№ заказа"]] = item["Дебет"]
      })
      const result = {};
      for (let i in unitedData) {
        const sum = unitedData[i];
        const order = i;
        result[sum] ? result[sum].push(order) : result[sum] = [order]
      }
    
      return await context.commit("setKomusCompareActData", result)
		},
		async setKomusReportData(context, payload) {
			const result = {
				deliveredSum: 0,
				canseledSum: 0,
				delivered: {},
				canseled: {},
        deliveredBySum: {}
			};
			Array.from(payload).forEach((item) => {
				const order = item["Номер заказа"];
				const sum = item["Сумма в руб."].split(",").join(".");
				if (item["Статус заказа"] !== "Отменен") {
					if (!result.delivered[order]) result.delivered[order] = 0;
					result.delivered[order] = (+result.delivered[order] + +sum).toFixed(
						2
					);
					result.deliveredSum = (+result.deliveredSum + +sum).toFixed(2);
				}
				if (item["Статус заказа"] === "Отменен") {
					if (!result.canseled[order]) result.canseled[order] = 0;
					result.canseled[order] = (+result.canseled[order] + +sum).toFixed(2);
					result.canseledSum = (+result.canseledSum + +sum).toFixed(2);
				}
			});
      const del = result.deliveredBySum;
      for (let i in result.delivered) {
        // console.log(i)
        // console.log(result.delivered[i])
        const order = i;
        const sum = +result.delivered[i]
        del[sum] ? del[sum].push(order) : del[sum] = [order]
        // result.deliveredBySum[result.delivered[i]] ? result.deliveredBySum[result.delivered[i]].push(result.delivered[i]) : result.deliveredBySum[result.delivered[i]] = []
      } 
			return await context.commit("setKomusReportData", result);
		},
	},
	getters: {
		getKomusReportData: (state) => {
			return state.komusReportData;
		},
		getKomusCompareActData: (state) => {
			return state.komusCompareActData;
		},
	},
};
