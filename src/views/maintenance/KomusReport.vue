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
      <table v-if="result">
        <caption style="padding: 10px">
          Проверить в акте Комуса
        </caption>
        <thead>
          <tr>
            <th>№ п/п</th>
            <th>Номер счет-фактуры</th>
            <th>№ заказа</th>
            <th>Сумма</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in result" :key="`result-${i}`">
            <td>{{ item["№ п/п"] }}</td>
            <td>{{ item["Номер счет-фактуры"] }}</td>
            <td>{{ item["№ заказа"] }}</td>
            <td>{{ item["Дебет"].toLocaleString("ru-Ru") }}</td>
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="loader" v-if="!komus">Загрузите файл ↑</div> -->
    </div>
  </div>
</template>

<script>
import AddKomusReport from "@/components/MaintenanceComponents/AddKomusReport.vue";
import AddKomusCompareAct from "@/components/MaintenanceComponents/AddKomusCompareAct.vue";
export default {
  components: {
    AddKomusReport,
    AddKomusCompareAct,
  },
  methods: {
    casesHandler(num, word) {
      const ch = require("../../store/casesHandler");
      return ch(num, word);
    },
  },
  computed: {
    komusReport() {
      return this.$store.getters.getKomusReportData;
    },
    komusCompareAct() {
      return this.$store.getters.getKomusCompareActData;
    },
    result() {
      if (!this.komusReport || !this.komusCompareAct) return;
      const dataToCheck = [];
      Array.from(this.komusCompareAct).forEach((item) => {
        const sumActEntries = Array.from(this.komusCompareAct).filter(
          (f) => f["Дебет"] === item["Дебет"]
        ).length;
        const sumReportEntries = Object.values(
          this.komusReport.delivered
        ).filter((f) => +f === item["Дебет"]).length;
        sumActEntries !== sumReportEntries
          ? ((item.description = `В акте ${sumActEntries} ${this.casesHandler(
              sumActEntries,
              "раз"
            )}, в отчете ${sumReportEntries} ${this.casesHandler(
              sumReportEntries,
              "раз"
            )}`),
            dataToCheck.push(item))
          : null;
      });
      return dataToCheck;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
</style>