<template>
  <section class="add-fixed-leftovers">
    <form class="add-fixed-leftovers__form">
      <h2>Загрузить исправленные остатки</h2>
      <input type="file" id="fixed" name="fixed" @change="onChange" />
      <label for="fixed">Исправленные остатки</label>
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setLeftover(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </form>
  </section>
</template>

<script>
import { XlsxRead, XlsxJson } from "vue-xlsx/dist/vue-xlsx.es";

export default {
  components: {
    XlsxRead,
    XlsxJson,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setLeftover(data) {
      if (data) {
        if (
          data.some((el) => el["МПЗ"].includes("Комус")) &&
          data.some((el) => el["МПЗ"].includes("Образец"))
        ) {
          const rawLeftovers = data;
          const handledLeftovers = [];
          for (let material in rawLeftovers) {
            const mat = rawLeftovers[material];
            handledLeftovers.push({
              name: mat["МПЗ"],
              left:
                mat["Остаток на конец"] === "-              "
                  ? 0
                  : mat["Остаток на конец"],
            });
          }
          //look for leftovers below zero ↓
          const invalidLeftovers = [];

          for (let material in handledLeftovers) {
            const mat = handledLeftovers[material];
            if (mat.left < 0) {
              invalidLeftovers.push(handledLeftovers[material]);
            }
          }
          if (invalidLeftovers.length > 0) {
            this.$store.commit("setLeftovers", invalidLeftovers);
            localStorage.removeItem("leftovers");
            this.$store.commit("setLeftoversCondition", false);
          } else {
            // when all leftovers are ok ↓
            this.$store.commit("setLeftovers", invalidLeftovers);
            localStorage.removeItem("leftovers");
            localStorage.setItem("leftovers", JSON.stringify(handledLeftovers));
            this.$store.commit("setLeftoversCondition", true);
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// .add-fixed-leftovers {
//   // background: #97999b;
// }
</style>