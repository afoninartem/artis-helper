<template>
  <section class="komus">
    <h1>Обработка счетов Комус</h1>
    <AddKomus />
    <div class="download-btns">
      <div class="export-xlsx">
        <xlsx-workbook>
          <xlsx-sheet
            :collection="sheet.data"
            v-for="sheet in dicts"
            :key="sheet.name"
            :sheet-name="sheet.name"
          />
          <xlsx-download filename="Справочник.xls">
            <button>Скачать файл для справочника</button>
          </xlsx-download>
        </xlsx-workbook>
      </div>
      <div class="export-xlsx">
        <xlsx-workbook>
          <xlsx-sheet
            :collection="sheet.data"
            v-for="sheet in incs"
            :key="sheet.name"
            :sheet-name="sheet.name"
          />
          <xlsx-download filename="Поступление.xls">
            <button>Скачать файл для поступления</button>
          </xlsx-download>
        </xlsx-workbook>
      </div>
    </div>
  </section>
</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
import AddKomus from "@/components/WarehouseComponents/KomusComponents/AddKomus";
export default {
  components: {
    AddKomus,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  computed: {
    finalData() {
      return this.$store.getters.getKomusArrays;
    },
    dicts() {
      return {
        dicts: {
          name: "Справочник",
          data: this.finalData.dicts,
        },
      };
    },
    incs() {
      return {
        incs: {
          name: "Поступление",
          data: this.finalData.incs,
        },
      };
    },
  },
};
</script>