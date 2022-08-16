export default {
	state: {
    aliens: [],
		rawShipment: null,
		shopsDB: [],
		colorsDB: [],
		shipment: null,
		overrun: [],
		stoppedMaterials: [],
		packages: null,
		invalidQuans: [],
		towels: false,
		materialsSummary: null,
		spbnnPaperShipment: null,
		regularPaperShipment: null,
		//sorted by regions:
		regularShipment: null,
		spbShipment: null,
		nnShipment: null,
		spbnnShipment: null,
		//numbers of shops and orders for info
		tableInfo: {
			shipmentDate: null,
			timeStartWork: null,
			todayDate: null,
			activeRegion: null,
			msc: {
				title: "МСК + РЕГ, без СПБ и НН",
				numberOfOrders: null,
				numberOfShops: null,
			},
			spb: {
				title: "САНКТ-ПЕТЕРБУРГ",
				numberOfOrders: null,
				numberOfShops: null,
			},
			nn: {
				title: "НИЖНИЙ НОВГОРОД",
				numberOfOrders: null,
				numberOfShops: null,
			},
			spbnn: {
				title: "СПБ + НН",
				numberOfOrders: null,
				numberOfShops: null,
			},
		},
		//switcher for tables
		tableSwitcher: [
			{ region: "msc", active: false },
			{ region: "spb", active: false },
			{ region: "nn", active: false },
			{ region: "spbnn", active: false },
		],
	},
	mutations: {
		addStoppedMaterials(state, payload) {
			state.stoppedMaterials.push(payload);
		},
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
      state.aliens = payload.aliens;
			state.overrun = payload.overrun;
			state.tableInfo.shipmentDate = payload.shipmentDate;
			state.invalidQuans = payload.invalidQuans;
			state.shipment = payload.handledShipment;
			state.towels = payload.isThereAnyTowels;
			state.regularShipment = payload.regularShipment;
			state.tableInfo.msc.numberOfShops = payload.numberOfRegularShops;
			state.tableInfo.msc.numberOfOrders = payload.numberOfRegularOrders;
			state.spbShipment = payload.spbShipment;
			state.tableInfo.spb.numberOfShops = payload.numberOfSpbShops;
			state.tableInfo.spb.numberOfOrders = payload.numberOfSpbOrders;
			state.nnShipment = payload.nnShipment;
			state.tableInfo.nn.numberOfShops = payload.numberOfNnShops;
			state.tableInfo.nn.numberOfOrders = payload.numberOfNnOrders;
			state.spbnnShipment = payload.spbnnShipment;
			state.tableInfo.spbnn.numberOfShops = payload.numberOfSpbNnShops;
			state.tableInfo.spbnn.numberOfOrders = payload.numberOfSpbNnOrders;
			state.stoppedMaterials = payload.stoplist;
			state.materialsSummary = payload.materialsSummary;
			state.spbnnPaperShipment = payload.spbnnPaperShipment;
			state.regularPaperShipment = payload.regularPaperShipment;
		},
		setShopsAndColors(state, payload) {
			state.shopsDB = payload.shops;
			state.colorsDB = payload.colors;
		},
		setTableInfoDataIntoState(state, payload) {
			(state.tableInfo.timeStartWork = payload.time),
				(state.tableInfo.todayDate = payload.today);
		},
	},
	actions: {
		async addShipment(context, payload) {
			return await context.commit("addShipment", payload);
		},
		async switchTable(context, payload) {
			return await context.commit("switchTable", payload);
		},
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
			const shopsAndColors = getters.getActualStates;
			const shopsDB = shopsAndColors.shops;
			const colorsDB = shopsAndColors.colors;
			const packages = shopsAndColors.packages;
      // const limits = shopsAndColors.limits;
			const stoplist = [];
			const carslist = [];
			const materialsSummary = {};
			let regularPaperShipment = 0;
			let spbnnPaperShipment = 0;
			let shipmentDate = null;
			const dataName = "Машина/Салон/Документ/Материал";
			const dataQuan = "Количество";
			const data = getters.getRawShipment;
			Array.from(data).forEach((row, i) => {
				const name = row[dataName].split("  ").join(" ");
				const quan = row[dataQuan];
				const prevName = data[i - 1]
					? data[i - 1][dataName].split("  ").join(" ")
					: null;
				const prevQuan = data[i - 1] ? data[i - 1][dataQuan] : null;
				const nextQuan = data[i + 1] ? data[i + 1][dataQuan] : null;
				//date of shipment ↓
				if (name.includes("Анализ за период")) {
					shipmentDate = quan;
				}
				//looking for cars ↓
				if (
					!quan &&
					!nextQuan &&
					prevQuan &&
					!shopsDB.some((el) => el.name === name)
				) {
          let carName;
          if (name.trim() != '') {
            try {
              carName = name.includes("Наем")
             ? `Н.М. ${name.match(/\d+/g) ? name.match(/\d+/g)[0] : null}`.trim()
             : name.match(/\d+/g)[0]
           } catch (error) {
             carName = name
             console.log(row)
           }
          } else {
            carName = "НЕ УКАЗАНО"
            alert(`Проверь значение строки ${row.__rowNum__ + 1} в файле с отгрузкой.`)
          }
          
					carslist.push({
						name: carName.trim(),
						shopslist: [],
						carBG: "#FFFFFF",
						textColor: "#000000",
						region: null,
					});
				}
				//looking for shops ↓
				if (shopsDB.map((el) => el.name).includes(name)) {
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
					const allShops = lastCar.shopslist;
					const lastShop = allShops[allShops.length - 1];
					if (!lastShop) {
						alert(`В БД нет салона по заявке ${name}`);
						return;
					}
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
          if (name.includes(". АФОНИН")) {
            lastShop.materials.push({ name })
          }
				}
				//looking for materials ↓
				if (!name.includes("Анализ за период") && quan) {
          //first of all - sort them by shops
          const lastCar = carslist[carslist.length - 1];
					const allShops = lastCar.shopslist;
					const lastShop = allShops[allShops.length - 1];
					const numQuan = +quan;
					lastShop.materials.push({ name, numQuan });
					//second - calculate full amount of every material to compare with leftovers
					if (!materialsSummary[name]) {
						materialsSummary[name] = +quan;
					} else {
						materialsSummary[name] += +quan;
					}
					//third - check for limits
          dispatch("checkMaterial", {name, quan: numQuan, shop: lastShop.name})
				}
			});

      const leftovers = getters.getLeftovers;

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
			//check for incorrect quantities and aliens =)
      const aliens = [];
			const invalidQuans = [];
			let isThereAnyTowels = false;
			carslist.forEach((car) => {
				car.shopslist.forEach((shop) => {
					const lastshop = shop;
					shop.materials.forEach((material) => {
						const name = material.name.trim();
						const quan = material.numQuan;
            //check if there are alien materials =)
            if (!leftovers.map(l => l.name).includes(name)) aliens.push({material: name, shop: shop.name})
						//check if material in the stoplist ↓
						const stop = getters.getActualStates.stoplist.map((el) => el.name);
						if (stop.includes(name)) {
							stoplist.push({
								shop: shop.name,
								orders: shop.orders.map((el) => el.name),
								material: name,
							});
						}
						//check if material in the stoplist ↑
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
						} else if (name.includes(`56 полос`)) {
              shop.thickCatalog = quan
							// name.includes(`(48 часов)`)
							// 	? (shop.thickCatalog = { quan, region: "МСК" })
							// 	: (shop.thickCatalog = { quan, region: "РЕГ" });
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
							// } else {
						} else if (name.includes("Арт")) {
              let shortName = name.split(" ")[0] + " Арт. ";
              name.includes("№") ? shortName += name.match(/\w+?\d+/)[0] : shortName += name.split(" ")[name.split(" ").indexOf("Арт.") + 1]
							shop.otherMats
								? shop.otherMats.push({ name: shortName, quan })
								: (shop.otherMats = [{ name: shortName, quan }]);
						} else if (name.includes("Ценник круглый")) {
              const shortName = name.includes("ОБРАЗЕЦ") ? "Ценник круглый ОБРАЗЕЦ" : "Ценник круглый СКИДКА";
              shop.otherMats
              ? shop.otherMats.push({ name: shortName, quan })
              : (shop.otherMats = [{ name: shortName, quan }]);
            } else if (name.includes("Лоскут")) {
              const arrName = name.split(" ");
              const shortName = [arrName[0], arrName[1], arrName[2], arrName[arrName.length - 2]].join(" ");
              shop.otherMats
              ? shop.otherMats.push({ name: shortName, quan })
              : (shop.otherMats = [{ name: shortName, quan }]);
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
					colorsDB.filter(
						(color) => color.color === randomColor.color
					)[0].picked = true;
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
			//collect orders by terms
			const regularOrders = [];
			const spbnnOrders = [];

			//divide and color by shipmentTerms
			const regularShipment = handledShipment.filter(
				(el) => el.shipmentTerms === `regular`
			);
			regularShipment.forEach((el) => {
				numberOfRegularShops += 1;
				numberOfRegularOrders += el.orders.length;
				el.shopBG = "#ffffff";
				const ordersNames = el.orders.map((el) => el.name);
				// regularOrders.concat(ordersNames) don't work
				ordersNames.forEach((el) => regularOrders.push(el));
				// console.log(el.materials)
				regularPaperShipment += el.materials.filter(
					(mat) =>
						mat.name === "Упаковка бумаги А4 для принтера (1 упак = 500 листов)"
				).length
					? el.materials.filter(
							(mat) =>
								mat.name ===
								"Упаковка бумаги А4 для принтера (1 упак = 500 листов)"
					)[0].numQuan
					: 0;
			});
			//reminder for client gifts
			const spbShipment = handledShipment.filter(
				(el) => el.shipmentTerms === `spb`
			);
			spbShipment.forEach((el) => {
				numberOfSpbShops += 1;
				numberOfSpbOrders += el.orders.length;
				el.shopBG = "rgba(245, 161, 15, 0.4)";
			});
			const nnShipment = handledShipment.filter(
				(el) => el.shipmentTerms === `nn`
			);
			nnShipment.forEach((el) => {
				numberOfNnShops += 1;
				numberOfNnOrders += el.orders.length;
				el.shopBG = "rgba(0, 128, 0, 0.4)";
			});
			const spbnnShipment = spbShipment.concat(nnShipment);
			spbnnShipment.forEach((el) => {
				numberOfSpbNnShops += 1;
				numberOfSpbNnOrders += el.orders ? el.orders.length : 0;
				const ordersNames = el.orders.map((el) => el.name);
				// spbnnOrders.concat(ordersNames) don't work
				ordersNames.forEach((el) => spbnnOrders.push(el));
				spbnnPaperShipment += el.materials.filter(
					(mat) =>
						mat.name === "Упаковка бумаги А4 для принтера (1 упак = 500 листов)"
				).length
					? el.materials.filter(
							(mat) =>
								mat.name ===
								"Упаковка бумаги А4 для принтера (1 упак = 500 листов)"
					)[0].numQuan
					: 0;
			});

			const date = new Date();
			const dayOfMonth = date.getDate();
			const dayOfWeek = date.getDay();
			await dispatch("checkOrders", {
				shipmentDate,
				dayOfMonth,
				dayOfWeek,
				regular: regularOrders,
				spbnn: spbnnOrders,
			});

			await dispatch("shipmentSettings", {
        aliens,
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
				stoplist,
				materialsSummary,
				spbnnPaperShipment,
				regularPaperShipment,
			});
		},
	},
	getters: {
		getcurrentTableRowToRender: (state) => {
			return state.currentTableRowToRender;
		},
    getALiens: state => {
      return state.aliens;
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
		getTowelsInfo: (state) => {
			return state.towels;
		},
		getTableInfo: (state) => {
			return state.tableInfo;
		},
		getCurrentStoppedMaterials: (state) => {
			return state.stoppedMaterials;
		},
		getMaterialsSummary: (state) => {
			return state.materialsSummary;
		},
		getPaperShipment: (state) => {
			return {
				regular: state.regularPaperShipment,
				spbnn: state.spbnnPaperShipment,
			};
		},
	},
};
