<template>
    <section class="add-price-items">
    <form class="add-price-items__form">
      <h2>Загрузить перечень изделий из прайса</h2>
      <input type="file" @change="addPriceItems" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ addPriceItemsToDB(collection) }}
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
    addPriceItems(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    addPriceItemsToDB(data) {
      if (data) {
        this.$store.dispatch("addPriceItems", data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>