<template>
  <form class="employees__form">
    <h3>Загрузить отчет по ссылкам</h3>
    <input type="file" id="file" @change="onChangePayLinksReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setPayLinksReportData(collection) }}
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
    onChangePayLinksReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setPayLinksReportData(data) {
      if (data) {
        this.$store.dispatch("setPayLinksData", data);
      }
    },
  },
};
</script>