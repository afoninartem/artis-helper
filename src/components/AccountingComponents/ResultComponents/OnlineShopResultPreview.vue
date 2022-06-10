<template>
  <div class="online-shop-compared" v-if="show">
    <div class="online-shop-compared__header">
      <h3>Интернет магазин финальный</h3>
      <!-- <button @click.prevent="save">Скачать</button> -->
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="Интернет магазин финальный.xlsx">
          <button @click.prevent="addSheets">Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
      <button @click.prevent="close">Закрыть</button>
    </div>

    <h4 v-if="taxcom">
      {{ taxcom.length }} документов из Taxcom на сумму
      {{
        taxcom
          .map((r) => +r["Сумма"])
          .reduce((a, b) => a + b, 0)
          .toLocaleString("ru-Ru")
      }}
      руб.
    </h4>
    <table v-if="taxcom">
      <thead>
        <tr>
          <th
            v-for="(head, i) in Object.keys(taxcom[0])"
            :key="`taxcom-head-${i}`"
          >
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in taxcom" :key="`taxcom-data-${i}`">
          <td v-for="(item, j) in data" :key="`taxcom-item-${j}`">
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
    <h4 v-if="report">
      {{ report.length }} документов из CreditEurope на сумму
      {{
        report
          .map((r) => +r["Сумма"])
          .reduce((a, b) => a + b, 0)
          .toLocaleString("ru-Ru")
      }}
      руб.
    </h4>
    <table v-if="report">
      <thead>
        <tr>
          <th
            v-for="(head, i) in Object.keys(report[0])"
            :key="`report-head-${i}`"
          >
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in report" :key="`report-data-${i}`">
          <td v-for="(item, j) in data" :key="`report-item-${j}`">
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      sheets: []
    }
  },
  computed: {
    show() {
      return this.$store.getters.getOnlineShopResultVisibility;
    },
    extras() {
      return this.$store.getters.getOnlineShopResultData;
    },
    taxcom() {
      return this.extras ? this.extras.filter((e) => e["Дата и время"]) : null;
    },
    report() {
      return this.extras
        ? this.extras
            .filter((e) => !e["Дата и время"])
            .map((el) => {
              return {
                "Дата транзакции": el["Дата транзакции"].split(".")[0],
                "Номер транзакции": el["Номер транзакции"],
                Сумма: el["Сумма"],
                "ссылка №": el["ссылка №"],
                "Payment ID (STAN)": el["Payment ID (STAN)"],
              };
            })
        : null;
    },
  },
  methods: {
    close() {
      // this.$destroy(); 
      // this.$el.parentNode.removeChild(this.$el);
      this.$store.dispatch("toggleOnlineShopResultVisibility")
    },
    addSheets() {
      this.sheets.push({name: "Taxcom", data: this.taxcom})
      this.sheets.push({name: "CreditEurope", data: this.report})
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.online-shop-compared {
  position: absolute;
  top: 50px;
  left: 50px;
  right: 50px;
  bottom: 50px;
  border: 1px solid #000;
  border-radius: 10px;
  background: #fff;
}
</style>