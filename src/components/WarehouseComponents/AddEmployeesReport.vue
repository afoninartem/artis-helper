<template>
  <form class="employees__form">
    <h3>Загрузить отчет Планирование подарков</h3>
    <input type="file" id="file" @change="onChangeEmployeesReportData" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setEmployeesReportData(collection) }}
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
    onChangeEmployeesReportData(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setEmployeesReportData(data) {
      if (data) {
        this.$store.dispatch("giftsAndPapersHandler", data);
        this.$store.dispatch("giftsHandler_2", data)
      }
    },
  },
};
</script>