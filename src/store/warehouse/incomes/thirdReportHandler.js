export default {
  state: {
    thirdArray: null
  },
  mutations: {
    setThirdReportData(state, payload) {
      state.thirdArray = payload
    }
  },
  actions: {
    setThirdReportData({commit, getters}, payload) {
      const secondArray = Array.from(getters.getSecondArray);
      let currentMaterial;
      payload.forEach(el => {
        if (!el["Поставщик"]) {
          currentMaterial = el["Наименование"]
        } else {
          if (!secondArray.some(sec => sec.name === el["Поставщик"])) {
            secondArray.push({name: el["Поставщик"], materials: [{name: currentMaterial, quan: el["Количество"], sum: +el["Сумма"]}]})
          } else {
            secondArray.filter(s => s.name === el["Поставщик"])[0].materials.push({name: currentMaterial, quan: el["Количество"], sum: +el["Сумма"]})
          }
          // secondArray.filter(s => s.name === el["Поставщик"]).length > 0
          //   ? secondArray.filter(s => s.name === el["Поставщик"])[0].materials.push({name: currentMaterial, quan: el["Количество"], sum: el["Сумма"]})
          //   : secondArray.push({name: el["Поставщик"], materials: [{name: currentMaterial, quan: el["Количество"], sum: +el["Сумма"]}]})
        }
      })
      commit("setThirdReportData", secondArray)
      commit("manualsShowFalse")
    }
  },
  getters: {
    getThirdArray: state => {
      return state.thirdArray
    }
  }
}