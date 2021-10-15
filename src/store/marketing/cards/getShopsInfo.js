// import firebase from "firebase/app";
import { db } from "../../../main";
export default {
  actions: {
    async getShopDataFromDB(
      { dispatch, commit },
      { email, change, cards, stickers }
    ) {
      try {
        await db
          .collection("shops")
          .where("email", "==", email)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const shopDetails = {
                name: doc.data().shortName,
                email,
                change,
                cards,
                stickers,
              };
              commit("addShopInfo", shopDetails);
              const shopDetailsForDownload = {
                "ФС": doc.data().shortName,
                email,
                "Визитки": cards,
                "Наклейки": stickers,
              }
              commit("addShopInfoForDownload", shopDetailsForDownload);
            });
          });
      } catch (error) {
        console.log(error, dispatch, commit);
      }
    },
  },
};
