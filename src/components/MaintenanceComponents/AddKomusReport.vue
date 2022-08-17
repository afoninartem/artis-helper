<template>
  <form class="employees__form">
    <h3>Загрузить отчет Комус</h3>
    <p>
      Отчет выгружается в ЛК, раздел Отчетность, тип отчета - История заказов,
      период - Период согласования. Выгружается .csv, необходимо сохранить как
      .xlsx
    </p>
    <input type="file" id="file" @change="onChangeKomusReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setKomusReportData(collection) }}
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
    onChangeKomusReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setKomusReportData(data) {
      if (data) {
        this.$store.dispatch("setKomusReportData", data);
      }
    },
  },
};
</script>