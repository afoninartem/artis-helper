import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import updatesHandler from "./updatesHandler";
import createUser from "./admin/createUser";
import createShop from "./admin/createShop";
import shopsHandler from "./admin/shopsHandler";
import sudokuHandler from "./admin/sudokuHandler";
import shipmentsHandler from "./warehouse/shipments/shipmentsHandler";
import stickersPrinter from "./warehouse/shipments/stickersPrinter";
import storageHandler from "./warehouse/storage/storageHandler";
import packagesHandler from "./warehouse/shipments/packagesHandler";
import leftoversHandler from "./warehouse/shipments/leftoversHandler";
import cardsHandler from "./marketing/cards/cardsHandler";
import getShopsInfo from "./marketing/cards/getShopsInfo";
import addPriceItems from "./marketing/price/addPriceItems";
import ordersHandler from "./warehouse/shipments/ordersHandler";
import stoplistHandler from "./warehouse/shipments/stoplistHandler";
import limitsHandler from "./warehouse/shipments/limitsHandler";
import stocksHandler from "./warehouse/stocks/stocksHandler";
import stocksHandler_2 from "./warehouse/stocks/stocksHandler_2";
import employeesHandler from "./warehouse/stocks/employeesHandler";
import employeesHandler_2 from "./warehouse/stocks/employeesHandler_2";
import _incomesHandler from "./warehouse/incomes/_incomesHandler";
import firstReportHandler from "./warehouse/incomes/firstReportHandler";
import secondReportHandler from "./warehouse/incomes/secondReportHandler";
import thirdReportHandler from "./warehouse/incomes/thirdReportHandler";
import komusHandler from "./warehouse/komus/komusHandler";
import positionsHandler from "./warehouse/positions/positionsHandler";
import hiringReportHandler from "./personal/hiringReportHandler";
import timetrackingHandler from "./personal/timetrackingHandler";
import employeesForDinnersHandler from "./maintenance/employeesForDinnersHandler";
import senesysHandler from "./maintenance/senesysHandler";
import freeEaters from "./maintenance/freeEaters";
import komusCompareReportHandler from "./maintenance/komusCompareReportHandler";
import AddPriceItemsDetailsByName from "./marketing/price/AddPriceItemsDetailsByName";
import taxcomHandler from "./accounting/taxcomHandler";
import fiscalHandler from "./accounting/fiscalHandler";
import onlineShopHandler from "./accounting/onlineShopHandler";
import payLinksHandler from "./accounting/payLinksHandler";
import xml2json from "./accounting/xml/xml2json";
import needsHandler from "./marketing/warehouse-needs/needsHandler";
import vacanciesHandler from "./personal/vacanciesHandler";
import catalogPersonalHandler from "./personal/catalogPersonalHandler";
import driversTimeSheetHandler from "./personal/driversTimeSheetHandler";
import driverExtraPopupHandler from "./service/driverExtraPopupHandler";
import serviceCatalogHandler from "./service/serviceCatalogHandler";
import carDataPopupHandler from "./service/carDataPopupHandler";
import carCrewPopupHandler from "./service/carCrewPopupHandler";
import shedulePopupHandler from "./service/shedulePopupHandler";
import stockReportHandler from "./retail/stockReportHandler";
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
        name: "retail",
        state: false,
        title: "??????????????",
        services: [
          {
            name: "stock-report",
            link: "/stock-report",
            title: "?????????? ???? ??????????",
            permissions: ["retail"],
          },
        ],
      },
      {
        name: "service",
        state: false,
        title: "????????????",
        services: [
          {
            name: "today-working-service",
            link: "/today-working-service",
            title: "?????????????? ????????????????",
            permissions: ["service", "personal"],
          },
          {
            name: "drivers-cars-catalog",
            link: "/drivers-cars-catalog",
            title: "???????????????????? ????",
            permissions: ["service", "personal"],
          },
          // {
          //   name: "service-calendar",
          //   link: "/service-calendar",
          //   title: "??????????????????",
          //   permissions: ["service", "personal"],
          // },
        ],
      },
      {
        name: "accounting",
        state: false,
        title: "??????????????",
        services: [
          {
            name: "taxcom",
            link: "/taxcom-check",
            title: "Taxcom",
            permissions: ["accounting"],
          },
          // {
          //   name: "client-payments-xml",
          //   link: "/client-payments-xml",
          //   title: "XML2XLS",
          //   permissions: ["accounting"],
          // },
        ],
      },
      {
        name: "maintenance",
        state: false,
        title: "??????",
        services: [
          {
            name: "komus-report",
            link: "/komus-report",
            title: "??????????",
            permissions: ["maintenance"],
          },
          {
            name: "dinners",
            link: "/dinners",
            title: "??????????",
            permissions: ["maintenance"],
          },
          {
            name: "freeEaters",
            link: "/free-eaters",
            title: "????????????????????",
            permissions: ["maintenance"],
          },
        ],
      },
      {
        name: "marketing",
        state: false,
        title: "??????????????",
        services: [
          // {
          // 	name: "cards",
          // 	link: "/cards",
          // 	title: "??????????????",
          // 	permissions: ["marketing"],
          // },
          {
            name: "needs",
            link: "/warehouse-needs",
            title: "??????????????????????",
            permissions: ["marketing"],
          },
          {
            name: "price",
            link: "/price",
            title: "??????????",
            permissions: ["marketing"],
          },
        ],
      },
      {
        name: "personal",
        state: false,
        title: "????????????????",
        services: [
          {
            name: "timetracking",
            link: "/time-tracking",
            title: "??????",
            permissions: ["personal"],
          },
          {
            name: "drivers-timetracking",
            link: "/drivers-timetracking",
            title: "????????????????",
            permissions: ["personal"],
          },
          {
            name: "hiringreport",
            link: "/hiring-report",
            title: "????????????",
            permissions: ["recruitment"],
          },
          {
            name: "WeeklyReqruitmentReport",
            link: "/weekly-reqruitment-report",
            title: "???????????? ???? ??????????????",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "hiringreport-new",
            link: "/hiring-report-new",
            title: "???????????? ???? ????????????????????",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "hiringreport-result",
            link: "/hiring-report-result",
            title: "???????????? ???? ??????????????????",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "vacancies",
            link: "/vacancies",
            title: "????????????????",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "catalog-personal",
            link: "/catalog-personal",
            title: "????????????????????",
            permissions: ["recruitment", "personal"],
          },
        ],
      },
      {
        name: "warehouse",
        state: false,
        title: "??????????",
        services: [
          {
            name: "stocks",
            link: "/stocks",
            title: "??????????",
            permissions: ["warehouse"],
          },
          {
            name: "stocks-new",
            link: "/stocks-new",
            title: "?????????? new",
            permissions: ["admin"],
          },
          {
            name: "komus",
            link: "/komus",
            title: "??????????",
            permissions: ["warehouse"],
          },
          {
            name: "cards-and-stickers",
            link: "/cards-and-stickers",
            title: "??????????????",
            permissions: ["warehouse", "marketing"],
          },
          {
            name: "incomes",
            link: "/incomes",
            title: "??????????????????????",
            permissions: ["warehouse"],
          },
          {
            name: "shipments",
            link: "/shipments",
            title: "????????????????",
            permissions: ["warehouse"],
          },
          {
            name: "stickers",
            link: "/stickers",
            title: "??????????????",
            permissions: ["warehouse"],
          },
          {
            name: "leftovers",
            link: "/leftovers",
            title: "??????????????",
            permissions: ["warehouse"],
          },
          {
            name: "stop-list",
            link: "/stop-list",
            title: "????????-????????",
            permissions: ["warehouse"],
          },
          {
            name: "limits",
            link: "/limits",
            title: "????????????",
            permissions: ["warehouse"],
          },
          {
            name: "orders",
            link: "/orders",
            title: "????????????",
            permissions: ["warehouse"],
          },
          {
            name: "packages",
            link: "/packages",
            title: "????????????????",
            permissions: ["warehouse"],
          },
          {
            name: "storage",
            link: "/storage",
            title: "????????????????",
            permissions: ["warehouse"],
          },
          {
            name: "colors",
            link: "/colors",
            title: "??????????",
            permissions: ["warehouse"],
          },
          {
            name: "positions",
            link: "/positions",
            title: "??????????????????",
            permissions: ["warehouse"],
          },
        ],
      },
      {
        name: "admin",
        state: false,
        title: "??????????????",
        services: [
          {
            name: "add-user",
            link: "/add-user",
            title: "Add user",
            permissions: ["admin"],
          },
          {
            name: "add-users",
            link: "/add-users",
            title: "Add users",
            permissions: ["admin"],
          },
          {
            name: "add-shops",
            link: "/add-shops",
            title: "Add shops",
            permissions: ["admin"],
          },
          {
            name: "admin-shops",
            link: "/admin-shops",
            title: "????????????",
            permissions: ["admin"],
          },
          {
            name: "delete-users",
            link: "/delete-users",
            title: "Delete users",
            permissions: ["admin"],
          },
          {
            name: "sudoku",
            link: "/sudoku",
            title: "Sudoku",
            permissions: ["admin"],
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
      db.collection("users")
        .doc(`${currentEmail}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            state.user = { email: doc.data().email, group: doc.data().group };
            localStorage.setItem("RT", JSON.stringify(state.user));
          } else {
            alert(`???? ???????????????????? ???????????????????????? ${currentEmail}`);
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
      state.sidebarIsOpen = true;
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
    // ??? getter getCurrentUser is for Navbar.vue
    getCurrentUser: (state) => {
      return state.user;
    },
    getDepartments: (state) => {
      if (state.user) {
        // return state.departments;
        if (state.user.group === "admin") {
          return state.departments;
        } else {
          const permissions = state.departments
            .map((el) =>
              el.services.filter((s) =>
                s.permissions.includes(state.user.group)
              )
            )
            .flat();
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
    storageHandler,
    packagesHandler,
    cardsHandler,
    addPriceItems,
    AddPriceItemsDetailsByName,
    updatesHandler,
    stickersPrinter,
    ordersHandler,
    stoplistHandler,
    limitsHandler,
    stocksHandler,
    stocksHandler_2,
    employeesHandler,
    _incomesHandler,
    firstReportHandler,
    secondReportHandler,
    thirdReportHandler,
    komusHandler,
    hiringReportHandler,
    timetrackingHandler,
    employeesForDinnersHandler,
    senesysHandler,
    freeEaters,
    positionsHandler,
    taxcomHandler,
    fiscalHandler,
    onlineShopHandler,
    payLinksHandler,
    sudokuHandler,
    employeesHandler_2,
    needsHandler,
    vacanciesHandler,
    catalogPersonalHandler,
    driversTimeSheetHandler,
    shopsHandler,
    stockReportHandler,
    komusCompareReportHandler,
    driverExtraPopupHandler,
    serviceCatalogHandler,
    carDataPopupHandler,
    carCrewPopupHandler,
    shedulePopupHandler,
    xml2json
  },
});
