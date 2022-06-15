<template>
  <div class="add-position-popup" v-if="show">
    <div class="add-position-popup__background">
      <div class="add-position-popup__content">
        <h1>Добавить должность сотруднику</h1>

        <form action="">
          <input type="text" @input="findDriver" v-model="result.name" />
          <select name="position" id="position" v-model="result.position">
            <option v-for="(position, p) in positions" :key="p">
              {{ position.toLowerCase() }}
            </option>
          </select>
          <button @click.prevent="save">Сохранить</button>
          <button @click.prevent="close">Закрыть</button>
        </form>
        <ul>
          <li v-for="(tip, t) in tips" :key="t">
            <p @click.prevent="pickTip(tip)">{{ tip }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: { name: null, position: null },
      tips: null,
      positions: [
        "Водитель",
        "экспедитор",
        "Водитель на своем  авто",
        "ночной экспедитор",
        "д. экспедитор",
        "Рекламатор",
      ],
    };
  },
  methods: {
    findDriver() {
      // const str = this.$refs.findDriver.value.toLowerCase();
      const str = event.target.value.toLowerCase();
      console.log(str);
      if (str.length >= 2) {
        this.tips =
          this.drivers
            .filter((driver) =>
              driver.name.toLowerCase().substring(0, str.length).includes(str)
            )
            .map((d) => d.name)
            .slice(0, 4) || null;
      } else {
        this.tips = null;
      }
    },
    async close() {
      return this.$store.dispatch("closeAddPositionPopup");
    },
  },
  computed: {
    drivers() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? Array.from(this.$store.getters.getActualStates.catalogDrivers).sort(
            (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          )
        : null;
    },
    show() {
      return this.$store.getters.getAddPositionPopupVisibility;
    },
  },
};
</script>

<style lang="scss" scoped>
.delete {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
.delete-btn {
  background: url("../../assets/delete.svg") no-repeat center;
  cursor: pointer;
}
p {
  margin: 5px;
}
.car,
.position {
  cursor: pointer;
}
.add-position-popup {
  .add-position-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    .add-position-popup__content {
      // transform: scale(1.2);
      display: grid;

      form {
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
          text-align: left;
          width: 200px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none; // не работает в FF почему-то
          margin: 0;
        }
      }
      .close-btn {
        width: 20%;
        margin: 0 auto;
      }
      ul {
        list-style: none;
        // margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
        li {
          padding: 2px;
        }
        .tip {
          border: 1px solid #000;
          transform: scale(0.7);
          cursor: pointer;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        // grid-column: 1/3;
        button {
          padding: 5px;
          width: 15%;
        }
      }
    }
  }
}
</style>