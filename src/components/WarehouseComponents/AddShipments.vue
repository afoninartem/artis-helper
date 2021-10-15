<template>
  <section class="add-shipment">
    <form class="add-shipment__form">
      <h2>Загрузить отгрузки</h2>
      <input type="file" @change="onChangeShipment" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setShipment(collection) }}
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
    onChangeShipment(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    setShipment(data) {
      if (data) {
        this.$store.dispatch("addShipment", data);
      }
    },
  },
};
</script>