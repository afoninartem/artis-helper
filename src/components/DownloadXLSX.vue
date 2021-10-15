<template>
  <section class="download">
    <xlsx-workbook v-if="checkOrders">
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download>
        <button @click="addSheet">Скачать XLSX</button>
      </xlsx-download>
    </xlsx-workbook>
  </section>
</template>

<script>
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "vue-xlsx/dist/vue-xlsx.es";

export default {
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },

  data() {
    return {
      sheetName: "Заказ визиток и наклеек",
      sheets: [],
      collection: this.$store.state.shopInfoForDownload,
    };
  },

  methods: {
    addSheet() {
      this.sheets.push({ name: this.sheetName, data: [...this.collection] });
    },
  },

  computed: {
    checkOrders() {
      return localStorage.getItem("cards");
    },
  },

};
</script>

<style lang="scss" scoped>
button {
  border: 1px solid #f5df4d;
  background: #f5df4d; 
  padding: 16px 32px;
  font-size: 20px;
  margin-top: 20px;
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
  &:active {
    transform: scale(1);
  }
}
</style>