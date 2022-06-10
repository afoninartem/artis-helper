<template>
  <form class="employees__form">
    <h3>Загрузить отчет Taxcom</h3>
    <input type="file" id="file" @change="onChangeTaxcomReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setTaxcomReportData(collection) }}
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
    onChangeTaxcomReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setTaxcomReportData(data) {
      if (data) {
        this.$store.dispatch("setTaxcomData", data);
      }
    },
  },
};
</script>