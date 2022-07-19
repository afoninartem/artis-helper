<template>
  <div class="add-car-popup" v-if="show">
    <div class="add-car-popup__background">
      <div class="add-car-popup__content">
        <form action="" class="add-car__form">
          <label for="number">Номер машины:</label>
          <input
            type="text"
            name="number"
            id="number"
            :placeholder="
              dataToChange ? `${dataToChange.number}` : `Цифры номера`
            "
            v-model="number"
            required
          />
          <label for="mark">Марка машины:</label>
          <input
            type="text"
            name="mark"
            id="mark"
            :placeholder="
              dataToChange ? `${dataToChange.mark}` : `например, Исузу`
            "
            v-model="mark"
            required
          />
        </form>
        <div class="buttons">
          <button @click.prevent="addCar" v-if="!dataToChange">
            Добавить машину
          </button>
          <button @click.prevent="saveCar" v-if="dataToChange">
            Сохранить изменения
          </button>
          <button @click.prevent="closePopUp">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: "",
      mark: "",
    };
  },
  methods: {
    async closePopUp() {
      await this.$store.dispatch("stopChangeCarData");
      return await this.$store.dispatch("closeCarPopup");
    },
    async addCar() {
      await this.$store.dispatch("addCar", {
        number: this.number,
        mark: this.mark,
      });
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("setActualCatalogCars");
      this.number = "";
      this.mark = "";
      return await this.$store.dispatch("closeCarPopup");
    },
    async saveCar() {
      const payload = {
        oldData: this.dataToChange,
        newData: { number: this.number, mark: this.mark },
      };
      await this.$store.dispatch("saveCar", payload);
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("setActualCatalogCars");
      this.number = "";
      this.mark = "";
      return await this.$store.dispatch("closeCarPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getCarPopupVisibility;
    },
    dataToChange() {
      return this.$store.getters.getCarChangeData;
    },
  },
};
</script>

<style lang="scss" >
.add-car-popup {
  .add-car-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(74, 135, 192);
    .add-car-popup__content {
      transform: scale(2);
      .add-car__form {
        display: grid;
        padding: 20px;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: max-content;
        margin: 0 auto;

        label {
          text-align: right;
          // vertical-align: middle;
          // display: grid;
          // place-content: center;
        }
        input {
          // width: max-content;
          text-align: center;
          width: 200px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none; // не работает в FF почему-то
          margin: 0;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        // grid-column: 1/3;
        button {
          padding: 5px;
          width: 30%;
        }
      }
    }
  }
}
</style>