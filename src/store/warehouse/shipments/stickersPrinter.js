export default {
	state: {
		stickers: {
			msc: {},
			spb: {},
      nn: {},
      spbnn: {}
		},
	},
	mutations: {
		addSticker(state, payload) {
      state.stickers[payload.region][payload.shop]
        ? state.stickers[payload.region][payload.shop].stickers = payload.stickers
        : state.stickers[payload.region][payload.shop] = payload
		},
		deleteSticker(state, payload) {
      state.stickers[payload.region][payload.shop]
        ? delete state.stickers[payload.region][payload.shop]
        : null
		},
	},
	actions: {
		async addSticker(context, payload) {
			return await context.commit("addSticker", payload);
		},
		async deleteSticker(context, payload) {
			return await context.commit("deleteSticker", payload);
		},
	},
	getters: {
		getStickers(state) {
			return state.stickers;
		},
	},
};
