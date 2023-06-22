<template>
  <div
    class="add-driver-popup"
    v-if="show"
  >
    <div class="add-driver-popup__background" v-if="userGroup == 'personal' || userGroup == 'admin'">
      <div class="add-driver-popup__content">
        <h1>Добавить нового сотрудника</h1>
        <p>Желательно скопировать ФИО из 1С, чтобы избежать ошибок.</p>
        <form
          action=""
          class="add-driver-popup__form"
        >
          <input
            type="text"
            name="name"
            id="name"
            v-model="newDriver.name"
            placeholder="ФИО"
            required
          />
          <input
            type="text"
            name="tin"
            id="tin"
            v-model="newDriver.tin"
            placeholder="ИНН"
            required
          />
          <select
            name="position"
            id="position"
            v-model="newDriver.position"
            required
          >
            <option
              v-for="(position, p) in positionsList"
              :key="p"
            >
              {{ position.toLowerCase() }}
            </option>
          </select>
          <div class="buttons">
            <button @click.prevent="add">Добавить сотрудника</button>
            <button @click.prevent="close">Закрыть</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="userGroup == 'service'">
      <div class="add-driver-popup__background">
        <div class="add-driver-popup__content">
          <h1>Для внесения в справочник нового сотрудника обратитесь в отдел кадров</h1>
          <button @click.prevent="close" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userGroup: "",
      newDriver: {
        name: "",
        tin: "",
        position: "",
      },
    };
  },
  methods: {
    async add() {
      if (
        !this.newDriver.name.trim() ||
        !this.newDriver.position.trim() ||
        !this.newDriver.tin.trim()
      )
        return;
      if (Array.from(this.drivers).includes(this.newDriver.name.trim())) {
        alert(`Сотрудник с таким ФИО уже есть в справочнике.`);
      }
      if (Array.from(this.tins).includes(this.newDriver.tin.trim())) {
        alert(`Сотрудник с таким ИНН уже есть в справочнике.`);
        return;
      }
      if (this.newDriver.tin.trim().length != 12) {
        alert(`ИНН должен содержать 12 цифр`);
        return;
      }
      if (this.newDriver.tin.trim().match(/[\D]+/) && this.newDriver.tin.trim().match(/[\D]+/).length) {
        alert(`ИНН должен содержать только цифры`);
        return;
      }
      await this.$store.dispatch("addDriverToCatalog", {
        name: this.newDriver.name.trim(),
        position: this.newDriver.position.trim(),
        tin: this.newDriver.tin.trim(),
      });
      this.newDriver.name = "";
      this.newDriver.tin = "";
      this.newDriver.position = "";
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      return await this.$store.dispatch("closeAddDriverPopup");
    },
    async close() {
      return await this.$store.dispatch("closeAddDriverPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getAddDriverPopupVisibility;
    },
    positionsList() {
      return this.$store.getters.getDriversPositions;
    },
    drivers() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? new Set(
            this.$store.getters.getActualStates.catalogDrivers.map(
              (driver) => driver.name
            )
          )
        : null;
    },
    tins() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? new Set(
            this.$store.getters.getActualStates.catalogDrivers.map(
              (driver) => driver.inn || ""
            )
          )
        : null;
    },
  },
    mounted: async function () {
    const user = JSON.parse(localStorage.getItem("RT"))
    const userGroup = user ? user.group : null
    this.userGroup = userGroup
  },
};
</script>

<style lang="scss" scoped>
.add-driver-popup {
  user-select: none;
  .add-driver-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    .add-driver-popup__content {
      transform: scale(1.2);
      display: grid;
      .add-driver-popup__form {
        display: grid;
        padding: 20px;
        // grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: max-content;
        margin: 0 auto;
      }
      .buttons {
        display: flex;
        justify-content: center;
        button {
          padding: 5px;
          // width: 15%;
        }
      }
    }
  }
  .close-btn {
    width: 120px;
    height: 40px;
    justify-self: center;
  }
}
</style>