<template>
  <form class="employees__form">
    <h3>Загрузить Фискальный отчет из 1С</h3>
    <input type="file" id="file" @change="onChangeFiscalReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setFiscalReportData(collection) }}
          </div>
        </template>
      </xlsx-json>
    </xlsx-read>
  </form>
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
    onChangeFiscalReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setFiscalReportData(data) {
      if (data) {
        this.$store.dispatch("setFiscalReportData", data);
      }
    },
  },
};
</script>