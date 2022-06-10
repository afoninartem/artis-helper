export default {
	state: {
		extraAdded: false,
		showExtraTable: false,
		extraSummary: {
			moscow: {
				allAdultGifts: 0,
				maleGifts: 0,
				femaleGifts: 0,
				kidsGifts: 0,
				papers: 0,
			},
			other: {
				allAdultGifts: 0,
				maleGifts: 0,
				femaleGifts: 0,
				kidsGifts: 0,
				papers: 0,
			},
		},

	},
  mutations: {
    updateReportArray(state, payload) {
      // console.log(payload.result)
      const summary = {
        moscow: {
          allAdultGifts: 0,
          maleGifts: 0,
          femaleGifts: 0,
          kidsGifts: 0,
          papers: 0,
        },
        other: {
          allAdultGifts: 0,
          maleGifts: 0,
          femaleGifts: 0,
          kidsGifts: 0,
          papers: 0,
        },
      };
     Array.from(payload.reportArray).forEach((report) => {
        const extras = payload.result.filter((el) => el.shop === report.shop)[0];
        if (extras) {
          summary[report.region].allAdultGifts += extras.allAdultGifts;
          summary[report.region].maleGifts += extras.maleGifts;
          summary[report.region].femaleGifts += extras.femaleGifts;
          summary[report.region].kidsGifts += extras.kidsGifts;
          summary[report.region].papers += extras.papers;
          report.employeeList = extras.employeeList;
          report.shipment.allAdultGifts = extras.allAdultGifts;
          report.shipment.maleGifts = extras.maleGifts;
          report.shipment.femaleGifts = extras.femaleGifts;
          report.shipment.kidsGifts = extras.kidsGifts;
          report.shipment.papers = extras.papers;
        }
      });
      state.extraSummary = summary;
      state.showExtraTable = true;
      state.extraAdded = true;
    },
  },
  actions: {
    async giftsAndPapersHandler({commit, getters}, payload) {
      const shops = JSON.parse(localStorage.getItem("actualShops"));
      const reportArray = getters.getReportsData
      const result = [];
      payload
        .filter((el) => el["ТЦ"])
        .forEach((employee) => {
          if (result.some((el) => el.shop === employee["ТЦ"])) {
            const currentShop = result.filter(
              (el) => el.shop === employee["ТЦ"]
            )[0];
            currentShop.allAdultGifts += 1;
            currentShop.papers += 2;
            currentShop.femaleGifts += employee["Пол"] === "Женский" ? 1 : 0;
            currentShop.maleGifts += employee["Пол"] === "Женский" ? 0 : 1;
            currentShop.kidsGifts += Number(employee["Дети до 14 лет"]);
            currentShop.employeeList.push({
              name: employee["ФИО сотрудника"],
              kids: Number(employee["Дети до 14 лет"]),
            });
          } else {
            result.push({
              shop: employee["ТЦ"],
              allAdultGifts: 1,
              papers: 2,
              femaleGifts: employee["Пол"] === "Женский" ? 1 : 0,
              maleGifts: employee["Пол"] === "Женский" ? 0 : 1,
              kidsGifts: Number(employee["Дети до 14 лет"]),
              employeeList: [
                {
                  name: employee["ФИО сотрудника"],
                  kids: Number(employee["Дети до 14 лет"]),
                },
              ],
            });
          }
        });
      result.forEach((el) => {
        if (el.shop.trim()) {
          el.region = shops.filter((shop) => shop.name === el.shop)[0].region;
        }
      });
     commit("updateReportArray", {result, reportArray});
    },
  },
  getters: {
    getShowExtraTable: (state) => {
      return state.showExtraTable;
    },
    getExtraAdded: (state) => {
      return state.extraAdded;
    },
    getExtraSummary: (state) => {
      return state.extraSummary
    }
  }
};
