<template>
  <section class="add-group-of-shops">
    <form class="add-group-of-shops__form">
      <h2>Добавить список магазинов</h2>
      <input type="file" @change="onChange" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setLGroupOfShops(collection) }}
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
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setLGroupOfShops(data) {
      if (data) {
        Array.from(data).forEach((shop) => {
          if (shop.email !== "null") {
            const newShop = shop;
            newShop.name = shop.name.split("  ").join(" ");
            try {
              this.$store.dispatch("createShop", newShop);
            } catch (error) {
              console.log(error.message);
            }
          }
        });
        this.$store.dispatch("updateShopsDate");
        this.$store.dispatch("setActualShops");
      }
    },
  },
};
</script>