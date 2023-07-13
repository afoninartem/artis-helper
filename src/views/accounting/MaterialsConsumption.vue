<template>
  <div class="material-consumption">
    <h1>Расход материалов</h1>
    <!-- file input -->
    <AddMaterialsConsumptionReport v-if="!original" />
    <div class="material-consumption__form" v-if="original">
      <p>Количество итераций: {{counter}}</p>
      <!-- coefficient input -->
      <label for="coefficient">Коэффициент: </label>
      <input
        type="number"
        name="coefficient"
        id="coefficient"
        v-model="coefficient"
        step="0.01"
      >
      <!-- submit btn -->
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="Расход материалов c коэффициентом.xls">
          <button @click.prevent="addSheets">Пересчитать</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
  </div>
</template>

<script>
import AddMaterialsConsumptionReport from "../../components/AccountingComponents/MaterialConsumption/AddMaterialsConsumptionReport.vue";
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    AddMaterialsConsumptionReport,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      matcomp: null,
      coefficient: 1,
      sheets: [],
    };
  },
  methods: {
    addSheets() {
      this.recaclulate();
      
      this.sheets.push({
        name: `№${this.counter} коэф ${this.coefficient}`,
        data: this.matcomp,
      });
    },
    recaclulate() {
      if (!this.original && !this.matcomp) {
        alert("Сначала надо загрузить отчет по расходу материалов");
        return;
      }
      const materialsData = this.counter > 0 ? this.matcomp : this.original;
      const result = materialsData.map((x) => ({
        Артикул: x["Артикул"].trim(),
        Количество: this.calcQuan(x["Количество"], x["Единица"]),
        Единица: x["Единица"],
      }));
      this.matcomp = result;
      this.$store.commit("incrementCounter");
    },
    calcQuan(quan, unit) {
      switch (unit) {
        case "м":
        case "м2":
        case "пог.м":
          return (quan * this.coefficient).toFixed(3);
        default:
          return (quan * this.coefficient).toFixed();
      }
    },
  },
  computed: {
    counter() {
      return this.$store.getters.getCounter;
    },
    original() {
      return this.$store.getters.getOriginalData;
    },
  },
};
</script>
