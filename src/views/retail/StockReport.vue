<template>
  <div class="stock-report">
    <h1>Отчет по акции</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Материал</th>
          <th>Расход</th>
          <th>Остаток</th>
          <th>Прогноз</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(material, m) in materials" :key="`material-${m}`">
          <td>{{ m + 1 }}</td>
          <td>{{ reportData[material].title }}</td>
          <td><input type="text" name="" id="" v-model="reportData[material].consumption"></td>
          <td><input type="text" name="" id="" v-model="reportData[material].leftover"></td>
          <td><input type="text" name="" id="" v-model="reportData[material].forecast"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportData: { },
    };
  },
  beforeMount: async function () {
    Array.from(this.materials).forEach((mat) => {
      const capitalizedName = mat.charAt(0).toUpperCase() + mat.slice(1);
      this.reportData[mat] = {
        title: capitalizedName,
        consumption: "",
        leftover: "",
        forecast: "",
      };
    });
  },
  computed: {
    materials() {
      return this.$store.getters.getMaterials;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
td {
  padding: 0;
}
input {
  width: 100%;
  border: none;
}
</style>