<template>
  <section class="storage">
    <form class="add-room-item">
      <h2>Материалы, хранящиеся в кабинете</h2>
      <input type="text" name="roomItem" id="roomItem" v-model="material" />
      <button @click.prevent="addMaterial">Добавить</button>
    </form>
    <hr />
    <ul class="room-storage">
      <li v-for="(item, i) in storage" :key="i">
        {{ i + 1 }}. {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      material: "",
    };
  },
  created: async function () {
    await this.$store.dispatch("setActualStorage");
  },
  methods: {
    async addMaterial() {
      const payload = this.material;
      this.material = "";
      await this.$store.dispatch("addStorage", payload);
      await this.$store.dispatch("updateStorageDate");
      await this.$store.dispatch("setActualStorage");
    },
  },
  computed: {
    storage() {
      return this.$store.getters.getActualStates.storage;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  -webkit-column-count: 3; /* Chrome, Safari, Opera */
  -moz-column-count: 3; /* Firefox */
  column-count: 3;
  padding: 20px;
  li {
    padding: 5px;
    text-align: left;
  }
}
hr {
  margin: 20px;
}
</style>