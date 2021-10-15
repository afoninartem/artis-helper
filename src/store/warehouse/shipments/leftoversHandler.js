export default {
  state: {
    invalidLeftovers: [],
    leftoversValidation: false,
  },
  mutations: {
    leftoversAreInvalid(state, payload) {
      state.leftoversValidation = false;
      state.invalidLeftovers = payload;
    },
    leftoversAreValid(state) {
      state.leftoversValidation = true;
      state.invalidLeftovers = [];
    },
    setLeftovers(state, payload) {
      state.invalidLeftovers = payload;
    },
  },
  actions: {
    async leftoversAreInvalid(context, payload) {
      return await context.commit("leftoversAreInvalid", payload);
    },
    async leftoversAreValid(context) {
      return await context.commit("leftoversAreValid");
    },
    async leftoversHandler({ dispatch }, data) {
      if (data.some(el => el["МПЗ"])) {
        if (
          data.some((el) => el["МПЗ"].includes("Комус")) &&
          data.some((el) => el["МПЗ"].includes("Образец"))
        ) {
          const handledLeftovers = data.map((el) => {
            return {
              name: el["МПЗ"],
              left:
                el["Остаток на конец"] === "-              "
                  ? 0
                  : el["Остаток на конец"],
            };
          });
  
          const invalidLeftovers = handledLeftovers.filter(
            (material) => material.left < 0
          );
  
          document.querySelector("#file").value = "";
  
          if (invalidLeftovers.length > 0) {
           await dispatch("leftoversAreInvalid", invalidLeftovers);
          } else {
           await dispatch("leftoversAreValid");
           await localStorage.setItem("leftovers", JSON.stringify(handledLeftovers));
          }
        }
        if (
          !data.some((el) => el["МПЗ"].includes("Комус")) &&
          data.some((el) => el["МПЗ"].includes("Образец"))
        ) {
          alert("Забыл выгрузить остатки по АХО!");
        }
        if (
          data.some((el) => el["МПЗ"].includes("Комус")) &&
          !data.some((el) => el["МПЗ"].includes("Образец"))
        ) {
          alert("Ахо выгрузил, а рекламу забыл, ну пиздец!");
        }
      } else {
        alert("Это не остатки!");
      }
      

      // if (
      //   !data.some((el) => el["МПЗ"])
      // ) {
      //   alert("Это не остатки!");
      // }
    },
  },
  getters: {
    getLeftoversValidation: (state) => {
      return state.leftoversValidation;
    },
  },
};
