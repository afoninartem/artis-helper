export default {
	state: {
    filteredPositions: [],
    filteredEmployees: [],
  },
	mutations: {
    addPosition(state, payload) {
      state.filteredPositions = payload
    }
  },
	actions: {
    async addPosition(context, payload) {
      
    },
  },
	getters: {},
};
