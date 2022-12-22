<template>
  <form class="drivers__form">
    <h3>Загрузить табель из 1С8 A21</h3>
    <input type="file" id="file" @change="onChangeDriversTimeTrackData" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ add1C8info(collection) }}
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
    onChangeDriversTimeTrackData(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    add1C8info(data) {
      if (data) {
        this.$store.dispatch("add1C8Shedule", {data, company: "A21"});
      }
    },
  },
};
</script>