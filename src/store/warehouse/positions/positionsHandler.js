export default {
  state: {
    positions: null,
  },
  mutations: {
    positionsHandler(state, payload) {
      state.positions = payload;
    }
  },
  actions: {
    async positionsHandler(context, payload) {
      const obj = {};
      // const arr = [];
      payload.forEach(row => {
        // const shop = row["ТЦ"];
        // const position = row["Доп.должность"];
        // if (arr.some(el => el.shop === shop)) {
        //   const c_shop = arr.filter(a => a.shop === shop)[0];
        //   c_shop.positions[position]
        //     ? c_shop.positions[position] += 1
        //     : c_shop.positions[position] = 1;
        // } else { 
        //   arr.push({
        //     shop: shop,
        //     positions: {position: 1}
        //   })
        // }
        if (obj[row["ТЦ"]]) {
          obj[row["ТЦ"]][row["Доп.должность"]] += 1;
        } else {
          obj[row["ТЦ"]] = {
            "Салон": row["ТЦ"],
            "Дизайнер-консультант": 0,
            "Старший Дизайнер-консультант": 0,
            "Менеджер салона": 0,
            "Ассистент дизайнера-консультанта": 0,
            "Дизайнер-консультант выходного дня": 0,
          };
          obj[row["ТЦ"]][row["Доп.должность"]] += 1;
        }
      });
      return await context.commit("positionsHandler", obj)
    }
  },
  getters: {
    getPositions: state => {
      return state.positions;
    }
  }
}