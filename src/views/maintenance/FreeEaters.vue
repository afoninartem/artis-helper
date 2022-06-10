<template>
  <div class="free-eaters">
    <h1>Бесплатные обеды</h1>
    <form>
      <input type="text" name="name" id="name" v-model="newFreeEater" />
      <button type="submit" @click.prevent="addNewEater">
        Добавить сотрудника
      </button>
    </form>
    <hr />
    <h3>Следующие сотрудники не учитываются при обработке обедов:</h3>
    <ul>
      <li v-for="(eater, i) in this.freeEaters" :key="i">
        <p>{{ eater.name }}</p>
        <button @click.prevent="deleteEater(eater.id)">Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newFreeEater: "",
    };
  },
  methods: {
    async addNewEater() {
      const payload = {name: this.newFreeEater.trim(), id: Date.now().toString()} ;
      this.newFreeEater = "";
      await this.$store.dispatch("addNewEater", payload);
      await this.$store.dispatch("updateActualDinners");
      await this.$store.dispatch("setActualDinners");
    },
    async deleteEater(id) {
      await this.$store.dispatch("deleteEater", id);
      await this.$store.dispatch("updateActualDinners");
      await this.$store.dispatch("setActualDinners");
    },
  },
  computed: {
    freeEaters() {
      return this.$store.getters.getActualStates.dinners;
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualDinners");
  },
};
</script>

<style lang="scss" scoped>
.free-eaters {
  hr {
    margin: 20px 0;
  }
  ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 75%;
    margin: 0 auto;
    li {
      border: 1px solid #ccc;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      padding-left: 30px;
    }
  }
}
</style>
