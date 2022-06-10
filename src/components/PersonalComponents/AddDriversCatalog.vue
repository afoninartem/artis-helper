<template>
  <form class="drivers__form">
    <h3>Обновить каталог водителей (1С7)</h3>
    <input type="file" id="file" @change="onChangeDriversCatalog" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setDriversCatalogData(collection) }}
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
    onChangeDriversCatalog(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setDriversCatalogData(data) {
      if (data) {
        this.$store.dispatch("addDriversCatalog", data);
        this.$store.dispatch("updateCatalogDriversDate");
        this.$store.dispatch("setActualCatalogDrivers");
      }
    },
  },
};
</script>