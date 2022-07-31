// import { db } from "../../../main";
export default {
  state: {
    paymentData: [],
    clientsData: [],
  },
  mutations: {
    setPaymentXMLData(state, payload) {
      Array.from(payload).forEach((p) => state.paymentData.push(p));
    },
    setClientsXMLData(state, payload) {
      state.clientsData.push(payload);
    },
  },
  actions: {
    async setClientsInDB({ getters }) {
      const clients = getters.getClientsData;
      clients.length
        ? localStorage.setItem("XMLClients", JSON.stringify(clients))
        : console.log("clients are empty");
    },
    async setPaymentsInDB({ getters }) {
      const payments = getters.getPaymentData;
      // payments.length ? localStorage.setItem("XMLPayments", JSON.stringify(payments)) : console.log("payments are empty")
      if (payments.length) {
        const arr = [];
        const limit = 10000;
        while (payments.length > limit) {
          const sub = payments.splice(0, limit);
          arr.push(sub);
        }
        arr.forEach((sub, s) =>
          localStorage.setItem(`XMLPayments-${s}`, JSON.stringify(sub))
        );
      }
    },
    async setPaymentXMLData(context, payload) {
      // console.log(payload)
      const convert = require("xml-js");
      const json = convert.xml2json(payload, { compact: true, spaces: 2 });
      const object = JSON.parse(json);
      const rawDate = object.Export.Docs.Doc;
      const formattedDate = rawDate.map((o) => ({
        Дата_Доставки: o.Data._text,
        Тип_Документа: o.DocType._text,
        Номер: o.Number._text,
        Статус_Документа: o.StatusDoc._text,
        Сумма: o.Summ._text,
        Дата_Заявки: o.ZayavkaDate._text,
        Номер_Заявки: o.ZayavkaNumber._text,
        UID_Заявки: o.ZayavkaUID._text,
      }));
      // console.log(formattedDate);
      // for (let i = 0; i <= formattedDate.length; i += 1000) {
      //   const sub = formattedDate.splice(i, 1000);
      //   await db
      //   .collection("XMLPayments").doc(Date.now().toString())
      //   .set({ json: JSON.stringify(sub) });
      // }


      // localStorage.setItem(`XMLPayments-${Date.now()}`, JSON.stringify(formattedDate))
      return await context.commit("setPaymentXMLData", formattedDate);
    },
    async setClientsXMLData({ getters, commit }, payload) {
      const paymentData = getters.getPaymentData;
      if (!paymentData) return;
      const convert = require("xml-js");
      const json = convert.xml2json(payload, { compact: true, spaces: 2 });
      const object = JSON.parse(json);
      const rawDate = object.Doc;
      Object.keys(rawDate).forEach((key) => {
        // if (!rawDate[key]._text) delete rawDate[key];
        rawDate[key]._text
          ? (rawDate[key] = rawDate[key]._text)
          : delete rawDate[key];
      });
      const formattedDate = [rawDate].map((o) => ({
        ФИО: `${o.KlientF} ${o.KlientI} ${o.KlientO}`,
        Телефон: `${o.KlientPhonKod}${o.KlientPhonNach}${o.KlientPhonKon}`,
        Email: o.KlientMail,
        Представитель: o.Delegate,
        Машина: o.transport ? o.transport : `-`,
        Комментарий: o.Komment ? o.Komment : `-`,
        UID_Заявки: o.UIDInvoice,
        Дата_Доставки: o.plandatedost,
        Дата_Отгрузки: o.plandateotgr,
        Номер_Заявки: o.numdoc77,
        Дата_Заявки: o.datedoc77,
        Номер_Документа_поКлиенту: o.DocNum,
      }));
      return await commit("setClientsXMLData", formattedDate[0]);
    },
  },
  getters: {
    getPaymentData: (state) => {
      return state.paymentData;
    },
    getClientsData: (state) => {
      return state.clientsData;
    },
  },
};
