<template>
  <form class="employees__form">
    <h3>Загрузить Акт сверки Комус</h3>
    <input type="file" id="file" @change="onChangeKomusCompareAct" />
    <xlsx-read :file="file">
      <xlsx-json>
        <template #default="{ collection }">
          <div style="display: none">
            {{ setKomusCompareActData(collection) }}
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
    onChangeKomusCompareAct(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setKomusCompareActData(data) {
      if (data) {
        this.$store.dispatch("setKomusCompareActData", data);
      }
    },
  },
};
</script>