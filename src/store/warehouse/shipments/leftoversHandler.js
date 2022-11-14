export default {
	state: {
		invalidLeftovers: [],
		leftoversValidation: false,
		urgentToOrder: [],
		handledLeftovers: [],
	},
	mutations: {
		// leftoversAreInvalid(state, payload) {
		// 	state.leftoversValidation = false;
		// 	state.invalidLeftovers = payload;
		// },
		// leftoversAreValid(state) {
		// 	state.leftoversValidation = true;
		// 	state.invalidLeftovers = [];
		// },
		// setLeftovers(state, payload) {
		// 	state.invalidLeftovers = payload;
		// },
		// setUrgentToOrder(state, payload) {
		// 	state.urgentToOrder.push(payload);
		// },
		setLeftovers(state, payload) {
			state.invalidLeftovers = payload.invalidLeftovers;
			state.urgentToOrder = payload.urgentToOrder;
			state.handledLeftovers = payload.handledLeftovers;
		},
	},
	actions: {
		// async leftoversAreInvalid(context, payload) {
		// 	return await context.commit("leftoversAreInvalid", payload);
		// },
		// async leftoversAreValid(context) {
		// 	return await context.commit("leftoversAreValid");
		// },
		// async setUrgentToOrder(context, payload) {
		// 	return await context.commit("setUrgentToOrder", payload);
		// },
		async leftoversHandler({ commit }, data) {
			if (data.some((el) => el["МПЗ"])) {
				if (
					data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков АХО ( НЕ ЗАКАЗЫВАТЬ! )")
					) &&
					data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков РП ( НЕ ЗАКАЗЫВАТЬ! )")
					)
				) {
					const handledLeftovers = data.map((el) => {
						return {
							name: el["МПЗ"],
							left:
								el["Остаток на конец"] === "-              "
									? 0
									: el["Остаток на конец"],
						};
					});
          // console.log(handledLeftovers.filter(m => m.name.includes("50х50")))
					const invalidLeftovers = handledLeftovers.filter(
						(material) => material.left < 0
					);
					const minimalLeftovers = JSON.parse(
						localStorage.getItem("actualLeftovers")
					);
					// console.log(minimalLeftovers.filter(m => m.name.includes("50х50")))
					const urgentToOrder = [];
					handledLeftovers.forEach((material) => {
						if (
							(material.name === "Шоколад с логотипом 5 гр." &&
								material.left % 250) ||
							(material.name === "Папка картонная А4 для клиентов" &&
								material.left % 100)
						)
							invalidLeftovers.push(material);
						//check for minimal leftovers
						if (
							(material.name.includes("Образец фас") && material.left < 5) ||
							(minimalLeftovers.some((m) => m.name === material.name) &&
								minimalLeftovers.filter((m) => m.name === material.name)[0]
									.minimalLeftover >= material.left)
						) {
							urgentToOrder.push(material);
						}
					});
					// console.log(urgentToOrder)
					document.querySelector("#file").value = "";
          commit("setLeftovers", {handledLeftovers, invalidLeftovers, urgentToOrder})
				}
				if (
					!data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков АХО ( НЕ ЗАКАЗЫВАТЬ! )")
					) &&
					data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков РП ( НЕ ЗАКАЗЫВАТЬ! )")
					)
				) {
					alert("Забыл выгрузить остатки по АХО!");
				}
				if (
					data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков АХО ( НЕ ЗАКАЗЫВАТЬ! )")
					) &&
					!data.some((el) =>
						el["МПЗ"].includes("%Для учёта остатков РП ( НЕ ЗАКАЗЫВАТЬ! )")
					)
				) {
					alert("Ахо выгрузил, а рекламу забыл, ну пиздец!");
				}
			} else {
				alert("Это не остатки!");
			}
		},
	},
	getters: {
		// getLeftoversValidation: (state) => {
		// 	return state.leftoversValidation;
		// },
		getUrgentOrders: (state) => {
			return state.urgentToOrder;
		},
		getLeftovers: (state) => {
			return state.handledLeftovers;
		},
		getInvalidLeftovers: (state) => {
			return state.invalidLeftovers;
		},
	},
};
