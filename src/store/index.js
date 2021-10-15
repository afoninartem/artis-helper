import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import createUser from "./admin/createUser";
import createShop from "./admin/createShop";
import shipmentsHandler from "./warehouse/shipments/shipmentsHandler";
import tableHandler from "./warehouse/shipments/tableHandler";
import storageHandler from "./warehouse/storage/storageHandler";
import leftoversHandler from "./warehouse/shipments/leftoversHandler";
import cardsHandler from "./marketing/cards/cardsHandler";
import getShopsInfo from "./marketing/cards/getShopsInfo";
import addPriceItems from "./marketing/price/addPriceItems";
import AddPriceItemsDetailsByName from "./marketing/price/AddPriceItemsDetailsByName";
import firebase from "firebase/app";
import { db } from "../main";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: localStorage.getItem("RT")
      ? JSON.parse(localStorage.getItem("RT"))
      : null,
    sidebarIsOpen: false,
    indentRight: localStorage.getItem("currentIndent")
      ? JSON.parse(localStorage.getItem("currentIndent"))
      : 1,
    departments: [
      {
        name: "maintenance",
        state: false,
        title: "АХО",
        services: [
          {
            name: "dinners",
            link: "/dinners",
            title: "Обеды",
          },
        ],
      },
      {
        name: "marketing",
        state: false,
        title: "Реклама",
        services: [
          {
            name: "cards",
            link: "/cards",
            title: "Визитки",
          },
          {
            name: "needs",
            link: "/needs",
            title: "Потребность",
          },
          {
            name: "price",
            link: "/price",
            title: "Прайс",
          },
        ],
      },
      {
        name: "personal",
        state: false,
        title: "Персонал",
        services: [
          {
            name: "timetracking",
            link: "/timetracking",
            title: "УРВ",
          },
        ],
      },
      {
        name: "warehouse",
        state: false,
        title: "Склад",
        services: [
          {
            name: "stocks",
            link: "/stocks",
            title: "Акции",
          },
          {
            name: "komus",
            link: "/komus",
            title: "Комус",
          },
          {
            name: "incomes",
            link: "/incomes",
            title: "Поступления",
          },
          {
            name: "shipments",
            link: "/shipments",
            title: "Отгрузки",
          },
          {
            name: "packages",
            link: "/packages",
            title: "Упаковка",
          },
          {
            name: "storage",
            link: "/storage",
            title: "Хранение",
          },
        ],
      },
      {
        name: "admin",
        state: false,
        title: "Админка",
        services: [
          {
            name: "add-user",
            link: "/add-user",
            title: "Add user",
          },
          {
            name: "add-users",
            link: "/add-users",
            title: "Add users",
          },
          {
            name: "add-shops",
            link: "/add-shops",
            title: "Add shops",
          },
          {
            name: "delete-users",
            link: "/delete-users",
            title: "Delete users",
          },
        ],
      },
    ],
  },
  mutations: {
    nullUser(state) {
      state.user = null;
    },
    setCurrentUser(state) {
      const currentEmail = firebase.auth().currentUser.email;
      // const db = firebase.firestore();
      db.collection("users")
        .doc(`${currentEmail}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            state.user = { email: doc.data().email, group: doc.data().group };
            localStorage.setItem("RT", JSON.stringify(state.user));
          } else {
            alert(`Не существует пользователя ${currentEmail}`);
          }
        })
        .catch((error) => console.log(error));
    },
    getCurrentUser(state) {
      state.user = JSON.parse(localStorage.getItem("RT"));
    },
    toggleSidebar(state) {
      state.sidebarIsOpen = false;
      state.sidebarIsOpen = !state.sidebarIsOpen;
    },
    hideSidebar(state) {
      state.sidebarIsOpen = false;
    },
    pickSidebarContent(state, payload) {
      state.departments.forEach((dept, i) => {
        dept.name === payload.dept && dept.state === false
          ? ((dept.state = true),
            (state.indentRight = (payload.length - i - 1) * 150),
            localStorage.setItem(
              "currentIndent",
              JSON.stringify((payload.length - i - 1) * 150)
            ))
          : (dept.state = false);
      });
    },
  },
  actions: {
    async setCurrentCar(context, payload) {
      return await context.commit("setCurrentCar", payload);
    },
    async setCurrentUser(context) {
      return await context.commit("setCurrentUser");
    },
    async getCurrentUser(context) {
      return await context.commit("getCurrentUser");
    },
    toggleSidebar(context) {
      return context.commit("toggleSidebar");
    },
    pickSidebarContent(context, payload) {
      return context.commit("pickSidebarContent", payload);
    },
    signOut(context) {
      return context.commit("signOut");
    },
  },
  getters: {
    pickList: (state) => {
      const activeBtn = Array.from(state.departments).filter(
        (el) => el.state === true
      )[0];
      if (activeBtn !== undefined) {
        return activeBtn.services;
      }
      return null;
    },
    getSidebarState: (state) => {
      return state.sidebarIsOpen;
    },
    getIndent: (state) => {
      return state.indentRight;
    },
    // ↓ getter getCurrentUser is for Navbar.vue
    getCurrentUser: (state) => {
      return state.user;
    },
    getDepartments: (state) => {
      if (state.user) {
        if (state.user.group === "admin") {
          return state.departments;
        } else {
          const permissions = state.departments.filter(
            (d) => d.name === state.user.group
          );
          return permissions;
        }
      }
    },
  },
  modules: {
    auth,
    createUser,
    createShop,
    getShopsInfo,
    leftoversHandler,
    shipmentsHandler,
    tableHandler,
    storageHandler,
    cardsHandler,
    addPriceItems,
    AddPriceItemsDetailsByName,
  },
});
