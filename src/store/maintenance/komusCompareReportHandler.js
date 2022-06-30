export default {
  state: {},
  mutations: {},
  actions: {
    async setKomusReportData(context, payload) {
      console.log(payload)
      //try to get it with array.reduce later
      const result = {};
      Array.from(payload).filter(item => item["Статус заказа"] !== "Отменен").forEach(item => {
        // console.log(Number(item["Сумма в руб."].split(",").join(".")))
        const order = item["Номер заказа"]
        const sum = +item["Сумма в руб."].split(",").join(".")
        console.log(sum)
        result[order] ? (result[order] += sum).toFixed(2) : result[order] = sum

      })
      console.log(result)
    }
  },
  getters: {}
}