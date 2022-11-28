<template>
  <div
    class="card"
    v-if="sellingXMLResult"
  >
    <h3>Итог по реализациям</h3>
    <div class="content">
      <ul>
        <li
          v-if="xmlOk"
          class="good"
        >
          Все суммы в Taxcom и файле XML сошлись
        </li>
        <li
          v-if="!amountDiff.ok"
          class="bad"
        >
          Документов в xml: {{amountDiff.xml}}. Документов в Taxcom: {{amountDiff.tax}}.
        </li>
        <li class="bad">
          Найдено {{xlsx.xml.length + xlsx.tax.length}} {{casesHandler(xlsx.xml.length + xlsx.tax.length, "несоответствие")}}.
        </li>
        <!-- <div
          class="extras-xml"
          v-if="sellingXMLResult.extrasXML.length"
        >
          <li
            class="bad"
            v-for="extra, e in sellingXMLResult.extrasXML"
            :key="`xml-${e}`"
          >
            Сумма {{Number(extra.sum).toLocaleString("ru-Ru")}} встречается в файле XML {{extra.xmlEntries}} раз, в Taxcom {{extra.taxcomEntries}} раз.
          </li>
        </div> -->
        <!-- <div
          class="extras-taxcom"
          v-if="sellingXMLResult.extrasTaxcom.length"
        >
          <li
            class="bad"
            v-for="extra, e in sellingXMLResult.extrasTaxcom"
            :key="`tax-${e}`"
          >
            Сумма {{Number(extra["Сумма"]).toLocaleString("ru-Ru")}} встречается в Taxcom {{extra.taxcomEntries}} раз, в файле XML {{extra.xmlEntries}} раз.
          </li>
        </div> -->
      </ul>
    </div>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Детализация XML и Taxcom.xlsx">
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
    sellingXMLResult() {
      return this.$store.getters.getXmlSellings;
    },
    amountDiff() {
      return {
        xml: this.sellingXMLResult.xmlAmount,
        tax: this.sellingXMLResult.taxcomAmount,
        ok:
          this.sellingXMLResult.xmlAmount ===
          this.sellingXMLResult.taxcomAmount,
      };
    },
    xmlOk() {
      return (
        this.sellingXMLResult.xmlAmount ===
          this.sellingXMLResult.taxcomAmount &&
        this.sellingXMLResult.extrasXML.length === 0 &&
        this.sellingXMLResult.extrasTaxcom.length === 0
      );
    },
    xlsx() {
      return {
        xml: this.sellingXMLResult.extrasXML.map((x) => ({
          "Номер документа": x.docNum,
          Клиент: x.client,
          "ИНН/КПП": x.clientInn,
          Сумма: x.sum,
        })),
        tax: this.sellingXMLResult.extrasTaxcom.map((t) => ({
          ФПД: t["ФПД"],
          Сумма: t["Сумма"],
        })),
        firms: this.sellingXMLResult.sellsListFromXML.filter(
          (x) => x.clientInn.length
        ),
      };
    },
  },
  methods: {
    casesHandler(num, word) {
      const ch = require("../../../store/casesHandler");
      return ch(num, word);
    },
    addSheets() {
      if (this.xlsx.tax.length) {
        this.sheets.push({
          name: "Есть в Taxcom, нет в XML",
          data: this.xlsx.tax,
        });
      }
      if (this.xlsx.xml.length) {
        this.sheets.push({
          name: "Есть в XML, нет в Taxcom",
          data: this.xlsx.xml.filter((x) => x.clientInn === ""),
        });
      }
      if (this.sellingXMLResult.sellsListFromXML) {
        this.sheets.push({
          name: "Список продаж из XML",
          data: this.sellingXMLResult.sellsListFromXML.map((x) => ({
            Дата: x.date,
            Номер: x.docNum,
            Код: x.clientCode,
            Клиент: x.clientName,
            Сумма: x.summ,
          })),
        });
      }
      if (this.xlsx.firms.length) {
        this.sheets.push({
          name: "Юрлица",
          data: this.xlsx.firms.map((x) => ({
            Дата: x.date,
            Номер: x.docNum,
            Код: x.clientCode,
            Клиент: x.clientName,
            "ИНН/КПП": x.clientInn,
            Сумма: x.summ,
          })),
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