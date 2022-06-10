<template>
  <form class="incomes__form form-1" v-if="!getFirstArray">
    <label for="file">Загрузить отчет Поступления и отгрузки</label>
    <input type="file" id="file" @change="onChangeFirstReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setFirstReportData(collection) }}
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
    onChangeFirstReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setFirstReportData(data) {
      if (data) {
        this.$store.dispatch("setFirstReportData", data);
      }
    },
  },
  computed: {
    getFirstArray() {
      return this.$store.getters.getFirstArray
    }
  }
};
</script>