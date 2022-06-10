<template>
  <div class="onlineshop-taxcom-preview" v-if="show">
    <h3>Данные по Интернет магазину из Taxcom</h3>
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
    <button @click.prevent="close">Закрыть</button>
    <table>
      <thead>
        <tr>
          <th
            v-for="(head, i) in Object.keys(taxcom.documents[0])"
            :key="`head-${i}`"
          >
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in taxcom.documents" :key="`data-${i}`">
          <td v-for="(item, j) in data" :key="`item-${j}`">{{ item }}</td>
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
  computed: {
    taxcom() {
      return this.$store.getters.getOnlineShopFiltered;
    },
    show() {
      return this.$store.getters.getOnlineShopTaxcomVisibility;
    },
    sheets() {
      return {
        sheets: {
          name: "Интернет магазин по Taxcom",
          data: this.taxcom.documents,
        },
      };
    },
  },
  methods: {
    async close() {
      return await this.$store.dispatch("toggleOnlineShopTaxcomVisibility");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.onlineshop-taxcom-preview {
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