<template>
  <form class="employees__form">
    <h3>Загрузить расстановку (попросить у КО)</h3>
    <input type="file" id="file" @change="onChangePositionData" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setPositionsData(collection) }}
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
    onChangePositionData(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setPositionsData(data) {
      if (data) {
        this.$store.dispatch("positionsHandler", data);
      }
    },
  },
};
</script>