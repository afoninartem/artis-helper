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
        <tr v-for="(material, m) in reportData" :key="`material-${m}`">
          <td>{{ m + 1 }}</td>
          <td>{{ material.title }}</td>
          <td><input type="text" name="" id="" /></td>
          <td><input type="text" name="" id="" /></td>
          <td><input type="text" name="" id="" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportData: {}
    }
  },
  mounted: async function() {
    this.reportData = Array.from(this.materials).forEach(mat => {
      this.reportData[]
      // return {
      //   title: mat.charAt(0).toUpperCase() + mat.slice(1),
      //   consumption: null,
      //   leftover: null,
      //   forecast: null
      // }
    })
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
  padding: 0
}
input {
  width: 100%;
  border: none
}
</style>