import firebase from "firebase/app";
import { db } from "../../main";
export default {
  actions: {
    async createUser({ dispatch, commit }, { email, password, group }) {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            db.collection("users")
              .doc(email)
              .set({
                uid: firebase.auth().currentUser.uid,
                email,
                password,
                group,
              });
          });
      } catch (error) {
        alert(error.message);
        console.log({ dispatch, commit });
        throw error;
      }
    },
  },
};
