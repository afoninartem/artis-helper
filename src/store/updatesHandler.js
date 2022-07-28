import { db } from "../main";
export default {
	state: {
		actualShops: null,
		actualColors: null,
		actualPackages: null,
		actualStorage: null,
		actualLeftovers: null,
		actualStopList: null,
		actualLimits: null,
		actualDinners: null,
		actualNeeds: null,
		actualVacancies: null,
		actualCatalogPersonal: null,
    actualCandidates: null,
    actualCatalogDrivers: null,
    actualCatalogCars: null,
	},
	mutations: {
		setActualCatalogDrivers(state, payload) {
			state.actualCatalogDrivers = payload;
		},
		setActualCatalogCars(state, payload) {
			state.actualCatalogCars = payload;
		},
		setActualShops(state, payload) {
			state.actualShops = payload;
		},
		setActualColors(state, payload) {
			state.actualColors = payload;
		},
		setActualPackages(state, payload) {
			state.actualPackages = payload;
		},
		setActualStorage(state, payload) {
			state.actualStorage = payload;
		},
		setActualLeftovers(state, payload) {
			state.actualLeftovers = payload;
		},
		setActualStopList(state, payload) {
			state.actualStopList = payload;
		},
		setActualLimits(state, payload) {
			state.actualLimits = payload;
		},
		setActualDinners(state, payload) {
			state.actualDinners = payload;
		},
		setActualNeeds(state, payload) {
			state.actualNeeds = payload;
		},
		setActualVacancies(state, payload) {
			state.actualVacancies = payload;
		},
		setActualCatalogPersonal(state, payload) {
			state.actualCatalogPersonal = payload;
		},
		setActualCandidates(state, payload) {
			state.actualCandidates = payload;
		},
	},
	actions: {
		//set uptade date:
		async updateCandidatesDate() {
			await db
				.collection("dbUpdates")
				.doc("candidates")
				.update({ lastUpdate: Date.now() });
		},
		async updateCatalogDriversDate() {
			await db
				.collection("dbUpdates")
				.doc("catalog_drivers")
				.update({ lastUpdate: Date.now() });
		},
		async updateCatalogCarsDate() {
			await db
				.collection("dbUpdates")
				.doc("catalog_cars")
				.update({ lastUpdate: Date.now() });
		},
		async updateVacanciesDate() {
			await db
				.collection("dbUpdates")
				.doc("vacancies")
				.update({ lastUpdate: Date.now() });
		},
		async updateNeedsDate() {
			await db
				.collection("dbUpdates")
				.doc("needs")
				.update({ lastUpdate: Date.now() });
		},
		async updateShopsDate() {
			await db
				.collection("dbUpdates")
				.doc("shops")
				.update({ lastUpdate: Date.now() });
		},
		async updateStorageDate() {
			await db
				.collection("dbUpdates")
				.doc("storage")
				.update({ lastUpdate: Date.now() });
		},
		async updatePackagesDate() {
			await db
				.collection("dbUpdates")
				.doc("packages")
				.update({ lastUpdate: Date.now() });
		},
		async updateColorsDate() {
			await db
				.collection("dbUpdates")
				.doc("colors")
				.update({ lastUpdate: Date.now() });
		},
		async updateLeftoversDate() {
			await db
				.collection("dbUpdates")
				.doc("leftovers")
				.update({ lastUpdate: Date.now() });
		},
		async updateStopListDate() {
			await db
				.collection("dbUpdates")
				.doc("stoplist")
				.update({ lastUpdate: Date.now() });
		},
		async updateActualLimits() {
			await db
				.collection("dbUpdates")
				.doc("limits")
				.update({ lastUpdate: Date.now() });
		},
		async updateActualDinners() {
			await db
				.collection("dbUpdates")
				.doc("dinners")
				.update({ lastUpdate: Date.now() });
		},
		async updateActualCatalogPersonal() {
			await db
				.collection("dbUpdates")
				.doc("catalog_personal")
				.update({ lastUpdate: Date.now() });
		},
		//set actual data in state
    async setActualCatalogCars(context) {
			let cars = [];
			let catalogCarsLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("catalog_cars")
				.get()
				.then((querySnapshot) => {
					catalogCarsLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const catalogCarsLastUpdateLS = localStorage.getItem(
				"catalogCarsLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("catalogCarsLastUpdateLS"))
				: 0;
			if (catalogCarsLastUpdateDB > catalogCarsLastUpdateLS) {
				localStorage.setItem(
					"catalogCarsLastUpdateLS",
					JSON.stringify(catalogCarsLastUpdateDB)
				);

				await db
					.collection("service/catalog/cars")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							cars.push(doc.data());
						});
					});
				localStorage.setItem("actualCatalogCars", JSON.stringify(cars));
				console.log("КАТАЛОГ МАШИН ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				cars = localStorage.getItem("actualCatalogCars")
					? JSON.parse(localStorage.getItem("actualCatalogCars"))
					: [];
				console.log("КАТАЛОГ МАШИН ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualCatalogCars", cars);
		},
		async setActualCatalogDrivers(context) {
			let drivers = [];
			let catalogDriversLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("catalog_drivers")
				.get()
				.then((querySnapshot) => {
					catalogDriversLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const catalogDriversLastUpdateLS = localStorage.getItem(
				"catalogDriversLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("catalogDriversLastUpdateLS"))
				: 0;
			if (catalogDriversLastUpdateDB > catalogDriversLastUpdateLS) {
				localStorage.setItem(
					"catalogDriversLastUpdateLS",
					JSON.stringify(catalogDriversLastUpdateDB)
				);

				await db
					.collection("service/catalog/drivers_JSON")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							drivers.push(doc.data());
						});
					});
          // console.log(drivers)
				localStorage.setItem("actualCatalogDrivers", JSON.stringify(drivers));
				console.log("КАТАЛОГ ВОДИТЕЛЕЙ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				drivers = localStorage.getItem("actualCatalogDrivers")
					? JSON.parse(localStorage.getItem("actualCatalogDrivers"))
					: [];
				console.log("КАТАЛОГ ВОДИТЕЛЕЙ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualCatalogDrivers", drivers);
		},

		async setActualCandidates(context) {
			let candidates = [];
			let candidatesLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("candidates")
				.get()
				.then((querySnapshot) => {
					candidatesLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const candidatesLastUpdateLS = localStorage.getItem(
				"candidatesLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("candidatesLastUpdateLS"))
				: 0;
			if (candidatesLastUpdateDB > candidatesLastUpdateLS) {
				localStorage.setItem(
					"candidatesLastUpdateLS",
					JSON.stringify(candidatesLastUpdateDB)
				);

				await db
					.collection("personal/hiring/candidates")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							candidates.push(doc.data());
						});
					});

				localStorage.setItem("actualCandidates", JSON.stringify(candidates));
				console.log("СПИСОК КАНДИДАТОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				candidates = localStorage.getItem("actualCandidates")
					? JSON.parse(localStorage.getItem("actualCandidates"))
					: [];
				console.log("СПИСОК КАНДИДАТОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualCandidates", candidates);
		},

		async setActualCatalogPersonal(context) {
			let catalogPersonal = [];
			let catalogPersonalLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("catalog_personal")
				.get()
				.then((querySnapshot) => {
					catalogPersonalLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const catalogPersonalLastUpdateLS = localStorage.getItem(
				"catalogPersonalLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("catalogPersonalLastUpdateLS"))
				: 0;
			if (catalogPersonalLastUpdateDB > catalogPersonalLastUpdateLS) {
				localStorage.setItem(
					"catalogPersonalLastUpdateLS",
					JSON.stringify(catalogPersonalLastUpdateDB)
				);

				await db
					.collection("personal/hiring/catalog")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							catalogPersonal.push(doc.data());
						});
					});

				localStorage.setItem("actualCatalogPersonal", JSON.stringify(catalogPersonal));
				console.log("КАТАЛОГ ОТДЕЛА ПЕРСОНАЛА ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				catalogPersonal = localStorage.getItem("actualCatalogPersonal")
					? JSON.parse(localStorage.getItem("actualCatalogPersonal"))
					: [];
				console.log("КАТАЛОГ ОТДЕЛА ПЕРСОНАЛА ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualCatalogPersonal", catalogPersonal);
		},

		async setActualVacancies(context) {
			let vacancies = [];
			let vacanciesLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("vacancies")
				.get()
				.then((querySnapshot) => {
					vacanciesLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const vacanciesLastUpdateLS = localStorage.getItem(
				"vacanciesLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("vacanciesLastUpdateLS"))
				: 0;
			if (vacanciesLastUpdateDB > vacanciesLastUpdateLS) {
				localStorage.setItem(
					"vacanciesLastUpdateLS",
					JSON.stringify(vacanciesLastUpdateDB)
				);

				await db
					.collection("personal/hiring/vacancies")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							vacancies.push(doc.data());
						});
					});

				localStorage.setItem("actualVacancies", JSON.stringify(vacancies));
				console.log("СПИСОК ВАКАНСИЙ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				vacancies = localStorage.getItem("actualVacancies")
					? JSON.parse(localStorage.getItem("actualVacancies"))
					: [];
				console.log("СПИСОК ВАКАНСИЙ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualVacancies", vacancies);
		},

		async setActualNeeds(context) {
			let needs = [];
			let needsLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("needs")
				.get()
				.then((querySnapshot) => {
					needsLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const needsLastUpdateLS = localStorage.getItem("needsLastUpdateLS")
				? JSON.parse(localStorage.getItem("needsLastUpdateLS"))
				: 0;

			if (needsLastUpdateDB > needsLastUpdateLS) {
				localStorage.setItem(
					"needsLastUpdateLS",
					JSON.stringify(needsLastUpdateDB)
				);

				await db
					.collection("warehouse/internal/needs")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							needs.push(doc.data());
						});
					});
				localStorage.setItem("actualNeeds", JSON.stringify(needs));
				console.log("ПОТРЕБНОСТЬ СКЛАДА ВЗЯТА ИЗ БД И ЗАПИСАНА В ХРАНИЛИЩЕ");
			} else {
				needs = localStorage.getItem("actualNeeds")
					? JSON.parse(localStorage.getItem("actualNeeds"))
					: [];
				console.log("ПОТРЕБНОСТЬ СКЛАДА ВЗЯТА ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualNeeds", needs);
		},

		async setActualShops(context) {
			let shops = [];
			let shopsLastUpdateDB;
			await db
				.collection("dbUpdates")
				.doc("shops")
				.get()
				.then((querySnapshot) => {
					shopsLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const shopsLastUpdateLS = localStorage.getItem("shopsLastUpdateLS")
				? JSON.parse(localStorage.getItem("shopsLastUpdateLS"))
				: 0;

			if (shopsLastUpdateDB > shopsLastUpdateLS) {
				localStorage.setItem(
					"shopsLastUpdateLS",
					JSON.stringify(shopsLastUpdateDB)
				);

				await db
					.collection("shops")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							shops.push(doc.data());
						});
					});
				localStorage.setItem("actualShops", JSON.stringify(shops));
				console.log("СПИСОК САЛОНОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				shops = localStorage.getItem("actualShops")
					? JSON.parse(localStorage.getItem("actualShops"))
					: [];
				console.log("СПИСОК САЛОНОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualShops", shops);
		},

		async setActualColors(context) {
			let colors = [];
			let colorsLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("colors")
				.get()
				.then((querySnapshot) => {
					colorsLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const colorsLastUpdateLS = localStorage.getItem("colorsLastUpdateLS")
				? JSON.parse(localStorage.getItem("colorsLastUpdateLS"))
				: 0;

			if (colorsLastUpdateDB > colorsLastUpdateLS) {
				localStorage.setItem(
					"colorsLastUpdateLS",
					JSON.stringify(colorsLastUpdateDB)
				);

				await db
					.collection("warehouse/shipment/carsColors")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							colors.push(doc.data());
						});
					});
				localStorage.setItem("actualColors", JSON.stringify(colors));
				console.log("СПИСОК ЦВЕТОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				colors = localStorage.getItem("actualColors")
					? JSON.parse(localStorage.getItem("actualColors"))
					: [];
				console.log("СПИСОК ЦВЕТОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualColors", colors);
		},

		async setActualPackages(context) {
			let packages = [];
			let packagesLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("packages")
				.get()
				.then((querySnapshot) => {
					packagesLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const packagesLastUpdateLS = localStorage.getItem("packagesLastUpdateLS")
				? JSON.parse(localStorage.getItem("packagesLastUpdateLS"))
				: 0;

			if (packagesLastUpdateDB > packagesLastUpdateLS) {
				localStorage.setItem(
					"packagesLastUpdateLS",
					JSON.stringify(packagesLastUpdateDB)
				);

				await db
					.collection("warehouse/shipment/packages")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							packages.push(doc.data());
						});
					});

				localStorage.setItem("actualPackages", JSON.stringify(packages));
				console.log("СПИСОК УПАКОВОК ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				packages = localStorage.getItem("actualPackages")
					? JSON.parse(localStorage.getItem("actualPackages"))
					: [];
				console.log("СПИСОК УПАКОВОК ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualPackages", packages);
		},

		async setActualStorage(context) {
			let storage = [];
			let storageLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("storage")
				.get()
				.then((querySnapshot) => {
					storageLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const storageLastUpdateLS = localStorage.getItem("storageLastUpdateLS")
				? JSON.parse(localStorage.getItem("storageLastUpdateLS"))
				: 0;

			if (storageLastUpdateDB > storageLastUpdateLS) {
				localStorage.setItem(
					"storageLastUpdateLS",
					JSON.stringify(storageLastUpdateDB)
				);

				await db
					.collection("warehouse/storage/roomStorage")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							storage.push(doc.data());
						});
					});
				// console.log(storage);
				localStorage.setItem("actualStorage", JSON.stringify(storage));
				console.log(
					"СПИСОК МАТЕРИАЛОВ В КАБИНЕТЕ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ"
				);
			} else {
				storage = localStorage.getItem("actualStorage")
					? JSON.parse(localStorage.getItem("actualStorage"))
					: [];
				console.log("СПИСОК МАТЕРИАЛОВ В КАБИНЕТЕ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}

			return await context.commit("setActualStorage", storage);
		},

		async setActualLeftovers(context) {
			let leftovers = [];
			let leftoversLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("leftovers")
				.get()
				.then((querySnapshot) => {
					leftoversLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const leftoversLastUpdateLS = localStorage.getItem(
				"leftoversLastUpdateLS"
			)
				? JSON.parse(localStorage.getItem("leftoversLastUpdateLS"))
				: 0;

			if (leftoversLastUpdateDB > leftoversLastUpdateLS) {
				localStorage.setItem(
					"leftoversLastUpdateLS",
					JSON.stringify(leftoversLastUpdateDB)
				);
				await db
					.collection("warehouse/shipment/leftovers")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							leftovers.push(doc.data());
						});
					});
				localStorage.setItem("actualLeftovers", JSON.stringify(leftovers));
				console.log(
					"СПИСОК МИНИМАЛЬНЫХ ОСТАТКОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ"
				);
			} else {
				leftovers = localStorage.getItem("actualLeftovers")
					? JSON.parse(localStorage.getItem("actualLeftovers"))
					: [];
				console.log("СПИСОК МИНИМАЛЬНЫХ ОСТАТКОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualLeftovers", leftovers);
		},

		async setActualStopList(context) {
			let stoplist = [];
			let stoplistLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("stoplist")
				.get()
				.then((querySnapshot) => {
					stoplistLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const stoplistLastUpdateLS = localStorage.getItem("stoplistLastUpdateLS")
				? JSON.parse(localStorage.getItem("stoplistLastUpdateLS"))
				: 0;

			if (stoplistLastUpdateDB > stoplistLastUpdateLS) {
				localStorage.setItem(
					"stoplistLastUpdateLS",
					JSON.stringify(stoplistLastUpdateDB)
				);
				await db
					.collection("warehouse/shipment/stoplist")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							stoplist.push(doc.data());
						});
					});
				// console.log(stoplist);
				localStorage.setItem("actualStopList", JSON.stringify(stoplist));
				console.log(
					"СПИСОК НЕОТГРУЖАЕМЫХ МАТЕРИАЛОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ"
				);
			} else {
				stoplist = localStorage.getItem("actualStopList")
					? JSON.parse(localStorage.getItem("actualStopList"))
					: [];
				console.log("СПИСОК НЕОТГРУЖАЕМЫХ МАТЕРИАЛОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualStopList", stoplist);
		},

		async setActualLimits(context) {
			let limits = [];
			let limitsLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("limits")
				.get()
				.then((querySnapshot) => {
					limitsLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const limitsLastUpdateLS = localStorage.getItem("limitsLastUpdateLS")
				? JSON.parse(localStorage.getItem("limitsLastUpdateLS"))
				: 0;

			if (limitsLastUpdateDB > limitsLastUpdateLS) {
				localStorage.setItem(
					"limitsLastUpdateLS",
					JSON.stringify(limitsLastUpdateDB)
				);
				await db
					.collection("warehouse/shipment/limits")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							limits.push(doc.data());
						});
					});
				localStorage.setItem("actualLimits", JSON.stringify(limits));
				console.log("СПИСОК ЛИМИТОВ ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ");
			} else {
				limits = localStorage.getItem("actualLimits")
					? JSON.parse(localStorage.getItem("actualLimits"))
					: [];
				console.log("СПИСОК ЛИМИТОВ ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			await context.commit("setActualLimitsInLimitHandler", limits);
			return await context.commit("setActualLimits", limits);
		},

		async setActualDinners(context) {
			let dinners = [];
			let dinnersLastUpdateDB;

			await db
				.collection("dbUpdates")
				.doc("dinners")
				.get()
				.then((querySnapshot) => {
					dinnersLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const dinnersLastUpdateLS = localStorage.getItem("dinnersLastUpdateLS")
				? JSON.parse(localStorage.getItem("dinnersLastUpdateLS"))
				: 0;

			if (dinnersLastUpdateDB > dinnersLastUpdateLS) {
				localStorage.setItem(
					"dinnersLastUpdateLS",
					JSON.stringify(dinnersLastUpdateDB)
				);
				await db
					.collection("maintenance/dinners/freeEaters")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							dinners.push(doc.data());
						});
					});
				localStorage.setItem("actualDinners", JSON.stringify(dinners));
				console.log(
					"СПИСОК ОБЕДАЮЩИХ БЕСПЛАТНО ВЗЯТ ИЗ БД И ЗАПИСАН В ХРАНИЛИЩЕ"
				);
			} else {
				dinners = localStorage.getItem("actualDinners")
					? JSON.parse(localStorage.getItem("actualDinners"))
					: [];
				console.log("СПИСОК ОБЕДАЮЩИХ БЕСПЛАТНО ВЗЯТ ИЗ ХРАНИЛИЩА");
			}
			return await context.commit("setActualDinners", dinners);
		},
	},
	getters: {
		getActualStates: (state) => {
			return {
				shops: state.actualShops,
				colors: state.actualColors,
				packages: state.actualPackages,
				storage: state.actualStorage,
				leftovers: state.actualLeftovers,
				stoplist: state.actualStopList,
				limits: state.actualLimits,
				dinners: state.actualDinners,
				needs: state.actualNeeds,
				vacancies: state.actualVacancies,
        catalogPersonal: state.actualCatalogPersonal,
        candidates: state.actualCandidates,
        catalogDrivers: state.actualCatalogDrivers ? state.actualCatalogDrivers .map(driver => JSON.parse(driver.json)) : null,
        catalogCars: state.actualCatalogCars,
			};
		},
	},
};
