<template>
    <section class="add-price-items">
    <form class="add-price-items__form">
      <h2>Загрузить список с ценами из 1С</h2>
      <input type="file" @change="addFile" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ addPriceItemsDetailsByName(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </form>
  </section>
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
    addFile(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    addPriceItemsDetailsByName(data) {
      if (data) {
        this.$store.dispatch("addPriceItemsDetailsByName", data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>