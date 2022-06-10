<template>
  <section class="incomes">
    <h1>Агрегация отчета по поступлениям</h1>
    <div class="icomes__input-forms">
      <Add1 />
      <Add2 />
      <Add3 />
    </div>
    <div class="export-xlsx" v-if="showResult === false">
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download>
          <button>Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
  </section>
</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
import Add1 from "@/components/WarehouseComponents/IncomesComponents/Add1";
import Add2 from "@/components/WarehouseComponents/IncomesComponents/Add2";
import Add3 from "@/components/WarehouseComponents/IncomesComponents/Add3";
export default {
  components: {
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
    Add1,
    Add2,
    Add3,
  },
  computed: {
    finalArray() {
      return (
        this.$store.getters.getThirdArray || this.$store.getters.getSecondArray
      );
    },
    result() {
      const result = [];
      let generalSum = 0;
      this.finalArray.forEach((el) => {
        let providerSum = 0;
        if (el.name !== "ПРОЧИЕ Реклама") {
          el.materials.forEach((mat) => {
            if (mat.sum === 0) return
            generalSum += mat.sum;
            providerSum += mat.sum;
            result.push({
              Поставщик: el.name,
              Материал: mat.name,
              Количество: mat.quan,
              Цена: (mat.sum / mat.quan).toFixed(2),
              Сумма: mat.sum,
            });
          });
          result.push({ Поставщик: `Итого ${el.name}`, Сумма: providerSum });
        }
      });
      result.push({ Поставщик: `ИТОГО ВСЕГО`, Сумма: generalSum });
      return result;
    },
    showResult() {
      return this.$store.getters.getShowManual;
    },
    sheets() {
      return {
        sheets: {
          name: "Отчет по поступлениям",
          data: this.result,
        },
      };
    },
  },
};
</script>