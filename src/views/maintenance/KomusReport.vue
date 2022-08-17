<template>
  <div class="komus-report">
    <AddKomusReport v-if="!komusReport" />
    <AddKomusCompareAct v-if="!komusCompareAct" />
    <div class="content">
      <div class="data" v-if="komusReport">
        <h1>
          Доставлено товаров на сумму
          {{ Number(komusReport.deliveredSum).toLocaleString("ru-Ru") }} руб.
        </h1>
        <h1>
          Отменено заказов на сумму
          {{ Number(komusReport.canseledSum).toLocaleString("ru-Ru") }} руб.
        </h1>
      </div>
      <div class="btn-block">
        <xlsx-workbook v-if="toCheck">
          <xlsx-sheet
            :collection="sheet.data"
            v-for="sheet in sheets"
            :key="sheet.name"
            :sheet-name="sheet.name"
          />
          <xlsx-download filename="Комус.xlsx">
            <button @click.prevent="addSheets">Скачать XLSX</button>
          </xlsx-download>
        </xlsx-workbook>
      </div>

      <table v-if="toCheck">
        <thead>
          <tr>
            <th>#</th>
            <th>№ заказа</th>
            <th>Сумма</th>
            <th>Добавить в консолидацию</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, o) in filteredToChech" :key="`order-${o}`">
            <td>{{ o + 1 }}</td>
            <td>{{ order[0] }}</td>
            <td>{{ Number(order[1]).toLocaleString("ru-Ru") }} руб.</td>
            <td>
              <button @click.prevent="addToConsolidation(order)">
                Добавить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
import AddKomusReport from "@/components/MaintenanceComponents/AddKomusReport.vue";
import AddKomusCompareAct from "@/components/MaintenanceComponents/AddKomusCompareAct.vue";
export default {
  components: {
    AddKomusReport,
    AddKomusCompareAct,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      consolidationXLSXData: [],
      sheets: [],
    };
  },
  methods: {
    addSheets() {
      if (this.consolidationXLSXData.length) {
        console.log(this.consolidationXLSXData)
        this.sheets.push({
          name: "Консолидация",
          data: this.consolidationXLSXData.map((item) => [
            item[0],
            parseFloat(item[1]),
          ]),
        });
      }
      if (this.toCheck.length) {
        this.sheets.push({
          name: "Проверить счета",
          data: this.toCheck
            ? this.filteredToChech.map((el) => {
                return { Счёт: el[0], Сумма: parseFloat(el[1]) };
              })
            : null,
        });
      }
    },
    casesHandler(num, word) {
      const ch = require("../../store/casesHandler");
      return ch(num, word);
    },
    setConsolidationData(payload) {
      this.consolidationXLSXData = payload
        .map((arr) =>
          Array.from(arr[1]).map((el) => {
            return { [el]: arr[0] };
          })
        )
        .flat()
        .map((el) => Object.entries(el))
        .flat()
        .sort((a, b) => a[1] - b[1]);
    },
    addToConsolidation(payload) {
      this.consolidationXLSXData.push([payload[0], [payload[1]]]);
      this.sheets = [];
    },
  },
  computed: {
    consolidationXLSX() {
      return {
        sheets: {
          name: "Согласовано для консолидации",
          data: this.consolidationXLSXData,
        },
      };
    },
    consolidation() {
      if (!this.komusReport || !this.komusCompareAct) return;
      const result = Object.entries(this.komusCompareAct).filter((el) =>
        Object.prototype.hasOwnProperty.call(
          this.komusReport.deliveredBySum,
          el[0]
        )
      );
      this.setConsolidationData(result);
      return result;
    },
    komusReport() {
      return this.$store.getters.getKomusReportData;
    },
    komusCompareAct() {
      return this.$store.getters.getKomusCompareActData;
    },
    filteredToChech() {
      if (!this.toCheck) return null;
      return this.toCheck.filter(
        (item) =>
          !this.consolidationXLSXData.map((arr) => arr[0]).includes(item[0])
      );
    },
    toCheck() {
      if (!this.komusReport || !this.komusCompareAct) return;
      const dataToCheck = Object.entries(this.komusCompareAct).filter(
        (el) =>
          !Object.prototype.hasOwnProperty.call(
            this.komusReport.deliveredBySum,
            el[0]
          )
      );
      return dataToCheck
        .map((arr) =>
          Array.from(arr[1]).map((el) => {
            return { [el]: arr[0] };
          })
        )
        .flat()
        .map((el) => Object.entries(el))
        .flat()
        .sort((a, b) => a[1] - b[1]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
</style>