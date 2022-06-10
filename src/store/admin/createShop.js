// import firebase from "firebase/app";
import { db } from "../../main";
export default {
  actions: {
    async createShop({ dispatch, commit }, newShop) {
      try {
        await db
          .collection("shops")
          .doc(newShop.name.split("/").join(" "))
          .set(newShop);
      } catch (error) {
        alert(error.message);
        console.log({ dispatch, commit });
        throw error;
      }
    },
  },
};
