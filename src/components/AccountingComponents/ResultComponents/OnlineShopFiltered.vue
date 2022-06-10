<template>
  <div class="onlineshop-taxcom" v-if="onlineTaxcom">
    <h3>
      Интернет магазин из Taxcom
    </h3>
    <h4 v-if="onlineTaxcom.successfullSells > 0">
      {{ onlineTaxcom.successfullSells }}
      {{ this.cases(onlineTaxcom.successfullSells, "продажа") }} на сумму
      {{ onlineTaxcom.totalSum.toLocaleString("ru-Ru") }} руб.
    </h4>
    <h4 v-if="onlineTaxcom.refundsQuantity > 0">
      {{ onlineTaxcom.refundsQuantity }}
      {{ this.cases(onlineTaxcom.successfullSells, "возврат") }} на сумму
      {{ onlineTaxcom.refundSum.toLocaleString("ru-Ru") }} руб.
    </h4>
    <div class="multi-button">
      <!-- <button @click="showCurrentTable">Показать</button> -->
      <AddOnlineShopReport />
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download
          filename="Интернет магазин предварительный (по Taxcom).xlsx"
        >
          <button>Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
    <!-- <OnlineShopTaxcomPreview /> -->
    <!-- <OnlineShopResultPreview /> -->
  </div>
</template>

 <script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
import AddOnlineShopReport from "@/components/AccountingComponents/UploadFileComponents/AddOnlineShopReport";
// import OnlineShopResultPreview from "@/components/AccountingComponents/ResultComponents/OnlineShopResultPreview";
// import OnlineShopTaxcomPreview from "@/components/AccountingComponents/ResultComponents/OnlineShopTaxcomPreview";
export default {
  components: {
    AddOnlineShopReport,
    // OnlineShopResultPreview,
    // OnlineShopTaxcomPreview,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      extras: null,
      showTablePreview: false,
    };
  },
  computed: {
    sheets() {
      return {
        sheets: {
          name: "Интернет магазин из Taxcom",
          data: this.onlineTaxcom.documents
        }
      }
    },
    onlineXLS() {
      return this.$store.getters.getOnlineShopData;
    },
    onlineTaxcom() {
      return this.$store.getters.getOnlineShopFiltered;
    },
    compare() {
      if (this.onlineXLS) {
        const onlineXLS = Array.from(this.onlineXLS);
        const onlineTaxcom = Array.from(this.onlineTaxcom.documents);
        const max =
          onlineXLS.length >= onlineTaxcom.length ? onlineXLS : onlineTaxcom;
        const min =
          onlineXLS.length < onlineTaxcom.length ? onlineXLS : onlineTaxcom;
        const extrasFromMax = max.filter(
          (mx) => !min.some((mn) => mn["Сумма"] === mx["Сумма"])
        );
        const extrasFromMin = min.filter(
          (mn) => !max.some((mx) => mx["Сумма"] === mn["Сумма"])
        );
        const extras = extrasFromMax.concat(extrasFromMin);
        console.log(extras)
        this.setOnlineShopResultData(extras);
        return "done";
      }
      return null;
    },
    // result() {
    //   return this.$store.getters.getOnlineShopResultData;
    // },
  },
  methods: {
    cases(num, word) {
      const switchCases = require("../../../store/casesHandler");
      return switchCases(num, word);
    },
    setOnlineShopResultData(data) {
      console.log("setOnlineShopResultData was called")
      return this.$store.dispatch("setOnlineShopResultData", data);
    },
    // showCurrentTable() {
    //   this.$store.dispatch("toggleOnlineShopTaxcomVisibility");
    // },
  },
};
</script>

 <style lang="scss" scoped>
</style>