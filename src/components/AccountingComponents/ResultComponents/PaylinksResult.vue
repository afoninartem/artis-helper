<template>
  <div class="card" v-if="result && result.totalSumByCreditEurope">
    <h3>Итог по Ссылкам</h3>
    <div class="content">
      <ul>
        <li
          v-if="
            !result.extrasFromTaxcom.length && !result.extrasFromCredit.length
          "
          class="good"
        >
          Данные из Taxcom и из CreditEurope идентичны
        </li>
        <li v-if="result.extrasFromTaxcom.length" class="bad">
          В Taxcom есть {{ result.extrasFromTaxcom.length }}
          {{ this.casesHandler(result.extrasFromTaxcom.length, "документ") }}
          на сумму
          {{ result.extrasFromTaxcomTotalSum.toLocaleString("ru-Ru") }} руб.,
          которых нет в CreditEurope
        </li>
        <li v-if="result.extrasFromCredit.length" class="bad">
          В CreditEurope есть {{ result.extrasFromCredit.length }}
          {{ this.casesHandler(result.extrasFromCredit.length, "документ") }}
          на сумму
          {{ result.extrasFromCreditTotalSum.toLocaleString("ru-Ru") }} руб.,
          которых нет в Taxcom
        </li>
      </ul>
      <div class="summary">
        <p class="summary__taxcom">
          ИТОГО TAXCOM<span>:</span> {{ result.totalSum.toLocaleString("ru-Ru") }} руб.
        </p>
        <p class="summary__credit">
          ИТОГО CREDIT<span>:</span>
          {{ result.totalSumByCreditEurope.toLocaleString("ru-Ru") }} руб.
        </p>
      </div>
    </div>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Итог по ссылкам.xlsx">
        <button @click.prevent="addSheets">Получить детализацию в xlsx</button>
      </xlsx-download>
    </xlsx-workbook>
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
      sheets: [],
    };
  },
  computed: {
    result() {
      return this.$store.getters.getPaylinksResult;
    },
  },
  methods: {
    casesHandler(num, word) {
      const ch = require("../../../store/casesHandler");
      return ch(num, word);
    },
    addSheets() {
      if (this.result.extrasFromTaxcom.length) {
        this.sheets.push({
          name: "Taxcom > CreditEurope",
          data: this.result.extrasFromTaxcom,
        });
      }
      if (this.result.extrasFromCredit.length) {
        this.sheets.push({
          name: "CreditEurope > Taxcom",
          data: this.result.extrasFromCredit,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/resultCard.scss";
@include result-card;

.good::before {
  content: url(../../../assets/binary-icons/check-true-green.svg);
  margin-right: 5px;
}
.bad::before {
  content: url(../../../assets/binary-icons/check-false-red.svg);
  margin-right: 5px;
}

.summary {
  display: flex;
  justify-content: space-evenly;
  font-weight: bold;
  .summary__taxom, .summary__credit {
    span {
      margin-left: 1px
    }
  }
}
</style>