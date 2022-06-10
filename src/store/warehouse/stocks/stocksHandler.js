export default {
	state: {
		stockReportArray: [],
		noSuchShopInDB: [],
		noReportForShops: [],
		shopsRegionInfo: null,
		summary: {
			moscow: {
				poster: 0,
				vip: 0,
				vipPack: 0,
				cup: 0,
				cupPack: 0,
				vine: 0,
				chocoSet: 0,
				chest: 0,
				choco5: 0,
				candy: 0,
				leaflet: 0,
				greenBaloon: 0,
				grayBaloon: 0,
				clamp: 0,
				stick: 0,
				// allAdultGifts: 0,
				// maleGifts: 0,
				// femaleGifts: 0,
				// kidsGifts: 0,
				// papers: 0,
			},
			other: {
				poster: 0,
				vip: 0,
				vipPack: 0,
				cup: 0,
				cupPack: 0,
				vine: 0,
				chocoSet: 0,
				chest: 0,
				choco5: 0,
				candy: 0,
				leaflet: 0,
				greenBaloon: 0,
				grayBaloon: 0,
				clamp: 0,
				stick: 0,
				// allAdultGifts: 0,
				// maleGifts: 0,
				// femaleGifts: 0,
				// kidsGifts: 0,
				// papers: 0,
			},
		},

		tableColumns: {
			//можно указать просто null или []
			allAdultGifts: false,
			maleGifts: false,
			femaleGifts: false,
			kidsGifts: false,
			papers: false,
		},
		showTable: false,
	},
	mutations: {
		setSummary(state, payload) {
			state.summary = payload;
		},
		setStateData(state, payload) {
			state.stockReportArray = payload.stockReportArray;
			state.noSuchShopInDB = payload.noSuchShopInDB;
			state.noReportForShops = payload.noReportForShops;
		},


		setInfoToVuex(state, payload) {
			state.tableColumns = payload;
		},
		showTable(state) {
			state.showTable = true;
		},
	},
	actions: {
		async showTable(context) {
			return await context.commit("showTable");
		},
		async setInfoToVuex(context, payload) {
			return await context.commit("setInfoToVuex", payload);
		},
		async stockHandler(context, payload) {
			const stockReportArray = [];
			const noSuchShopInDB = [];
			const noReportForShops = [];
			const shopsDetails = JSON.parse(localStorage.getItem("actualShops"));
			const summary = {
				moscow: {
					poster: 0,
					vip: 0,
					vipPack: 0,
					cup: 0,
					cupPack: 0,
					vine: 0,
					chocoSet: 0,
					chest: 0,
					choco5: 0,
					candy: 0,
					leaflet: 0,
					greenBaloon: 0,
					grayBaloon: 0,
					clamp: 0,
					stick: 0,
					allAdultGifts: 0,
					maleGifts: 0,
					femaleGifts: 0,
					kidsGifts: 0,
					papers: 0,
				},
				other: {
					poster: 0,
					vip: 0,
					vipPack: 0,
					cup: 0,
					cupPack: 0,
					vine: 0,
					chocoSet: 0,
					chest: 0,
					choco5: 0,
					candy: 0,
					leaflet: 0,
					greenBaloon: 0,
					grayBaloon: 0,
					clamp: 0,
					stick: 0,
					allAdultGifts: 0,
					maleGifts: 0,
					femaleGifts: 0,
					kidsGifts: 0,
					papers: 0,
				},
			};
			//check if all shops has reports in google sheet
			shopsDetails.forEach((shop) => {
				if (
					!payload.map((el) => el.shop).some((el) => el === shop.name) &&
					!shop.name.includes("_")
				) {
					noReportForShops.push(shop.name);
				}
			});
			payload.forEach((report) => {
				//check if shopsDB includes all shops
				const shopDetails = shopsDetails.filter(
					(shop) => shop.name === report.shop
				)[0];
				if (shopDetails) {
					report.region = shopDetails.region;
					report.status = shopDetails.status;
				} else {
					noSuchShopInDB.push(report.shop);
				}

				report.shipment = {};

				report.shipment.poster = report.f_Poster;

				report.shipment.vip =
					report.status === "top"
						? report.l_Vip < 40
							? 40 - report.l_Vip
							: 0
						: report.l_Vip < 10
						? 10 - report.l_Vip
						: 0;

				report.shipment.vipPack =
					report.status === "top"
						? report.l_VipPack < 40
							? 40 - report.l_VipPack
							: 0
						: report.l_VipPack < 10
						? 10 - report.l_VipPack
						: 0;

				report.shipment.cup =
					report.status === "top"
						? report.f_Cup
						: report.f_Cup - report.c_Cup < 0
						? report.f_Cup
						: report.l_Cup - report.f_Cup < 20
						? report.f_Cup
						: 0;

				report.shipment.cupPack =
					report.status === "top"
						? report.f_CupPack
						: report.f_CupPack - report.c_CupPack < 0
						? report.f_CupPack
						: report.l_CupPack - report.f_CupPack < 20
						? report.f_CupPack
						: 0;

				report.shipment.vine =
					report.status === "top"
						? report.f_Vine % 6
							? Math.ceil(report.f_Vine / 6) * 6
							: report.f_Vine || 0
						: report.c_Vine < report.f_Vine
						? Math.ceil(report.c_Vine / 6) * 6 === 0
							? 6
							: Math.ceil(report.f_Vine / 6) * 6 || 0
						: Math.floor(report.f_Vine / 6) * 6 || 0;

				report.shipment.chocoSet =
					report.status === "top"
						? report.f_ChocoSet
						: report.f_ChocoSet > report.c_ChocoSet
						? report.c_ChocoSet
						: report.f_ChocoSet || 0;

				report.shipment.chest =
					report.status === "top"
						? report.f_Chest
						: report.f_Chest > 30
						? 30
						: report.f_Chest || 0;

				report.shipment.choco5 =
					report.status === "top"
						? report.f_Choco5 < 10
							? (report.f_Choco5 *= 250)
							: report.f_Choco5 % 250
							? Math.ceil(report.f_Choco5 / 250) * 250
							: report.f_Choco5
						: Math.ceil(report.c_Choco5 / 250) * 250 || 0;

				report.shipment.candy =
					report.status === "top"
						? report.f_Candy
						: report.c_Candy < report.f_Candy
						? report.c_Candy
						: report.f_Candy || 0;

				if (report.shipment.candy < 0.5) report.shipment.candy = 0.5;

				report.shipment.leaflet = report.f_Leaflet
					? Math.ceil(report.f_Leaflet / 100) * 100
					: 0;

				report.shipment.greenBaloon =
					report.status === "top"
						? report.f_GreenBaloon
						: report.l_GreenBaloon < 40 && report.f_GreenBaloon < 40
						? report.f_GreenBaloon
						: 20;

				report.shipment.grayBaloon =
					report.status === "top"
						? report.f_GrayBaloon
						: report.l_GrayBaloon < 40 && report.f_GrayBaloon < 40
						? report.f_GrayBaloon
						: 20;

				report.shipment.stick =
					report.status === "top"
						? report.f_Stick
						: report.l_Stick < 80 && report.f_Stick < 80
						? report.f_Stick
						: 40;

				report.shipment.clamp =
					report.status === "top"
						? report.f_Clamp
						: report.l_Clamp < 80 && report.f_Clamp < 80
						? report.f_Clamp
						: 40;

				stockReportArray.push(report);
				for (let ship in report.shipment) {
					summary[report.region][ship] += +report.shipment[ship];
				}
			});
			await context.commit("setSummary", summary);
			await context.commit("setStateData", {
				stockReportArray,
				noSuchShopInDB,
				noReportForShops,
			});
		},
	},
	getters: {
		getReportsData: (state) => {
			return state.stockReportArray;
		},
		getShowTable: (state) => {
			return state.showTable;
		},
		getTableColumns: (state) => {
			return state.tableColumns;
		},
		getSummaryShipment: (state) => {
			return state.summary;
		},
		getBothDataAndSummary: (state) => {
			return { summary: state.summary, data: state.stockReportArray };
		},
	},
};
