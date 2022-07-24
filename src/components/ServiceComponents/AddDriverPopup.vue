<template>
  <div class="add-driver-popup" v-if="show">
    <div class="add-driver-popup__background">
      <div class="add-driver-popup__content">
        <h1>Добавить нового сотрудника</h1>
        <p>Желательно скопировать ФИО из 1С, чтобы избежать ошибок.</p>
        <form action="" class="add-driver-popup__form">
          <input type="text" name="name" id="name" v-model="newDriver.name" />
          <select name="position" id="position" v-model="newDriver.position">
            <option v-for="(position, p) in positionsList" :key="p">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      newDriver: {
        name: "",
        position: "",
      },
    };
  },
  methods: {
    async add() {
      if (!this.newDriver.name.trim() || !this.newDriver.position.trim()) return;
      return await this.$store.dispatch("addDriverToCatalog", {
        name: this.newDriver.name,
        position: this.newDriver.position,
      });
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
}
</style>