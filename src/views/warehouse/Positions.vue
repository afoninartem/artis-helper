<template>
  <div class="positions">
    <h1>Подсчет должностей по салонам</h1>
    <AddPositionsReport />
    <xlsx-workbook v-if="positions">
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Должности в рознице.xlsx">
        <button>Скачать</button>
      </xlsx-download>
    </xlsx-workbook>
    <table v-if="positions">
      <thead>
        <tr>
          <th v-for="(head, i) in header" :key="`header-${i}`">
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in positions" :key="`data-${i}`">
          <td v-for="(element, i) in data" :key="`element-${i}`">
            {{ element }}
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
import AddPositionsReport from "@/components/WarehouseComponents/AddPositionsReport";
export default {
  components: {
    AddPositionsReport,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  computed: {
    sheets() {
      const array = [];
      if (this.positions) {
        for (let i in this.positions) {
          array.push(this.positions[i]);
        }
      }

      return {
        sheets: {
          name: "Сводка по должностям",
          data: array,
        },
      };
    },
    positions() {
      return this.$store.getters.getPositions;
    },
    header() {
      return this.positions ? Object.keys(this.positions["Армада"]) : null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
</style>