<template>
  <div class="taxcom">
    <h1>Проверка Taxcom</h1>

    <div class="taxcom__upload">
      <AddTaxcomReport v-if="!rawTaxcom" />
      <AddFiscalReport v-if="rawTaxcom && !rawFiscal" />
      <AddXmlSalesReport v-if="rawTaxcom && !rawSellingData" />
      <AddOnlineShopReport v-if="rawTaxcom && rawFiscal && !rawOnline" />
      <AddPayLinksReport v-if="rawTaxcom && rawFiscal && !rawPaylink" />
    </div>

    <button
      v-if="rawTaxcom && (rawFiscal || rawSellingData)"
      @click.prevent="compare"
    >
      Сравнить
    </button>

    <div class="result-cards">
      <FiscalResult />
      <OnlineShopResult />
      <PaylinksResult />
      <XmlSellingsResult />
    </div>
  </div>
</template>

<script>
import AddTaxcomReport from "@/components/AccountingComponents/UploadFileComponents/AddTaxcomReport";
import AddFiscalReport from "@/components/AccountingComponents/UploadFileComponents/AddFiscalReport";
import AddXmlSalesReport from "@/components/AccountingComponents/UploadFileComponents/AddXmlSalesReport";
import AddOnlineShopReport from "@/components/AccountingComponents/UploadFileComponents/AddOnlineShopReport";
import AddPayLinksReport from "@/components/AccountingComponents/UploadFileComponents/AddPayLinksReport";
import FiscalResult from "@/components/AccountingComponents/ResultComponents/FiscalResult";
import OnlineShopResult from "@/components/AccountingComponents/ResultComponents/OnlineShopResult";
import PaylinksResult from "@/components/AccountingComponents/ResultComponents/PaylinksResult";
import XmlSellingsResult from "@/components/AccountingComponents/ResultComponents/XmlSellingsResult";

export default {
  components: {
    AddTaxcomReport,
    AddFiscalReport,
    AddOnlineShopReport,
    AddPayLinksReport,
    AddXmlSalesReport,
    FiscalResult,
    OnlineShopResult,
    PaylinksResult,
    XmlSellingsResult,
  },
  computed: {
    rawTaxcom() {
      return this.$store.getters.getTaxcomData;
    },
    rawFiscal() {
      return this.$store.getters.getFiscalData;
    },
    rawOnline() {
      return this.$store.getters.getOnlineShopData;
    },
    rawPaylink() {
      return this.$store.getters.getPayLinks;
    },
    rawSellingData() {
      return this.$store.getters.getSellingData;
    },
    // RESULTS
    // onlineResult() {
    //   return this.$store.getters.getOnlineData;
    // },
    // paylinksResult() {
    //   return this.$store.getters.getPaylinksData;
    // },
    // fiscalResult() {
    //   return this.$store.getters.getFiscalData;
    // },
  },
  methods: {
    compare() {
      this.$store.dispatch("compareData");
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/scss/personalTable.scss";
// @include personal-table;
.taxcom {
  .taxcom__upload,
  .result-cards {
    display: flex;
    justify-content: space-evenly;
    gap: 30px;
    flex-wrap: wrap;
    padding: 20px 0;
  }
}
</style>