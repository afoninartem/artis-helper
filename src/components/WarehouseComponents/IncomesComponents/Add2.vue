<template>
  <form class="incomes__form form-2" v-if="getFirstArray && !getSecondArray">
    <label for="file">Загрузить отчет Анализ рекламной продукции по поступлениям</label>
    <input type="file" id="file" @change="onChangeSecondReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setSecondReportData(collection) }}
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
    onChangeSecondReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setSecondReportData(data) {
      if (data) {
        this.$store.dispatch("setSecondReportData", data);
      }
    },
  },
  computed: {
    getFirstArray() {
      return this.$store.getters.getFirstArray
    },
    getSecondArray() {
      return this.$store.getters.getSecondArray
    },
  }
};
</script>