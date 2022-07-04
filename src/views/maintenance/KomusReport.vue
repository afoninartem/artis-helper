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
      <xlsx-workbook v-if="result">
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="Проверить счета Комус.xlsx">
          <button>Скачать таблицу в XLSX</button>
        </xlsx-download>
      </xlsx-workbook>
      <table v-if="result">
        <thead>
          <tr>
            <th>#</th>
            <th>№ заказа</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, o) in result" :key="`order-${o}`">
            <td>{{o + 1}}</td>
            <td>{{ order[0] }}</td>
            <td>{{ Number(order[1]).toLocaleString("ru-Ru") }} руб.</td>
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
  methods: {
    casesHandler(num, word) {
      const ch = require("../../store/casesHandler");
      return ch(num, word);
    },
  },
  computed: {
    sheets() {
      return {
        sheets: {
          name: "Проверить счета",
          data: this.result ? this.result.map((el) => {
            return { Счёт: el[0], Сумма: el[1] };
          }) : null,
        },
      };
    },
    komusReport() {
      return this.$store.getters.getKomusReportData;
    },
    komusCompareAct() {
      return this.$store.getters.getKomusCompareActData;
    },
    result() {
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
        .sort((a, b) => a[1] - b[1])
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
</style>