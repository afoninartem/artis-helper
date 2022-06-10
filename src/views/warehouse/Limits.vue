<template>
  <section class="limits">
    <h1>
      Максимально допустимые количества материалов для отгрузки в рядовой ФС
    </h1>
    <form class="add-material">
      <label for="name">Материал</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Копия из 1С"
        v-model="material"
      />
      <label for="">Максимально допустимое количество</label>
      <input
        type="number"
        name="limit"
        id="limit"
        v-model="limit"
        placeholder="Введите макс. количество"
      />
      <button @click.prevent="addLimit" class="submit">Добавить</button>
    </form>
    <hr />
    <div class="limits-list">
      <div class="limits-list__item" v-for="limit in limits" :key="limit.id">
        <label :for="limit.id">{{ limit.name }}</label>
        <input
          type="number"
          :id="limit.id"
          :name="limit.id"
          v-model="limit.limit"
          @change="updateLimit({ id: limit.id, limit: limit.limit })"
        />
        <button @click.prevent="deleteLimit(limit.id)">Удалить</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      material: "",
      limit: "",
    };
  },
  computed: {
    limits() {
      return this.$store.getters.getActualStates.limits;
    },
  },
  created: async function () {
    return await this.$store.dispatch("setActualLimits");
  },
  methods: {
    async addLimit() {
      if (this.material && this.limit) {
        const newLimit = {
          name: this.material.trim(),
          limit: this.limit,
          id: Date.now().toString(),
        };
        this.material = "";
        this.limit = "";
        await this.$store.dispatch("addLimit", newLimit);
        await this.$store.dispatch("updateActualLimits");
        await this.$store.dispatch("setActualLimits");
      }
    },
    async deleteLimit(id) {
      await this.$store.dispatch("deleteLimit", id);
      await this.$store.dispatch("updateActualLimits");
      await this.$store.dispatch("setActualLimits");
    },
    async updateLimit(id) {
      await this.$store.dispatch("updateLimit", id);
      await this.$store.dispatch("updateActualLimits");
      await this.$store.dispatch("setActualLimits");
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: max-content;
  margin: 0 auto;
  .submit {
    grid-column: 1/3;
  }
}
.limits-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  .limits-list__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 20px;
    input {
      border: 1px solid #ccc;
      text-align: center;
    }
  }
}
</style>