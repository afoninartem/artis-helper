<template>
  <form class="employees__form">
    <h3>Загрузить отчет Интернет магазина</h3>
    <!-- <label for="file">Загрузить отчет Интернет магазина</label> -->
    <input type="file" id="file" @change="onOnlineShopReport" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setOnlineShopData(collection) }}
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
    onOnlineShopReport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setOnlineShopData(data) {
      if (data) {
        this.$store.dispatch("setOnlineShopData", data);
      }
    },
  },
};
</script>