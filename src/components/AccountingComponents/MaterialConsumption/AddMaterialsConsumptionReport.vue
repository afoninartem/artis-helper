<template>
  <form class="material-consumption__form">
    <h3>Загрузить расход материалов из 1С8</h3>
    <input type="file" id="file" @change="onChangeMaterialConsumptionReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setMaterialConsumptionData(collection) }}
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
    onChangeMaterialConsumptionReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setMaterialConsumptionData(data) {
      if (data) {
        this.$store.dispatch("setMaterialConsumptionData", data);
      }
    },
  },
};
</script>