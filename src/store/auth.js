import firebase from "firebase/app";
export default {
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            dispatch("setCurrentUser");
          });
      } catch (error) {
        alert(error.message);
        console.log({ dispatch, commit });
        throw error;
      }
    },
    async logout({commit}) {
      await firebase.auth().signOut();
      localStorage.removeItem("RT")
      localStorage.removeItem("currentIndent")
      await commit("nullUser")
    }
  },
};
