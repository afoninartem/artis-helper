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
import needsHandler from "./marketing/warehouse-needs/needsHandler";
import vacanciesHandler from "./personal/vacanciesHandler";
import catalogPersonalHandler from "./personal/catalogPersonalHandler";
import driversTimeSheetHandler from "./personal/driversTimeSheetHandler";
import driverExtraPopupHandler from "./service/driverExtraPopupHandler";
import serviceCatalogHandler from "./service/serviceCatalogHandler";
import carDataPopupHandler from "./service/carDataPopupHandler";
import carCrewPopupHandler from "./service/carCrewPopupHandler";
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
        title: "Розница",
        services: [
          {
            name: "stock-report",
            link: "/stock-report",
            title: "Отчет по акции",
            permissions: ["retail"],
          },
        ],
      },
      {
        name: "service",
        state: false,
        title: "Сервис",
        services: [
          {
            name: "today-working-service",
            link: "/today-working-service",
            title: "Сегодня работают",
            permissions: ["service", "personal"],
          },
          {
            name: "drivers-cars-catalog",
            link: "/drivers-cars-catalog",
            title: "Справочник ОС",
            permissions: ["service", "personal"],
          },
          // {
          //   name: "service-calendar",
          //   link: "/service-calendar",
          //   title: "Календарь",
          //   permissions: ["service", "personal"],
          // },
        ],
      },
      {
        name: "accounting",
        state: false,
        title: "Финансы",
        services: [
          {
            name: "taxcom",
            link: "/taxcom-check",
            title: "Taxcom",
            permissions: ["accounting"],
          },
        ],
      },
      {
        name: "maintenance",
        state: false,
        title: "АХО",
        services: [
          {
            name: "komus-report",
            link: "/komus-report",
            title: "Комус",
            permissions: ["maintenance"],
          },
          {
            name: "dinners",
            link: "/dinners",
            title: "Обеды",
            permissions: ["maintenance"],
          },
          {
            name: "freeEaters",
            link: "/free-eaters",
            title: "Бесплатные",
            permissions: ["maintenance"],
          },
        ],
      },
      {
        name: "marketing",
        state: false,
        title: "Реклама",
        services: [
          // {
          // 	name: "cards",
          // 	link: "/cards",
          // 	title: "Визитки",
          // 	permissions: ["marketing"],
          // },
          {
            name: "needs",
            link: "/warehouse-needs",
            title: "Потребность",
            permissions: ["marketing"],
          },
          {
            name: "price",
            link: "/price",
            title: "Прайс",
            permissions: ["marketing"],
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
            link: "/time-tracking",
            title: "УРВ",
            permissions: ["personal"],
          },
          {
            name: "drivers-timetracking",
            link: "/drivers-timetracking",
            title: "Водители",
            permissions: ["personal"],
          },
          {
            name: "hiringreport",
            link: "/hiring-report",
            title: "Подбор",
            permissions: ["recruitment"],
          },
          {
            name: "WeeklyReqruitmentReport",
            link: "/weekly-reqruitment-report",
            title: "Сводка по неделям",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "hiringreport-new",
            link: "/hiring-report-new",
            title: "Сводка по кандидатам",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "hiringreport-result",
            link: "/hiring-report-result",
            title: "Сводка по вакансиям",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "vacancies",
            link: "/vacancies",
            title: "Вакансии",
            permissions: ["recruitment", "personal"],
          },
          {
            name: "catalog-personal",
            link: "/catalog-personal",
            title: "Справочник",
            permissions: ["recruitment", "personal"],
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
            permissions: ["warehouse"],
          },
          {
            name: "stocks-new",
            link: "/stocks-new",
            title: "Акции new",
            permissions: ["admin"],
          },
          {
            name: "komus",
            link: "/komus",
            title: "Комус",
            permissions: ["warehouse"],
          },
          {
            name: "cards-and-stickers",
            link: "/cards-and-stickers",
            title: "Визитки",
            permissions: ["warehouse", "marketing"],
          },
          {
            name: "incomes",
            link: "/incomes",
            title: "Поступления",
            permissions: ["warehouse"],
          },
          {
            name: "shipments",
            link: "/shipments",
            title: "Отгрузки",
            permissions: ["warehouse"],
          },
          {
            name: "stickers",
            link: "/stickers",
            title: "Стикеры",
            permissions: ["warehouse"],
          },
          {
            name: "leftovers",
            link: "/leftovers",
            title: "Остатки",
            permissions: ["warehouse"],
          },
          {
            name: "stop-list",
            link: "/stop-list",
            title: "Стоп-лист",
            permissions: ["warehouse"],
          },
          {
            name: "limits",
            link: "/limits",
            title: "Лимиты",
            permissions: ["warehouse"],
          },
          {
            name: "orders",
            link: "/orders",
            title: "Заявки",
            permissions: ["warehouse"],
          },
          {
            name: "packages",
            link: "/packages",
            title: "Упаковка",
            permissions: ["warehouse"],
          },
          {
            name: "storage",
            link: "/storage",
            title: "Хранение",
            permissions: ["warehouse"],
          },
          {
            name: "colors",
            link: "/colors",
            title: "Цвета",
            permissions: ["warehouse"],
          },
          {
            name: "positions",
            link: "/positions",
            title: "Должности",
            permissions: ["warehouse"],
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
            title: "Салоны",
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
    // ↓ getter getCurrentUser is for Navbar.vue
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
    carCrewPopupHandler
  },
});
