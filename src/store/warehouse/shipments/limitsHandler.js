import { db } from "../../../main";
export default {
	state: {
    outOfLimits: [],
    actualLimitsInHandler: null,
  },
	mutations: {
    checkMaterial(state, payload) {
      if (state.actualLimitsInHandler.some(l => l.name === payload.name)) {
        if (state.actualLimitsInHandler.filter(l => l.name === payload.name)[0].limit < payload.quan) {
          state.outOfLimits.push(payload)
        }
      } 
    },
    setActualLimitsInLimitHandler(state, payload) {
      state.actualLimitsInHandler = payload
    }
  },
	actions: {
    async addMinimalLeftover(context, payload) {
      return await db.collection("warehouse/shipment/leftovers").doc(payload.id).set(payload)
    },
		async addLimit(context, payload) {
			return await db
				.collection("warehouse/shipment/limits")
				.doc(payload.id)
				.set(payload);
		},
		async updateLimit(context, payload) {
			return await db
				.collection("warehouse/shipment/limits")
				.doc(payload.id)
				.update({ limit: payload.limit });
		},
		async deleteLimit(context, payload) {
			return await db
				.collection("warehouse/shipment/limits")
				.doc(payload)
				.delete();
		},
    async checkMaterial(context, payload) {
      return await context.commit("checkMaterial", payload)
    },
    async setActualLimitsInLimitHandler(context, payload) {
      return await context.commit("setActualLimitsInLimitHandler", payload)
    }
	},
	getters: {
    getOutOfLimits: state => {
      return state.outOfLimits
    }
  },
};
