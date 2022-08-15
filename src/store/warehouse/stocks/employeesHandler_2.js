export default {
	state: { extra: null},
	mutations: {
    giftsHandler_2(state, payload) {
      state.extra = payload
    }
  },
	actions: {
		async giftsHandler_2(context, payload) {
			const extra = {};
			Array.from(payload)
				.filter((el) => el["ТЦ"]).filter(el => el["ТЦ"] !== " ")
				.forEach((employee) => {
          if (extra[employee["ТЦ"]]) {
            const currentShop = extra[employee["ТЦ"]];
            currentShop.allAdultGifts += 1;
            currentShop.papers += 2;
            currentShop.femaleGifts += employee["Пол"] === "Женский" ? 1 : 0;
            currentShop.maleGifts += employee["Пол"] === "Женский" ? 0 : 1;
            currentShop.kidsGifts += Number(employee["Дети до 14 лет"]);
          } else {
            extra[employee["ТЦ"]] = {
              allAdultGifts: 1,
              papers: 2,
              femaleGifts: employee["Пол"] === "Женский" ? 1 : 0,
              maleGifts: employee["Пол"] === "Женский" ? 0 : 1,
              kidsGifts: Number(employee["Дети до 14 лет"]),
            }
          }
        });
        // console.log(extra)
        return await context.commit("giftsHandler_2", extra)
		},
	},
	getters: {
    getExtraStockShipment: state => {
      return state.extra;
    }
  },
};
