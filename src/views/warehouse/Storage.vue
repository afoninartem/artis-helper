<template>
  <section class="storage">
    <form class="add-room-item">
      <h2>Добавить материал, хранящийся в кабинете</h2>
      <input type="text" name="roomItem" id="roomItem" v-model="material">
      <button @click.prevent="addMaterial">Добавить</button>
    </form>
    <ul class="room-storage">
      <li v-for="(item, i) in this.storage" :key="i"> {{item.name}}</li>
    </ul>
  </section>
</template>

<script>
// import { XlsxRead, XlsxJson } from "vue-xlsx/dist/vue-xlsx.es";
import {db} from "../../main"
export default {
  data() {
    return {
      storage: null,
      material: null
    };
  },
  created: async function() {
    const storage = await db.collection("warehouse/storage/roomStorage").get();
    const storageArr = storage.docs.map(doc => doc.data())
    this.storage = storageArr
  },
  methods: {
    addMaterial() {
      this.$store.dispatch("addStorage", this.material);
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 20px;
  li {
    padding: 3px
  }
}
</style>