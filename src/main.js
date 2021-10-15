import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore"

Vue.config.productionTip = false;

Vue.use(Vuelidate);

const firebaseConfig = {
  apiKey: "AIzaSyAEn0m8DZQHBSBMndRlxRtELv8K0vgpOGs",
  authDomain: "artis-helper.firebaseapp.com",
  databaseURL: "https://artis-helper-default-rtdb.firebaseio.com",
  projectId: "artis-helper",
  storageBucket: "artis-helper.appspot.com",
  messagingSenderId: "556205687381",
  appId: "1:556205687381:web:37f7b7490b8064a266cadc",
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});


