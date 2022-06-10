<template>
  <form class="incomes__form form-3" v-if="getSecondArray">
    <div class="manuals"> 
      <p>В отчетный период было поступление инструкций?</p>
      <div class="btn-set">
        <button @click.prevent="manualsShowTrue" class="yes">ДА</button>
        <button @click.prevent="manualsShowFalse" class="no">НЕТ</button>
      </div>
    </div>
    <div class="form-body" v-if="getShowManuals">
      <label for="file"
        >Загрузить отчет Анализ рекламной продукции по поступлениям уч. фурн.
        1</label
      >
      <input type="file" id="file" @change="onChangeThirdReport" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setThirdReportData(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </div>
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
    onChangeThirdReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setThirdReportData(data) {
      if (data) {
        this.$store.dispatch("setThirdReportData", data);
      }
    },
   async manualsShowTrue() {
      await this.$store.dispatch("manualsShowTrue")
    },
   async manualsShowFalse() {
      await this.$store.dispatch("manualsShowFalse")
    },
  },
  computed: {
    getSecondArray() {
      return this.$store.getters.getSecondArray;
    },
    getShowManuals() {
      return this.$store.getters.getShowManual
    }
  },
};
</script>