<template>
  <div class="stock-report">
    <form class="stock-report__form">
      <h3>Загрузить отчет по акции</h3>
      <input type="file" id="file" @change="onChangeStockReportData" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setStockReportData(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </form>
  </div>
</template>

<script>
import { XlsxRead, XlsxJson } from "vue-xlsx/dist/vue-xlsx.es";

export default {
  components: {
    XlsxRead,
    XlsxJson,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    onChangeStockReportData(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setStockReportData(data) {
      if (data) {
        this.$store.dispatch("stockHandler", data);
      }
    },
  },
};
</script>