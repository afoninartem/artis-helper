<template>
  <div class="card" v-if="fiscalResult && fiscal">
    <h3>Итог по фискальному регистру из 1С</h3>
    <div class="content">
      <ul>
        <li v-if="!fiscalResult.notEqualSumsByFPD.length" class="good">
          Все суммы с одинаковым фискальным признаком сошлись
        </li>
        <li v-if="!fiscalResult.notEqualDetailsByFPD.length" class="good">
          Все типы платежей сошлись
        </li>
        <li v-if="!fiscalResult.incorrectCheckbox.length" class="good">
          Все галочки "без передачи товаров" выставлены корректно
        </li>
        <li
          v-if="!fiscalResult.noSuchFPDInTaxcom.documents.length"
          class="good"
        >
          Все документы из 1С8 присутсвуют в Taxcom
        </li>
        <li
          v-if="!fiscalResult.unidentifyedByFPDFromTaxcom.documents.length"
          class="good"
        >
          Все документы из Taxcom присутсвуют в 1С8
        </li>
        <li v-if="fiscalResult.incorrectCheckbox.length" class="bad">
          Некорректно выставлена галочка "без передачи товаров": {{fiscalResult.incorrectCheckbox.length}} {{this.casesHandler(fiscalResult.incorrectCheckbox.length, "документ") }}
        </li>
        <li v-if="fiscalResult.notEqualDetailsByFPD.length" class="bad">
          Не сошлись типы платежей:
          {{ fiscalResult.notEqualDetailsByFPD.length }}
          {{
            this.casesHandler(
              fiscalResult.notEqualDetailsByFPD.length,
              "документ"
            )
          }}
        </li>
        <li v-if="fiscalResult.notEqualSumsByFPD.length" class="bad">
          Не сошлись по суммам:
          {{ fiscalResult.notEqualSumsByFPD.length }}
          {{
            this.casesHandler(fiscalResult.notEqualSumsByFPD.length, "документ")
          }}
          на сумму
          {{
            fiscalResult.notEqualSumsByFPD.reduce((a, b) => a + b.delta, 0)
          }}
          руб.
        </li>
        <li
          v-if="fiscalResult.unidentifyedByFPDFromTaxcom.successfullSells > 0"
          class="bad"
        >
          В Taxcom есть
          {{ fiscalResult.unidentifyedByFPDFromTaxcom.successfullSells }}
          {{
            this.casesHandler(
              fiscalResult.unidentifyedByFPDFromTaxcom.successfullSells,
              "продажа"
            )
          }}
          на сумму
          {{
            fiscalResult.unidentifyedByFPDFromTaxcom.totalSum.toLocaleString(
              "ru-Ru"
            )
          }}
          руб., которых нет в 1С8
        </li>
        <li
          v-if="fiscalResult.unidentifyedByFPDFromTaxcom.refundsQuantity > 0"
          class="bad"
        >
          В Taxcom есть
          {{ fiscalResult.unidentifyedByFPDFromTaxcom.refundsQuantity }}
          {{
            this.casesHandler(
              fiscalResult.unidentifyedByFPDFromTaxcom.refundsQuantity,
              "возврат"
            )
          }}
          на сумму
          {{
            fiscalResult.unidentifyedByFPDFromTaxcom.refundSum.toLocaleString(
              "ru-Ru"
            )
          }}
          руб., которых нет в 1С8
        </li>
        <li v-if="fiscalResult.noSuchFPDInTaxcom.successfullSells" class="bad">
          В 1С8 есть
          {{ fiscalResult.noSuchFPDInTaxcom.successfullSells }}
          {{
            this.casesHandler(
              fiscalResult.noSuchFPDInTaxcom.successfullSells,
              "чек"
            )
          }}
          на сумму
          {{ fiscalResult.noSuchFPDInTaxcom.totalSum.toLocaleString("ru-Ru") }}
          руб., которых нет в Taxcom
        </li>
        <li v-if="fiscalResult.noSuchFPDInTaxcom.refundsQuantity" class="bad">
          В 1С8 есть
          {{ fiscalResult.noSuchFPDInTaxcom.refundsQuantity }}
          {{
            this.casesHandler(
              fiscalResult.noSuchFPDInTaxcom.refundsQuantity,
              "возврат"
            )
          }}
          на сумму
          {{ fiscalResult.noSuchFPDInTaxcom.refundSum.toLocaleString("ru-Ru") }}
          руб., которых нет в Taxcom
        </li>
      </ul>
    </div>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Итог по фискальному регистру из 1С.xlsx">
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
    fiscalResult() {
      return this.$store.getters.getFiscalResult;
    },
    fiscal() {
      return this.$store.getters.getFiscalData;
    }
  },
  methods: {
    casesHandler(num, word) {
      const ch = require("../../../store/casesHandler");
      return ch(num, word);
    },
    addSheets() {
      if (this.fiscalResult.notEqualSumsByFPD.length) {
        this.sheets.push({
          name: "Не сошлись по суммам",
          data: this.fiscalResult.notEqualSumsByFPD,
        });
      }
      if (this.fiscalResult.incorrectCheckbox.length) {
        this.sheets.push({
          name: "Некорректная галочка",
          data: this.fiscalResult.incorrectCheckbox.map((item) => {
            return {
              "Операция с денежными средствами без передачи товаров":
                item["Операция с денежными средствами без передачи товаров"],
              "Торговый объект": item["Торговый объект"],
              "Фискальный признак": item["Фискальный признак"],
              "Регистрационный номер ККТ": item["Регистрационный номер ККТ"],
            };
          }),
        });
      }
      if (this.fiscalResult.notEqualDetailsByFPD.length) {
        this.sheets.push({
          name: "Не сошлись типы платежей",
          data: this.fiscalResult.notEqualDetailsByFPD.map((item) => {
            return {
              "Taxcom наличные": item.cash.taxcom,
              "1С наличные": item.cash.fiscal,
              "Taxcom карта": item.card.taxcom,
              "1С карта": item.card.fiscal,
              "Taxcom аванс": item.advance.taxcom,
              "1С аванс": item.advance.fiscal,
              "Taxcom кредит": item.credit.taxcom,
              "1С рассрочка": item.credit.fiscal,
              "Фискальный признак": item.fpd,
            };
          }),
        });
      }
      if (this.fiscalResult.unidentifyedByFPDFromTaxcom.documents.length) {
        this.sheets.push({
          name: "Есть в Taxcom, нет в 1С",
          data: this.fiscalResult.unidentifyedByFPDFromTaxcom.xlsx,
        });
      }
      if (this.fiscalResult.noSuchFPDInTaxcom.xlsx.length) {
        this.sheets.push({
          name: "Есть в 1C, нет в Taxcom",
          data: this.fiscalResult.noSuchFPDInTaxcom.xlsx,
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
</style>