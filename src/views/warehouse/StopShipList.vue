<template>
  <section class="stop-ship-list">
    <h1>Стоп-лист для отгрузки материалов</h1>
    <form class="stop-ship-list__add-item">
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Копия из 1С"
        v-model="material"
      />
      <button @click.prevent="addStopItem" class="submit">Добавить</button>
    </form>
    <hr />
    <div class="stop-list">
      <div class="stop-list__item" v-for="stop in stoplist" :key="stop.id">
        <p>{{ stop.name }}</p>
        <button
          @click.prevent="deleteStopItem(stop.id.toString())"
          class="delete"
        >
          Удалить
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      material: "",
    };
  },
  methods: {
    async addStopItem() {
      const stoplistItem = {
        name: this.material.trim(),
        id: Date.now().toString(),
      };
      this.material = "";
      await this.$store.dispatch("addStopListItem", stoplistItem);
      await this.$store.dispatch("updateStopListDate");
      await this.$store.dispatch("setActualStopList");
    },
    async deleteStopItem(id) {
      await this.$store.dispatch("deleteStopItem", id);
      await this.$store.dispatch("updateStopListDate");
      await this.$store.dispatch("setActualStopList");
    },
  },
  computed: {
    stoplist() {
      return this.$store.getters.getActualStates.stoplist;
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualStopList");
    // await this.$store.dispatch("setStopListToVuex", this.stoplist);
  },
};
</script>

<style lang="scss" scoped>
.stop-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  .stop-list__item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    padding: 0 15px;
    border: 1px solid #ccc;
  }
}
</style>