export default {
  state: {
    rawShipment: null,
    shopsDB: [],
    colorsDB: [],
    shipment: null,
    overrun: [],
    packages: null,
    invalidQuans: [],
    shipmentDate: null,
    timeStartWork: null,
    todayDate: null,
    towels: false,
    //sorted by regions:
    regularShipment: null,
    spbShipment: null,
    nnShipment: null,
    spbnnShipment: null,
    //numbers of shops and orders for info
    numberOfRegularShops: null,
    numberOfRegularOrders: null,
    numberOfSpbShops: null,
    numberOfSpbOrders: null,
    numberOfNnShops: null,
    numberOfNnOrders: null,
    numberOfSpbNnShops: null,
    numberOfSpbNnOrders: null,
    //switcher for tables
    tableSwitcher: [
      { region: "msc", active: false },
      { region: "spb", active: false },
      { region: "nn", active: false },
      { region: "spbnn", active: false },
    ],
    //page divider
    currentTableRowToRender: null,
  },
  mutations: {
    setcurrentTableRowToRender(state, payload) {
      state.currentTableRowToRender = payload;
    },
    addShipment(state, payload) {
      state.rawShipment = payload;
    },
    switchTable(state, payload) {
      state.tableSwitcher.forEach((table) => {
        table.region === payload
          ? (table.active = true)
          : (table.active = false);
      });
    },
    setPackages(state, payload) {
      state.packages = payload;
    },
    shipmentSettings(state, payload) {
      state.overrun = payload.overrun;
      state.shipmentDate = payload.shipmentDate;
      state.invalidQuans = payload.invalidQuans;
      state.shipment = payload.handledShipment;
      state.towels = payload.isThereAnyTowels;
      state.regularShipment = payload.regularShipment;
      state.numberOfRegularShops = payload.numberOfRegularShops;
      state.numberOfRegularOrders = payload.numberOfRegularOrders;
      state.spbShipment = payload.spbShipment;
      state.numberOfSpbShops = payload.numberOfSpbShops;
      state.numberOfSpbOrders = payload.numberOfSpbOrders;
      state.nnShipment = payload.nnShipment;
      state.numberOfNnShops = payload.numberOfNnShops;
      state.numberOfNnOrders = payload.numberOfNnOrders;
      state.spbnnShipment = payload.spbnnShipment;
      state.numberOfSpbNnShops = payload.numberOfSpbNnShops;
      state.numberOfSpbNnOrders = payload.numberOfSpbNnOrders;
    },
    setShopsAndColors(state, payload) {
      state.shopsDB = payload.shops;
      state.colorsDB = payload.colors;
    },
    setTableInfoDataIntoState(state, payload) {
      (state.timeStartWork = payload.time), (state.todayDate = payload.today);
    },
  },
  actions: {
    async setcurrentTableRowToRender(context, payload) {
      return await context.commit("setcurrentTableRowToRender", payload);
    },
    async addShipment(context, payload) {
      return await context.commit("addShipment", payload);
    },
    async switchTable(context, payload) {
      return await context.commit("switchTable", payload);
    },
    // async filterShipmentsByTerms(context, payload) {
    //   return await context.commit("filterShipmentsByTerms", payload);
    // },
    async setPackages(context, payload) {
      return await context.commit("setPackages", payload);
    },
    async setShopsAndColors(context, payload) {
      return await context.commit("setShopsAndColors", payload);
    },
    async shipmentSettings(context, payload) {
      return await context.commit("shipmentSettings", payload);
    },
    async shipmentHandler({ dispatch, getters }) {
      let numberOfRegularOrders = 0;
      let numberOfRegularShops = 0;
      let numberOfSpbShops = 0;
      let numberOfSpbOrders = 0;
      let numberOfNnShops = 0;
      let numberOfNnOrders = 0;
      let numberOfSpbNnShops = 0;
      let numberOfSpbNnOrders = 0;
      const shopsAndColors = getters.getShopsAndColors;
      const shopsDB = shopsAndColors.shops;
      const colorsDB = shopsAndColors.colors;
      const packages = shopsAndColors.packages;
      const carslist = [];
      const materialsSummary = {};
      let shipmentDate = null;
      const dataName = "Машина/Салон/Документ/Материал";
      const dataQuan = "Количество";
      const data = getters.getRawShipment;
      Array.from(data).forEach((row, i) => {
        const name = row[dataName].split("  ").join(" ");
        const quan = row[dataQuan];
        const prevName = data[i - 1] ? data[i - 1][dataName].split("  ").join(" ") : null;
        const prevQuan = data[i - 1] ? data[i - 1][dataQuan] : null;
        const nextQuan = data[i + 1] ? data[i + 1][dataQuan] : null;
        //date of shipment ↓
        if (name.includes("Анализ за период")) {
          shipmentDate = quan;
        }
        //looking for cars ↓
        console.log(shopsDB.some(el => el.name === name), name)
        if (!quan && !nextQuan && prevQuan && !shopsDB.some(el => el.name === name)) {
          carslist.push({
            name: name.trim(),
            shopslist: [],
            carBG: "#FFFFFF",
            textColor: "#000000",
            region: null,
          });
        }
        //looking for shops ↓
          if (shopsDB.map(el => el.name).includes(name)) {
          carslist[carslist.length - 1].shopslist.push({
            name: name.split("  ").join(" "),
            materials: [],
            orders: [],
            region: null,
          });
        }
        //looking for orders ↓
        if (name.includes("Рекламация")) {
          const lastCar = carslist[carslist.length - 1];
          // console.log("carsList", carslist)
          // console.log("lastCar", lastCar)
          const allShops = lastCar.shopslist;
          // console.log(allShops)
          const lastShop = allShops[allShops.length - 1];
          lastShop.orders.push({ name, comment: null });
        }
        //looking for comments ↓
        if (
          !name.includes("Рекламация") &&
          !quan &&
          prevName.includes("Рекламация")
        ) {
          const lastCar = carslist[carslist.length - 1];
          const allShops = lastCar.shopslist;
          const lastShop = allShops[allShops.length - 1];
          const lastOrder = lastShop.orders[lastShop.orders.length - 1];
          lastOrder.comment = name;
          if (name.includes("213 собран")) lastOrder.picked = true;
        }
        //looking for materials ↓
        if (!name.includes("Анализ за период") && quan) {
          //first off all calculate full amount of every material to compare with leftovers
          if (!materialsSummary[name]) {
            materialsSummary[name] = +quan;
          } else {
            materialsSummary[name] += +quan;
          }
          //second - sort them by shops
          const lastCar = carslist[carslist.length - 1];
          const allShops = lastCar.shopslist;
          const lastShop = allShops[allShops.length - 1];
          const numQuan = +quan;
          lastShop.materials.push({ name, numQuan });
        }
      });

      const leftovers = JSON.parse(localStorage.getItem("leftovers"));
      //check if there are overrun
      const overrun = [];
      leftovers.forEach((item) => {
        if (materialsSummary[item.name]) {
          if (item.left < materialsSummary[item.name]) {
            overrun.push({
              name: item.name,
              left: item.left,
              shipment: materialsSummary[item.name],
            });
          }
        }
      });
      //check for incorrect quantities
      const invalidQuans = [];
      let isThereAnyTowels = false;
      carslist.forEach((car) => {
        car.shopslist.forEach((shop) => {
          const lastshop = shop;
          shop.materials.forEach((material) => {
            const name = material.name;
            const quan = material.numQuan;
            const shopName = lastshop.name;
            if (packages.some((item) => name.includes(item.shortName))) {
              const truePack = packages.filter((item) =>
                name.includes(item.shortName)
              )[0].quan;
              if (quan % truePack) invalidQuans.push({ name, quan, shopName });
            }
            //sort materials by special groups like catalog, cups etc.
            if (
              name.includes(`Образец фас`) ||
              name.includes(`50х50`) ||
              name.includes(`бортик`)
            ) {
              shop.samples
                ? shop.samples.push({ name, quan })
                : (shop.samples = [{ name, quan }]);
            } else if (name.includes(`80 полос`)) {
              name.includes(`(48 часов)`)
                ? (shop.thickCatalog = { quan, region: "МСК" })
                : (shop.thickCatalog = { quan, region: "РЕГ" });
            } else if (name.includes(`20 полос`)) {
              name.includes(`(48 часов)`)
                ? (shop.thinCatalog = { quan, region: "МСК" })
                : (shop.thinCatalog = { quan, region: "РЕГ" });
            } else if (name.includes(`Блокнот`)) {
              shop.notebook = quan;
            } else if (name.includes(`Кружка с логотипом`)) {
              shop.cup = quan;
            } else if (name.includes(`Упаковка для кружки (мал.)`)) {
              shop.pack = quan;
            } else if (name.includes(`Папка картонная`)) {
              shop.folder = quan;
            } else if (name.includes(`Шампанское`)) {
              shop.vine = quan;
            } else if (name.includes(`Полотенце с логотипом в тубусе`)) {
              isThereAnyTowels = true;
              shop.towel = quan;
            } else {
              shop.otherMats
                ? shop.otherMats.push({ name, quan })
                : (shop.otherMats = [{ name, quan }]);
              //should cut long names here ↑
            }
          });
        });
      });
      carslist.sort((a, b) => b.shopslist.length - a.shopslist.length);
      const handledShipment = [];
      carslist.forEach((car) => {
        if (car.shopslist.length > 1) {
          //this crutch here to avoid infinite loop wich caused by colorsDB.split ↓
          const filteredColorsDB = Array.from(colorsDB).filter(
            (color) => !color.picked
          );
          const randomIndex = Math.floor(
            Math.random() * filteredColorsDB.length
          );
          const randomColor = filteredColorsDB[randomIndex];
          car.carBG = randomColor.color;
          colorsDB[randomIndex].picked = true;
          //crutch ↑
          if (randomColor.dark) {
            car.textColor = "silver";
          }
        }
        car.shopslist.forEach((shop) => {
          const cShop = shop;
          cShop.car = car.name;
          cShop.carBG = car.carBG;
          cShop.textColor = car.textColor;
          // cShop.shortName = shopsDB.filter((shop) => shop.name === cShop.name)
          //   ? shopsDB.filter((shop) => shop.name === cShop.name)[0].shortName
          //   : null;
          cShop.region = shopsDB.filter((shop) => shop.name === cShop.name)
            ? shopsDB.filter((shop) => shop.name === cShop.name)[0].region
            : null;
          cShop.shipmentTerms = shopsDB.filter(
            (shop) => shop.name === cShop.name
          )
            ? shopsDB.filter((shop) => shop.name === cShop.name)[0]
                .shipmentTerms
            : null;
          handledShipment.push(cShop);
        });
      });
      // const tableRowsNumber = handledShipment.length;
      const regularShipment = handledShipment.filter(
        (el) => el.shipmentTerms === `regular`
      );
      regularShipment.forEach((el) => {
        numberOfRegularShops += 1;
        numberOfRegularOrders += el.orders.length;
      });
      const spbShipment = handledShipment.filter(
        (el) => el.shipmentTerms === `spb`
      );
      spbShipment.forEach((el) => {
        numberOfSpbShops += 1;
        numberOfSpbOrders += el.orders.length;
      });
      const nnShipment = handledShipment.filter(
        (el) => el.shipmentTerms === `nn`
      );
      nnShipment.forEach((el) => {
        numberOfNnShops += 1;
        numberOfNnOrders += el.orders.length;
      });
      const spbnnShipment = handledShipment.filter(
        (el) => el.shipmentTerms === `spb` || el.shipmentTerms === `nn`
      );
      spbnnShipment.forEach((el) => {
        numberOfSpbNnShops += 1;
        numberOfSpbNnOrders += el.orders.length;
      });
      await dispatch("shipmentSettings", {
        overrun,
        shipmentDate,
        invalidQuans,
        handledShipment,
        isThereAnyTowels,
        regularShipment,
        numberOfRegularShops,
        numberOfRegularOrders,
        spbShipment,
        numberOfSpbShops,
        numberOfSpbOrders,
        nnShipment,
        numberOfNnShops,
        numberOfNnOrders,
        spbnnShipment,
        numberOfSpbNnShops,
        numberOfSpbNnOrders,
      });
    },
  },
  getters: {
    getcurrentTableRowToRender: (state) => {
      return state.currentTableRowToRender;
    },
    getRawShipment: (state) => {
      return state.rawShipment;
    },
    getShipment: (state) => {
      return state.shipment;
    },
    getSortedShipment: (state) => {
      return {
        msc: state.regularShipment,
        spb: state.spbShipment,
        nn: state.nnShipment,
        spbnn: state.spbnnShipment,
      };
    },
    getTableSwitcherState: (state) => {
      return state.tableSwitcher;
    },
    getInvalidQuans: (state) => {
      return state.invalidQuans;
    },
    getShopsAndColors: (state) => {
      return {
        shops: state.shopsDB,
        colors: state.colorsDB,
        packages: state.packages,
      };
    },
    getTowelsInfo: (state) => {
      return state.towels;
    },
    getTableInfo: (state) => {
      return {
        shipmentDate: state.shipmentDate,
        today: state.todayDate,
        start: state.timeStartWork,
        numberOfRegularShops: state.numberOfRegularShops,
        numberOfRegularOrders: state.numberOfRegularOrders,
        numberOfSpbShops: state.numberOfSpbShops,
        numberOfSpbOrders: state.numberOfSpbOrders,
        numberOfNnShops: state.numberOfNnShops,
        numberOfNnOrders: state.numberOfNnOrders,
        numberOfSpbNnShops: state.numberOfSpbNnShops,
        numberOfSpbNnOrders: state.numberOfSpbNnOrders,
      };
    },
  },
};
