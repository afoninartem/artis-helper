export default {
	state: {
		taxcomData: null,
		fiscalResult: null,
		onlineResult: null,
		paylinksResult: null,
		exceptKKT: [
			"0003747179044136", // Офис (бухгалтерия)
			// "0002599902020128", // Интернет-магазин
			// "0004800423045335", // Облачная Касса (ссылка КЕБ)
			"0002921555062494", // АРТИС (офис)
			"0004787386036331", // Офис НН (БУМ НН)
			"0004751203041690", // Склад СПб
		],
		xmlSellings: null,
	},
	mutations: {
		setTaxcomData(state, payload) {
			state.taxcomData = payload;
		},
		setComparedData(state, payload) {
			state.xmlSellings = payload.sellsXmlFromTaxcom;
			state.onlineResult = payload.onlineShopFromTaxcom;
			state.paylinksResult = payload.paymentLinksFromTaxcom;
			state.fiscalResult = {
				notEqualSumsByFPD: payload.notEqualSumsByFPD,
				incorrectCheckbox: payload.incorrectCheckbox,
				notEqualDetailsByFPD: payload.notEqualDetailsByFPD,
				noSuchFPDInTaxcom: payload.noSuchFPDInTaxcom,
				unidentifyedByFPDFromTaxcom: payload.unidentifyedByFPDFromTaxcom,
			};
		},
	},
	actions: {
		async setTaxcomData(context, payload) {
			return await context.commit("setTaxcomData", payload);
		},
		async compareData({ commit, getters }) {
			const dateConverter = require("../dateHandler");
			const someMath = require("../someMath");
			//STORE DATA VARIABLES
			const dataStorage = {
				notEqualSumsByFPD: [],
				notEqualDetailsByFPD: [],
				incorrectCheckbox: [],
				noSuchFPDInTaxcom: {
					documents: [],
					header: ["Дата", "Торговый объект", "Сумма", "Фискальный признак"],
					successfullSells: 0,
					refundsQuantity: 0,
					totalSum: 0,
					refundSum: 0,
				},
				unidentifyedByFPDFromTaxcom: {
					documents: [],
					successfullSells: 0,
					refundsQuantity: 0,
					totalSum: 0,
					refundSum: 0,
				},
				onlineShopFromTaxcom: {
					documents: [],
					successfullSells: 0,
					refundsQuantity: 0,
					totalSum: 0,
					totalSumByCreditEurope: 0,
					refundSum: 0,
					extrasFromTaxcom: [],
					extrasFromCredit: [],
				},
				paymentLinksFromTaxcom: {
					documents: [],
					successfullSells: 0,
					refundsQuantity: 0,
					totalSum: 0,
					totalSumByCreditEurope: 0,
					refundSum: 0,
					extrasFromTaxcom: [],
					extrasFromCredit: [],
				},
				sellsXmlFromTaxcom: {
					extrasXML: [],
					extrasTaxcom: [],
					xmlAmount: "",
					taxcomAmount: "",
				},
			};
			//TAXCOM
			const taxcom = getters.getTaxcomData.filter(
				(p) => p["Документ"] === "Кассовый чек"
			);
			taxcom.forEach((t) => {
				if (t["ФПД"].length < 10) {
					t["ФПД"] = "0".repeat(10 - t["ФПД"].length) + t["ФПД"].toString();
				}
				t["Дата для сравнения"] = dateConverter.excelDateToJSDate(
					t["Дата и время"]
				);
				// t["Дата для сравнения"] = dateConverter.convertTaxcomDate(t["Дата и время"]);
			});
			//FISCAL REGISTRY
			const fiscal = getters.getFiscalData
				? getters.getFiscalData.filter(
						(f) => f["Тип документа"] === "Кассовый чек"
				  )
				: null;

			//ONLINESHOP FROM CREDITEUROPE
			const online = getters.getOnlineShopData;

			//PAYLINKS
			const paylinks = getters.getPayLinks?.filter(
				(l) => l["Состояние"] === "Завершён"
			);

			//SELLINGS FROM XML
			const sellsXml = getters.getSellingData;

			//get exceptions of checkbox
			const exceptKKT = getters.getExceptionsKKT;

			if (fiscal) {
				fiscal.forEach((r) => {
					// r["Дата для сравнения"] = dateConverter.excelDateToJSDate(r["Дата"]);
					r["Дата для сравнения"] = dateConverter.convertFiscalDate(r["Дата"]);
					//set fpd
					if (!r["Фискальный признак"]) {
						r["Фискальный признак"] = null;
					} else {
						if (r["Фискальный признак"].length < 10) {
							r["Фискальный признак"] =
								"0".repeat(10 - r["Фискальный признак"].length) +
								r["Фискальный признак"].toString();
						}
					}
					if (!taxcom.some((t) => t["ФПД"] === r["Фискальный признак"])) {
						dataStorage.noSuchFPDInTaxcom.documents.push(r);
						r["Тип расчета"].includes("Приход")
							? ((dataStorage.noSuchFPDInTaxcom.totalSum += r["Сумма"]),
							  (dataStorage.noSuchFPDInTaxcom.successfullSells += 1))
							: ((dataStorage.noSuchFPDInTaxcom.refundSum += r["Сумма"]),
							  (dataStorage.noSuchFPDInTaxcom.refundsQuantity += 1));
					}
				});

				taxcom.forEach((tax) => {
					//set data for empty cells
					if (!tax["Наличными"]) tax["Наличными"] = 0;
					if (!tax["Безналичными"]) tax["Безналичными"] = 0;
					if (!tax["Аванс"]) tax["Аванс"] = 0;
					if (!tax["В кредит"]) tax["В кредит"] = 0;

					//check if fpd
					if (fiscal.some((r) => r["Фискальный признак"] === tax["ФПД"])) {
						const transaction = fiscal.filter(
							(r) => r["Фискальный признак"] === tax["ФПД"]
						)[0];
						// check if this bill should or not to have checkbox
						if (!exceptKKT.includes(transaction["Регистрационный номер ККТ"])) {
							transaction[
								"Операция с денежными средствами без передачи товаров"
							] === "Нет"
								? dataStorage.incorrectCheckbox.push(transaction)
								: !transaction[
										"Операция с денежными средствами без передачи товаров"
								  ]
								? dataStorage.incorrectCheckbox.push(transaction)
								: null;
						}
						if (Math.abs(transaction["Сумма"]) !== Math.abs(tax["Сумма"])) {
							dataStorage.notEqualSumsByFPD.push({
								fpd: tax["ФПД"],
								sumFromTaxcom: tax["Сумма"],
								sumFrom1C8: transaction["Сумма"],
								delta: someMath.deltaABS(tax["Сумма"], transaction["Сумма"]),
							});
						} else {
							if (
								Math.abs(tax["Наличными"]) !==
									Math.abs(transaction["Наличные"]) ||
								Math.abs(tax["Безналичными"]) !==
									Math.abs(transaction["Платежная карта"]) ||
								Math.abs(tax["Аванс"]) !=
									Math.abs(transaction["Зачет аванса"]) ||
								Math.abs(tax["В кредит"]) !=
									Math.abs(transaction["Оплата в рассрочку"])
							) {
								dataStorage.notEqualDetailsByFPD.push({
									fpd: tax["ФПД"],
									cash: {
										taxcom: tax["Наличными"],
										fiscal: transaction["Наличные"],
										delta: someMath.deltaABS(
											tax["Наличными"],
											transaction["Наличные"]
										),
									},
									card: {
										taxcom: tax["Безналичными"],
										fiscal: transaction["Платежная карта"],
										delta: someMath.deltaABS(
											tax["Безналичными"],
											transaction["Платежная карта"]
										),
									},
									advance: {
										taxcom: tax["Аванс"],
										fiscal: transaction["Зачет аванса"],
										delta: someMath.deltaABS(
											tax["Аванс"],
											transaction["Зачет аванса"]
										),
									},
									credit: {
										taxcom: tax["В кредит"],
										fiscal: transaction["Оплата в рассрочку"],
										delta: someMath.deltaABS(
											tax["В кредит"],
											transaction["Оплата в рассрочку"]
										),
									},
								});
							}
						}
					} else {
						if (tax["Рег. № ККТ"] === "0002599902020128") {
							dataStorage.onlineShopFromTaxcom.documents.push(tax);
							tax["Сумма"] > 0
								? ((dataStorage.onlineShopFromTaxcom.totalSum += tax["Сумма"]),
								  (dataStorage.onlineShopFromTaxcom.successfullSells += 1))
								: ((dataStorage.onlineShopFromTaxcom.refundSum += tax["Сумма"]),
								  (dataStorage.onlineShopFromTaxcom.refundsQuantity += 1));
						} else if (tax["Рег. № ККТ"] === "0004800423045335") {
							dataStorage.paymentLinksFromTaxcom.documents.push(tax);
							tax["Сумма"] > 0
								? ((dataStorage.paymentLinksFromTaxcom.totalSum +=
										tax["Сумма"]),
								  (dataStorage.paymentLinksFromTaxcom.successfullSells += 1))
								: ((dataStorage.paymentLinksFromTaxcom.refundSum +=
										tax["Сумма"]),
								  (dataStorage.paymentLinksFromTaxcom.refundsQuantity += 1));
						} else {
							dataStorage.unidentifyedByFPDFromTaxcom.documents.push(tax);
							tax["Сумма"] > 0
								? ((dataStorage.unidentifyedByFPDFromTaxcom.totalSum +=
										tax["Сумма"]),
								  (dataStorage.unidentifyedByFPDFromTaxcom.successfullSells += 1))
								: ((dataStorage.unidentifyedByFPDFromTaxcom.refundSum +=
										tax["Сумма"]),
								  (dataStorage.unidentifyedByFPDFromTaxcom.refundsQuantity += 1));
						}
					}
				});
			}

			//GO THROUGH ONLINE
			if (online) {
				online.forEach((o) => {
					o["Дата для сравнения"] = dateConverter.convertOnlineDate(
						o["Дата транзакции"]
					);
					dataStorage.onlineShopFromTaxcom.totalSumByCreditEurope += Number(
						o["Сумма"]
					);
				});
				const max =
					online.length >= dataStorage.onlineShopFromTaxcom.documents.length
						? online
						: dataStorage.onlineShopFromTaxcom.documents;
				const min =
					online.length < dataStorage.onlineShopFromTaxcom.documents.length
						? online
						: dataStorage.onlineShopFromTaxcom.documents;
				const extrasFromMax = max.filter(
					(mx) =>
						!min.some(
							(mn) =>
								mn["Сумма"] === mx["Сумма"] &&
								mn["Дата для сравнения"] === mx["Дата для сравнения"]
						)
				);
				const extrasFromMin = min.filter(
					(mn) =>
						!max.some(
							(mx) =>
								mx["Сумма"] === mn["Сумма"] &&
								mx["Дата для сравнения"] === mn["Дата для сравнения"]
						)
				);

				const extras = extrasFromMax.concat(extrasFromMin);
				dataStorage.onlineShopFromTaxcom.extrasFromTaxcom = extras.filter(
					(o) => o["ФПД"]
				);
				dataStorage.onlineShopFromTaxcom.extrasFromCredit = extras
					.filter((o) => !o["ФПД"])
					.map((el) => {
						return {
							Дата: el["Дата для сравнения"],
							"Номер транзакции": el["Номер транзакции"],
							Сумма: el["Сумма"],
							"ссылка №": el["ссылка №"],
							"Payment ID (STAN)": el["Payment ID (STAN)"],
						};
					});
			}

			//GO THROUGH LINKS
			if (paylinks) {
				paylinks.forEach((l) => {
					l["Дата для сравнения"] = dateConverter.convertPaylinksDate(
						l["Дата оплаты"]
					);
					dataStorage.paymentLinksFromTaxcom.totalSumByCreditEurope += Number(
						l["Сумма"]
					);
				});
				const max =
					paylinks.length > dataStorage.paymentLinksFromTaxcom.documents.length
						? paylinks
						: dataStorage.paymentLinksFromTaxcom.documents;
				const min =
					paylinks.length < dataStorage.paymentLinksFromTaxcom.documents.length
						? paylinks
						: dataStorage.paymentLinksFromTaxcom.documents;
				const extrasFromMax = max.filter(
					(mx) =>
						!min.some(
							(mn) =>
								mn["Сумма"] === mx["Сумма"] &&
								mn["Дата для сравнения"] === mx["Дата для сравнения"]
						)
				);
				const extrasFromMin = min.filter(
					(mn) =>
						!max.some(
							(mx) =>
								mx["Сумма"] === mn["Сумма"] &&
								mx["Дата для сравнения"] === mn["Дата для сравнения"]
						)
				);
				const extras = extrasFromMax.concat(extrasFromMin);
				dataStorage.paymentLinksFromTaxcom.extrasFromTaxcom = extras.filter(
					(o) => o["ФПД"]
				);
				dataStorage.paymentLinksFromTaxcom.extrasFromCredit = extras
					.filter((o) => !o["ФПД"])
					.map((el) => {
						return {
							Дата: el["Дата для сравнения"],
							"Номер заказа": el["Номер заказа"],
							Сумма: el["Сумма"],
							// "ссылка №": el["ссылка №"],
							// "Payment ID (STAN)": el["Payment ID (STAN)"],
						};
					});
			}

			if (sellsXml) {
				const taxcomVAT20 = taxcom.filter(
					(t) => t["НДС 20%"] && t["Тип операции"] === "Приход"
				);
				// console.log(taxcomVAT20);
				const sellsResult = sellsXml.map((xml) => ({
					sum: xml.summ,
					client: xml.clientName,
					docNum: xml.docNum,
          clientInn: xml.clientInn,
					xmlEntries: sellsXml
						.filter((x) => +x.summ == +xml.summ)
						.length.toString(),
					taxcomEntries: taxcomVAT20
						.filter((t) => t["Сумма"] == +xml.summ)
						.length.toString(),
				}));
				sellsResult.forEach((item) => {
					if (item.xmlEntries !== item.taxcomEntries) {
						dataStorage.sellsXmlFromTaxcom.extrasXML.push(item);
					}
				});
				taxcomVAT20.forEach((item) => {
					const suchSumsTaxcomQuantity = taxcomVAT20
						.filter((t) => t["Сумма"] == item["Сумма"])
						.length.toString();
					const suchSumsXMLQuantity = sellsXml
						.filter((x) => +x.summ == item["Сумма"])
						.length.toString();
					if (suchSumsTaxcomQuantity != suchSumsXMLQuantity) {
						dataStorage.sellsXmlFromTaxcom.extrasTaxcom.push(
							Object.assign(item, {
								taxcomEntries: suchSumsTaxcomQuantity,
								xmlEntries: suchSumsXMLQuantity,
							})
						);
					}
				});
				// console.log(sellsResult);
				dataStorage.sellsXmlFromTaxcom.taxcomAmount =
					taxcomVAT20.length.toString();
				dataStorage.sellsXmlFromTaxcom.xmlAmount =
					sellsResult.length.toString();
          dataStorage.sellsXmlFromTaxcom.sellsListFromXML = sellsXml
			}

			//FORMATTING DATA
			dataStorage.noSuchFPDInTaxcom.xlsx =
				dataStorage.noSuchFPDInTaxcom.documents.map((el) => {
					return {
						Дата: el["Дата для сравнения"],
						"Торговый объект": el["Торговый объект"],
						"Документ основание": el["Документ основание"],
						// "Тип документа": el["Тип документа"],
						// "Тип расчета": el["Тип расчета"],
						Сумма: el["Сумма"],
						"Фискальный признак": el["Фискальный признак"],
						"Заводской номер ФН": el["Заводской номер ФН"],
						"Регистрационный номер ККТ": el["Регистрационный номер ККТ"],
						"Номер смены ККМ": el["Номер смены ККМ"],
						"Номер чека ККМ": el["Номер чека ККМ"],
					};
				});
			dataStorage.unidentifyedByFPDFromTaxcom.xlsx =
				dataStorage.unidentifyedByFPDFromTaxcom.documents.map((el) => {
					return {
						Дата: el["Дата для сравнения"],
						"№ смены": el["№ смены"],
						"№ за смену": el["№ за смену"],
						"Тип операции": el["Тип операции"],
						Безналичными: el["Безналичными"],
						Наличными: el["Наличными"],
						Сумма: el["Сумма"],
						"НДС 20/120": el["НДС 20/120"],
						"НДС 20%": el["НДС 20%"],
						Кассир: el["Кассир"],
						"№ ФД": el["№ ФД"],
						ФПД: el["ФПД"],
						"Торговая точка": el["Торговая точка"],
						"Название ККТ": el["Название ККТ"],
						"Зав. № ККТ": el["Зав. № ККТ"],
						"Рег. № ККТ": el["Рег. № ККТ"],
						"Зав. № ФН": el["Зав. № ФН"],
					};
					// el["Дата"] = el["Дата для сравнения"];
					// delete el["Дата для сравнения"];
					// delete el["Дата и время"]
				});
			dataStorage.onlineShopFromTaxcom.extrasFromTaxcomXLS =
				dataStorage.onlineShopFromTaxcom.extrasFromTaxcom.map((el) => {
					return {
						Дата: el["Дата для сравнения"],
						"№ смены": el["№ смены"],
						"№ за смену": el["№ за смену"],
						"Тип операции": el["Тип операции"],
						Безналичными: el["Безналичными"],
						Наличными: el["Наличными"],
						Сумма: el["Сумма"],
						"НДС 20/120": el["НДС 20/120"],
						"НДС 20%": el["НДС 20%"],
						Кассир: el["Кассир"],
						"№ ФД": el["№ ФД"],
						ФПД: el["ФПД"],
						"Торговая точка": el["Торговая точка"],
						"Название ККТ": el["Название ККТ"],
						"Зав. № ККТ": el["Зав. № ККТ"],
						"Рег. № ККТ": el["Рег. № ККТ"],
						"Зав. № ФН": el["Зав. № ФН"],
					};
				});
			dataStorage.onlineShopFromTaxcom.extrasFromCreditXLS =
				dataStorage.onlineShopFromTaxcom.extrasFromCredit.map((el) => {
					return {
						Дата: el["Дата"],
						"Номер транзакции": el["Номер транзакции"],
						Сумма: el["Сумма"],
						"ссылка №": el["ссылка №"],
						"Payment ID (STAN)": el["Payment ID (STAN)"],
					};
				});
			dataStorage.onlineShopFromTaxcom.extrasFromCreditTotalSum =
				dataStorage.onlineShopFromTaxcom.extrasFromCreditXLS
					.map((el) => el["Сумма"])
					.reduce((a, b) => a + b, 0);
			dataStorage.onlineShopFromTaxcom.extrasFromTaxcomTotalSum =
				dataStorage.onlineShopFromTaxcom.extrasFromTaxcomXLS
					.map((el) => el["Сумма"])
					.reduce((a, b) => a + b, 0);
			dataStorage.paymentLinksFromTaxcom.extrasFromCreditTotalSum =
				dataStorage.paymentLinksFromTaxcom.extrasFromCredit
					.map((el) => el["Сумма"])
					.reduce((a, b) => a + b, 0);
			dataStorage.paymentLinksFromTaxcom.extrasFromTaxcomTotalSum =
				dataStorage.paymentLinksFromTaxcom.extrasFromTaxcom
					.map((el) => el["Сумма"])
					.reduce((a, b) => a + b, 0);
			//FINAL COMMIT
			return await commit("setComparedData", dataStorage);
		},
	},
	getters: {
		getTaxcomData: (state) => {
			return state.taxcomData;
		},
		getOnlineResult: (state) => {
			return state.onlineResult;
		},
		getPaylinksResult: (state) => {
			return state.paylinksResult;
		},
		getFiscalResult: (state) => {
			return state.fiscalResult;
		},
		getExceptionsKKT: (state) => {
			return state.exceptKKT;
		},
		getXmlSellings: (state) => {
			return state.xmlSellings;
		},
	},
};
