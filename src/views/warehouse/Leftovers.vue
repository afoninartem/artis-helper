<template>
  <section class="leftovers">
    <h1>Минимальные остатки</h1>
    <h3 class="add-title">Добавить материал</h3>
    <form action="" class="add-leftover">
      <label for="name">Материал</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Копия из 1С"
        v-model="name"
        required
      />
      <label for="minLeftover">Минимальный остаток</label>
      <input
        type="number"
        name="minLeftover"
        id="minLeftover"
        placeholder="Расход за 2 месяца"
        v-model="left"
        required
      />
      <button class="submit" @click.prevent="addLeftover">Добавить</button>
    </form>
    <hr />
    <form action="">
      <div class="leftovers__item" v-for="left in leftovers" :key="left.id">
        <label class="label" :for="left.id">{{ left.name }}</label>
        <input
          type="number"
          :name="left.name"
          :id="left.id"
          v-model="left.minimalLeftover"
          @change="update"
        />
      </div>
    </form>
  </section>
</template>

<script>
import { db } from "../../main";
export default {
  data() {
    return {
      name: "",
      left: "",
    };
  },
  methods: {
    async addLeftover() {
      const payload = {
        name: this.name.trim(),
        minimalLeftover: Number(this.left),
        id: Date.now().toString(),
      };
      this.name = "";
      this.left = "";
      // console.log(payload);
      await this.$store.dispatch("addMinimalLeftover", payload);
      await this.$store.dispatch("updateLeftoversDate");
      await this.$store.dispatch("setActualLeftovers");
    },
    async update(event) {
      this.leftovers.forEach((el) => {
        if (el.id === event.target.id) {
          console.log(el)
          el.minimalLeftover = event.target.value;
          db.collection("warehouse/shipment/leftovers")
            .doc(el.id)
            .update({ minimalLeftover: +el.minimalLeftover });
        }
      });
      await this.$store.dispatch("updateLeftoversDate");
      await this.$store.dispatch("setActualLeftovers");
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualLeftovers");
  },
  computed: {
    leftovers() {
      return this.$store.getters.getActualStates.leftovers;
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
  .leftovers__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: max-content;
    margin: 0 auto;
    label {
      text-align: right;
    }
    input {
      width: max-content;
      text-align: center;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  .submit {
    grid-column: 1/3;
  }
}
</style>
