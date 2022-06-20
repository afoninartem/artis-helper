import { db } from "../../main";
export default {
  state: {
    addVacancyPopupVisibility: false,
    addCandidatePopupVisibility: false,
    changeCommentPopupVisibility: false,
    statusesPopupVisibility: false,
    statusesPopupBgColor: null,
    currentCandidateID: null,
    currentVacancyID: null,
    candidateStatusList: [
      {
        status: "Самоотказ до собеседования",
        bgColor: "pink",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Самоотказ после собеседования",
        bgColor: "pink",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Отказ до собеседования",
        bgColor: "pink",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Отказ после собеседования",
        bgColor: "pink",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Собеседование",
        bgColor: "rgb(154, 106, 187)",
        updateDate: 1,
        datetime: null,
      },
      {
        status: "2-й этап собеседования",
        bgColor: "rgba(76, 20, 114)",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Пробный день",
        bgColor: "rgb(84, 143, 219)",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Внесён в 1С",
        bgColor: "rgb(122, 212, 122)",
        updateDate: 0,
        datetime: null,
      },
      {
        status: "Оформление",
        bgColor: "rgb(209, 211, 113)",
        updateDate: 0,
        datetime: null,
      },
    ],
  },
  mutations: {
    //VACANCIES
    openAddVacancyPopup(state) {
      state.addVacancyPopupVisibility = true;
    },
    closeAddVacancyPopup(state) {
      state.addVacancyPopupVisibility = false;
    },
    //CANDIDATES
    openAddCandidatePopup(state, payload) {
      state.addCandidatePopupVisibility = true;
      state.currentVacancyID = payload;
    },
    closeAddCandidatePopup(state) {
      state.addCandidatePopupVisibility = false;
    },
    //COMMENT
    openChangeCommentPopupVisibility(state, payload) {
      state.changeCommentPopupVisibility = true;
      state.currentCandidateID = payload;
    },
    closeChangeCommentPopupVisibility(state) {
      state.changeCommentPopupVisibility = false;
      state.currentCandidateID = null;
    },
    //STATUSES
    openStatusPopup(state, payload) {
      state.statusesPopupVisibility = true;
      state.currentCandidateID = payload.candidateID;
      state.statusesPopupBgColor = payload.bgColor;
    },
    closeStatusPopup(state) {
      state.statusesPopupVisibility = false;
    },
  },
  actions: {
    //VACANCIES
    async openAddVacancyPopup(context) {
      return await context.commit("openAddVacancyPopup");
    },
    async closeAddVacancyPopup(context) {
      return await context.commit("closeAddVacancyPopup");
    },
    async addVacancy(context, payload) {
      payload.id = Date.now().toString();
      // payload.created = payload.id;
      payload.openDate = payload.id;
      payload.pauseDate = null;
      payload.closeDate = null;
      await db
        .collection("personal/hiring/vacancies")
        .doc(payload.id)
        .set(payload);
      // await db.collection(`personal/hiring/vacancies/${payload.id}/candidates`)
    },
    async updateVacancyStatus(context, payload) {
      console.log(payload);
      const test = {};
      test.status = payload.status;
      const statusDate =
        payload.status === "Пауза"
          ? "pauseDate"
          : payload.status === "Закрыта"
          ? "closeDate"
          : null;
      test[statusDate] = Date.now().toString();
      console.log(test);
      return await db
        .collection("personal/hiring/vacancies")
        .doc(payload.vacancyID)
        .update({
          status: payload.status,
          [statusDate]: Date.now().toString(),
        });
    },
    // async moderateVacancies({getters}) {
    // 	const vacancies = getters.getActualStates.vacancies;
    // 	Array.from(vacancies).forEach(async v => {
    // 		v.openDate = v.id
    // 		v.pauseDate = null;
    // 		v.closeDate = null;
    // 		delete v["created"]
    // 		console.log(v)
    // 	await	db.collection("personal/hiring/vacancies").doc(v.id).set(v)
    // 	})
    // },
    //CANDIDATES
    async openAddCandidatePopup(context, payload) {
      return await context.commit("openAddCandidatePopup", payload);
    },
    async closeAddCandidatePopup(context) {
      return await context.commit("closeAddCandidatePopup");
    },
    async openChangeCommentPopupVisibility(context, payload) {
      return await context.commit("openChangeCommentPopupVisibility", payload);
    },
    async closeChangeCommentPopupVisibility(context) {
      return await context.commit("closeChangeCommentPopupVisibility");
    },
    async addCandidate({ getters }, payload) {
      payload.candidateID = Date.now().toString();
      payload.vacancyID = getters.getCurrentVacancyID;
      const currentVacancy = getters.getActualStates.vacancies.filter(
        (v) => v.id === payload.vacancyID
      )[0];
      payload.title = currentVacancy.title;
      payload.supervisor = currentVacancy.supervisor;
      payload.department = currentVacancy.department;
      payload.statuslist = Array.from(getters.getCandidateStatusList);
      payload.statuslist.filter(
        (s) => s.status === "Собеседование"
      )[0].datetime = payload.datetime;

      await db
        .collection("personal/hiring/candidates")
        .doc(payload.candidateID)
        .set(payload);
    },
    async setNewDates(context, payload) {
      const filtered = payload.statuslist.filter((s) => s.updateDate);
      console.log("filtered:", filtered);
      const lastStatus = filtered.sort(
        (a, b) =>
          new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
      )[0];
      console.log("lastStatus", lastStatus);
      await db
        .collection("personal/hiring/candidates")
        .doc(payload.candidateID)
        .update({
          statuslist: payload.statuslist,
          status: lastStatus.status,
          datetime: lastStatus.datetime,
        });
    },
    //statuses are deprecated ↓
    async changeCandidateStatus(context, payload) {
      await db
        .collection("personal/hiring/candidates")
        .doc(payload.candidateID)
        .update({ status: payload.newStatus });
    },
    async changeCandidateDate(context, payload) {
      await db
        .collection("personal/hiring/candidates")
        .doc(payload.id)
        .update({ datetime: payload.value });
    },
    async changeCandidateComment(context, payload) {
      await db
        .collection("personal/hiring/candidates")
        .doc(payload.id)
        .update({ comment: payload.comment });
    },
    async openStatusPopup(context, payload) {
      return await context.commit("openStatusPopup", payload);
    },
    async closeStatusPopup(context) {
      return await context.commit("closeStatusPopup");
    },
    async deleteCandidate(context, payload) {
      await db
        .collection("personal/hiring/candidates")
        .doc(payload.toString())
        .delete();
    },
    //technical developer actions ↓
    // async addStatusList({ getters }) {
    // 	const candidates = getters.getActualStates.candidates;
    // 	candidates.forEach(async (candidate) => {
    // 		if (!candidate.statuslist) {
    // 			candidate.statuslist = getters.getCandidateStatusList;
    // 		}
    // 		candidate.statuslist.forEach((item) => {
    // 			if (!item.updateDate) {
    // 				item.updateDate = item.datetime
    // 					? new Date(item.datetime).getTime()
    // 					: 0;
    // 			}
    // 		});
    //     await db.collection("personal/hiring/candidates").doc(candidate.candidateID).update({statuslist: candidate.statuslist})
    // 	});
    // },
  },
  getters: {
    getAddVacancyPopupVisibility: (state) => {
      return state.addVacancyPopupVisibility;
    },
    getAddCandidatePopupVisibility: (state) => {
      return state.addCandidatePopupVisibility;
    },
    getCurrentVacancyID: (state) => {
      return state.currentVacancyID;
    },
    getCurrentCandidateID: (state) => {
      return state.currentCandidateID;
    },
    getCandidateStatusList: (state) => {
      return state.candidateStatusList;
    },
    getChangeCommentPopupVisibility: (state) => {
      return state.changeCommentPopupVisibility;
    },
    getStatusesPopupVisibility: (state) => {
      return state.statusesPopupVisibility;
    },
    getStatusesPopupBgColor: (state) => {
      return state.statusesPopupBgColor;
    },
  },
};
