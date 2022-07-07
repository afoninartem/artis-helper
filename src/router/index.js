import Vue from "vue";
import VueRouter from "vue-router";
import Auth from "../views/Auth.vue";
import firebase from "firebase/app";

Vue.use(VueRouter);

const routes = [
  // COMMON ↓
  {
    path: "/",
    name: "Auth",
    meta: { layout: "AuthLayout" },
    component: Auth,
  },
  {
    path: "/about",
    name: "About",
    meta: { layout: "MainLayout", auth: true },
    component: () => import("../views/About.vue"),
  },
  {
    path: "/help",
    name: "Help",
    meta: { layout: "AuthLayout", auth: true },
    component: () => import("../views/Help.vue"),
  },
  // ADMIN ↓
  {
    path: "/add-user",
    name: "AddOneUser",
    meta: {
      layout: "MainLayout",
      auth: true,
      admin: true,
      permissions: ["admin"],
    },
    component: () => import("../components/AdminComponents/AddOneUser.vue"),
  },
  {
    path: "/add-users",
    name: "AddGroupOfUsers",
    meta: {
      layout: "MainLayout",
      auth: true,
      admin: true,
      permissions: ["admin"],
    },
    component: () =>
      import("../components/AdminComponents/AddGroupOfUsers.vue"),
  },
  {
    path: "/add-shops",
    name: "AddGroupOfShops",
    meta: {
      layout: "MainLayout",
      auth: true,
      admin: true,
      permissions: ["admin"],
    },
    component: () =>
      import("../components/AdminComponents/AddGroupOfShops.vue"),
  },
  {
    path: "/admin-shops",
    name: "AdminShops",
    meta: {
      layout: "MainLayout",
      auth: true,
      admin: true,
      permissions: ["admin"],
    },
    component: () =>
      import("../views/admin/Shops.vue"),
  },
  {
    path: "/sudoku",
    name: "Sudoku",
    meta: {
      layout: "MainLayout",
      auth: true,
      admin: true,
      permissions: ["admin"],
    },
    component: () =>
      import("../components/AdminComponents/Sudoku.vue"),
  },
  // MAINTENANCE ↓
  {
    path: "/komus-report",
    name: "KomusReport",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "maintenance"],
    },
    component: () => import("../views/maintenance/KomusReport.vue"),
  },
  {
    path: "/dinners",
    name: "Dinners",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "maintenance"],
    },
    component: () => import("../views/maintenance/Dinners.vue"),
  },
  {
    path: "/free-eaters",
    name: "FreeEaters",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "maintenance"],
    },
    component: () => import("../views/maintenance/FreeEaters.vue"),
  },
  //MARKETING ↓
  {
    path: "/price",
    name: "Price",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "marketing"]
    },
    component: () => import("../views/marketing/Price.vue")
  },
  {
    path: "/warehouse-needs",
    name: "Needs",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "marketing"]
    },
    component: () => import("../views/marketing/Needs.vue")
  },
  // {
  //   path: "/cards",
  //   name: "Cards",
  //   meta: {
  //     layout: "MainLayout",
  //     auth: true,
  //     permissions: ["admin", "warehouse"],
  //   },
  //   component: () => import("../views/marketing/Cards.vue"),
  // },
  // PERSONAL ↓
  {
    path: "/time-tracking",
    name: "Time-tracking",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "personal"],
    },
    component: () => import("../views/personal/TimeTracking.vue"),
  },
  {
    path: "/drivers-timetracking",
    name: "Drivers-time-tracking",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "personal"],
    },
    component: () => import("../views/personal/DriversTimeTracking.vue"),
  },
  {
    path: "/hiring-report",
    name: "HiringReport",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "recruitment"],
    },
    component: () => import("../views/personal/HiringReport.vue"),
  },
  {
    path: "/hiring-report-new",
    name: "HiringReportNew",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "recruitment", "personal"],
    },
    component: () => import("../views/personal/HiringReportNew.vue"),
  },
  {
    path: "/hiring-report-result",
    name: "HiringReportResult",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "recruitment", "personal"],
    },
    component: () => import("../views/personal/HiringReportResult.vue"),
  },
  {
    path: "/catalog-personal",
    name: "CatalogPersonal",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "recruitment", "personal"],
    },
    component: () => import("../views/personal/CatalogPersonal.vue"),
  },
  {
    path: "/vacancies",
    name: "Vacancies",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "recruitment", "personal"],
    },
    component: () => import("../views/personal/Vacancies.vue"),
  },
  // WAREHOUSE ↓
  {
    path: "/stocks",
    name: "Stocks",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Stocks.vue"),
  },
  {
    path: "/stocks-new",
    name: "Stocks-new",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Stocks-new.vue"),
  },
  {
    path: "/incomes",
    name: "Incomes",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Incomes.vue"),
  },
  {
    path: "/komus",
    name: "Komus",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Komus.vue"),
  },
  {
    path: "/cards-and-stickers",
    name: "CardsAndStickers",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse", "marketing"],
    },
    component: () => import("../views/warehouse/CardsAndStickers.vue"),
  },
  {
    path: "/shipments",
    name: "Shipments",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Shipments.vue"),
  },
  {
    path: "/stickers",
    name: "Stickers",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Stickers.vue"),
  },
  {
    path: "/leftovers",
    name: "Leftovers",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Leftovers.vue"),
  },
  {
    path: "/stop-list",
    name: "Stop-list",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/StopShipList.vue"),
  },
  {
    path: "/limits",
    name: "Limits",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Limits.vue"),
  },
  {
    path: "/orders",
    name: "Orders",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Orders.vue"),
  },
  {
    path: "/packages",
    name: "Packages",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Packages.vue"),
  },
  {
    path: "/storage",
    name: "Storage",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Storage.vue"),
  },
  {
    path: "/colors",
    name: "Colors",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Colors.vue"),
  },
  {
    path: "/positions",
    name: "Positions",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/warehouse/Positions.vue"),
  },
  // FINANCE ↓
  {
    path: "/taxcom-check",
    name: "TaxcomCheck",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "accounting"],
    },
    component: () => import("../views/accounting/TaxcomCheck.vue"),
  },
  // SERVICE ↓
  {
    path: "/today-working-service",
    name: "TodayWorkingService",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "service"],
    },
    component: () => import("../views/service/TodayWorkingService.vue"),
  },
  {
    path: "/drivers-cars-catalog",
    name: "DriversCarsCatalog",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "service"],
    },
    component: () => import("../views/service/DriversAndCarsCatalog.vue"),
  },
  {
    path: "/service-calendar",
    name: "ServiceCalendar",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "service"],
    },
    component: () => import("../views/service/ServiceCalendar.vue"),
  },
  {
    path: "/stock-report",
    name: "StockReport",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "retail"],
    },
    component: () => import("../views/retail/StockReport.vue"),
  },
  // {path: "*", redirect: }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const currentUserGroup = JSON.parse(localStorage.getItem("RT"));
  const requireAuth = to.matched.some((route) => route.meta.auth);
  const userHavePermission = to.matched.some((route) => route.meta.permissions)
    ? to.matched.some((route) =>
        route.meta.permissions.includes(currentUserGroup.group)
      )
    : true;
  if (requireAuth && !currentUser) {
    next("/");
  } else if (!userHavePermission) {
    next("/about");
  } else {
    next();
  }
});

export default router;
