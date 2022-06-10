<template>
  <form class="employees__form">
    <h3>Загрузить отчет Senesys</h3>
    <input type="file" id="file" @change="onChangeSenesysTimeTrackReportData" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setSenesysTimeTrackReportData(collection) }}
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
    onChangeSenesysTimeTrackReportData(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setSenesysTimeTrackReportData(data) {
      if (data) {
        this.$store.dispatch("addSenesysTimeTrackReportData", data);
      }
    },
  },
};
</script>