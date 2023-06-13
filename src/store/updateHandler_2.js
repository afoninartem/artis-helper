import { db } from "../main";
export default {
	state: {},
	mutations: {
		setActualData(state, payload) {
			state[payload.updateDoc] = payload.data;
		},
	},
	actions: {
		async updateDateOfChange(context, payload) {
			await db
				.collection("dbUpdates")
				.doc(payload)
				.set({ lastUpdate: Date.now() }, { merge: true });
			// .update({ lastUpdate: Date.now() });
		},
		async setActualData(context, payload) {
			let data = [];
			let dataLastUpdateDB;
			const lastUpdateNameLS = `${payload.updateDoc}_lastUpdateLS`;
			const dataNameLS = `${payload.updateDoc}_data`;
			await db
				.collection("dbUpdates")
				.doc(payload.updateDoc)
				.get()
				.then((querySnapshot) => {
					dataLastUpdateDB = querySnapshot.data().lastUpdate;
				});

			const dataLastUpdateLS = localStorage.getItem(lastUpdateNameLS)
				? JSON.parse(localStorage.getItem(lastUpdateNameLS))
				: 0;
			if (dataLastUpdateDB > dataLastUpdateLS) {
				localStorage.setItem(
					lastUpdateNameLS,
					JSON.stringify(dataLastUpdateDB)
				);

				await db
					// .collection("service/catalog/cars")
					.collection(payload.dbPath)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							data.push(doc.data());
						});
					});

				localStorage.setItem(dataNameLS, JSON.stringify(data));
				console.log(
					`${payload.updateDoc}: информация в хранилище обновлена из БД`
				);
			} else {
				cars = localStorage.getItem("actualCatalogCars")
					? JSON.parse(localStorage.getItem("actualCatalogCars"))
					: [];
				console.log(`${payload.updateDoc}: информация взята из хранилища`);
			}
			return await context.commit("setActualData", {
				data,
				updateDoc: payload.updateDoc,
			});
		},
	},
	getters: {
    // getActualData()
  },
};
