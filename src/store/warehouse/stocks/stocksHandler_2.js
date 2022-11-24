// import {db} from "../../../main"
export default {
	state: {
		shipment: null,
		error: { shopsDB: { state: false, text: null } },
	},
	mutations: {
		setShipment(state, payload) {
			state.shipment = payload;
		},
	},
	actions: {
		async setShipment({ commit, getters }, payload) {
			const shipment = {};
			const shopsDB = getters.getActualStates.shops;
			// const extra = getters.getExtraAdded;
			// console.log(extra)
			Array.from(payload).forEach((report) => {
				if (
					shopsDB.some(
						(shop) =>
							shop.name.toLowerCase().trim() ===
								report.shop.toLowerCase().trim() && shop.isOpen === "true"
					)
				) {
					const shopData = shopsDB.filter(
						(shop) =>
							shop.name.toLowerCase().trim() ===
							report.shop.toLowerCase().trim()
					)[0];
					report.region = shopData.region;
					report.status = shopData.status;
					report.shipmentTerms = shopData.shipmentTerms;

					//calculate shipment for each shop
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
							? report.f_Cup || 0
							: 0;

					report.shipment.cupPack =
						report.status === "top"
							? report.f_CupPack
							: report.f_CupPack - report.c_CupPack < 0
							? report.f_CupPack
							: report.l_CupPack - report.f_CupPack < 20
							? report.f_CupPack || 0
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
							// : report.l_GreenBaloon < 40 && report.f_GreenBaloon < 40
							// ? report.f_GreenBaloon || 0
							// : 20;
              : report.l_GreenBaloon > 80
                ? 0
                : report.f_GreenBaloon || 0

					report.shipment.grayBaloon =
						report.status === "top"
							? report.f_GrayBaloon
							// : report.l_GrayBaloon < 40 && report.f_GrayBaloon < 40
							// ? report.f_GrayBaloon || 0
							// : 20;
              : report.l_GreenBaloon > 80
                ? 0
                : report.f_GrayBaloon || 0

					report.shipment.stick =
						report.status === "top"
							? report.f_Stick
							: report.l_Stick > 80
							? 0
							: report.f_Stick < 80
							? report.f_Stick || 0
							: 40;
					// : report.l_Stick < 80 && report.f_Stick < 80
					// ? report.f_Stick || 0
					// : 40;

					report.shipment.clamp =
						report.status === "top"
            ? report.f_Clamp
            : report.l_Clamp > 80
            ? 0
            : report.f_Clamp < 80
            ? report.f_Clamp || 0
            : 40;

					shipment[report.region]
						? shipment[report.region].push(report)
						: (shipment[report.region] = [report]);
				} else {
					return commit("setErrorShopsDB", {
						state: true,
						text: `Салона ${report.shop} нет в БД`,
					});
				}
			});
			return await commit("setShipment", shipment);
		},
	},
	getters: {
		getStockShipment: (state) => {
			return state.shipment;
		},
	},
};
