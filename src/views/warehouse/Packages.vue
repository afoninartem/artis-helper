<template>
  <section class="packages">
    <h1>Количество материалов в упаковке</h1>
    <form action="" class="add-package">
      <label for="name">Материал</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Копия из 1С"
        v-model="name"
        required
      />
      <label for="name">Краткое наименование</label>
      <input
        type="text"
        name="shortName"
        id="shortName"
        placeholder="Уточнить у Афонина"
        v-model="short"
        required
      />
      <label for="package">Количество в упаковке</label>
      <input
        type="number"
        name="package"
        id="package"
        placeholder="Целое число"
        v-model="pack"
        required
      />
      <button class="submit" @click.prevent="addPackage">Добавить</button>
    </form>
    <form action="">
      <ul class="packages__list">
        <li
          class="packages__item"
          v-for="pack in packages"
          :key="pack.id"
          :id="pack.id"
        >
          <label class="label" :for="pack.id">{{ pack.name }}</label>
          <input
            type="number"
            :name="pack.id"
            v-model="pack.quan"
            @change="updatePackage(pack)"
          />
          <button @click.prevent="deletePackage(pack.id)">Удалить</button>
        </li>
      </ul>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      short: "",
      pack: "",
    };
  },
  methods: {
    async addPackage() {
      const newPackage = {
        id: Date.now(),
        name: this.name,
        shortName: this.short,
        quan: this.pack,
      };
      await this.$store.dispatch("addPackage", newPackage);
      await this.$store.dispatch("updatePackagesDate");
      await this.$store.dispatch("setActualPackages");
    },
    async updatePackage(pack) {
      await this.$store.dispatch("updatePackage", pack);
      await this.$store.dispatch("updatePackagesDate");
      await this.$store.dispatch("setActualPackages");
    },
    async deletePackage(id) {
      await this.$store.dispatch("deletePackage", id);
      await this.$store.dispatch("updatePackagesDate");
      await this.$store.dispatch("setActualPackages");
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualPackages");
  },
  computed: {
    packages() {
      return this.$store.getters.getActualStates.packages;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-package {
  display: grid;
  padding: 20px;
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

  .submit {
    grid-column: 1/3;
  }
}
.packages__list {
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: max-content;
  margin: 0 auto;
  .packages__item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    padding: 15px;
    border: 1px solid #ccc;
    label {
      text-align: right;
    }
    input {
      width: 50px;
      text-align: center;
      align-self: flex-end;
      margin-left: auto;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>

