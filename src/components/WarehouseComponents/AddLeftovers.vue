<template>
  <section class="add-leftovers">
    <form class="add-leftovers__form">
      <h2>Загрузить остатки</h2>
      <input type="file" id="file" @change="onChangeLeftovers" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setLeftover(collection) }}
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
    onChangeLeftovers(event) {
      localStorage.removeItem("leftovers");
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setLeftover(data) {
      if (data) {
        this.$store.dispatch("leftoversHandler", data);
      }
    },
  },
};
</script>