<template>
      <form class="komus__form">
      <h2>Загрузить счет Комус</h2>
      <input type="file" id="file" @change="onChangeKomus" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setKomus(collection) }}
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
    onChangeKomus(event) {
      localStorage.removeItem("leftovers");
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setKomus(data) {
      if (data) {
        this.$store.dispatch("komusHandler", data);
      }
    },
  },
};
</script>