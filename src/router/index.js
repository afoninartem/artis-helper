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
  // MAINTENANCE ↓
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
    path: "/cards",
    name: "Cards",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "warehouse"],
    },
    component: () => import("../views/marketing/Cards.vue"),
  },
  // PERSONAL ↓
  {
    path: "/personal",
    name: "Personal",
    meta: {
      layout: "MainLayout",
      auth: true,
      permissions: ["admin", "personal"],
    },
    component: () => import("../views/personal/Personal.vue"),
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
