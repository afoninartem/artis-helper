<template>
  <section class="colors">
    <h2>Цвета для машин в отгрузочной таблице</h2>
    <form>
      <div class="new-color" @click.prevent="changeColor">
        <span>Создай</span>
        <span>свой</span>
        <span>цвет</span>
        <span class="hidden-color-name"></span>
      </div>
      <button class="add-color" @click.prevent="addColor">
        Добавить цвет в палитру
      </button>
    </form>
    <hr />
    <ul class="colors-list">
      <li v-for="(color, i) in colors" :key="i">
        <div
          class="color__sample"
          :style="{
            background: color.color,
            color: color.dark ? `silver` : `black`,
          }"
        >
          <div
            class="delete-color"
            v-if="colorsNumber > 23"
            @click.prevent="deleteColor(color)"
          ></div>
          <p class="text-color" @click.prevent="toggleTextColor(color)">
            {{ color.color }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import rgb2hex from "rgb2hex";
import { db } from "../../main";
export default {
  name: "Colors",
  created: async function () {
    await this.$store.dispatch("setActualColors");
  },
  methods: {
    async toggleTextColor(color) {
      await db
        .collection("warehouse/shipment/carsColors")
        .doc(color.color)
        .update({ dark: !color.dark });
      await this.$store.dispatch("updateColorsDate");
      await this.$store.dispatch("setActualColors");
    },
    changeColor(event) {
      const target = event.target;
      const back = document.querySelector(".new-color");
      const inputColor = document.createElement(`input`);
      inputColor.type = `color`;
      inputColor.classList.add(`input-color`);
      inputColor.value = target.dataset.backColor;
      inputColor.addEventListener(`input`, (event) => {
        back.style.backgroundColor = event.target.value;
        document.querySelector(".hidden-color-name").textContent = rgb2hex(
          target.style.backgroundColor
        ).hex;
      });
      document.querySelector(".hidden-color-name").textContent = "";
      inputColor.click();
    },
    async addColor() {
      const colorToAdd = document
        .querySelector(".hidden-color-name")
        .textContent.toUpperCase();
      if (colorToAdd) {
        await db
          .collection("warehouse/shipment/carsColors")
          .doc(colorToAdd)
          .set({
            color: colorToAdd,
            dark: false,
          });
        await this.$store.dispatch("updateColorsDate");
        await this.$store.dispatch("setActualColors");
      }
      console.log("empty color");
    },
    async deleteColor(color) {
      await db
        .collection("warehouse/shipment/carsColors")
        .doc(color.color)
        .delete()
        .then(() => {
          console.log(`ЦВЕТ ${color.color} УДАЛЕН`);
        })
        .catch((error) => {
          console.log(error);
        });
      await this.$store.dispatch("updateColorsDate");
      await this.$store.dispatch("setActualColors");
    },
  },
  computed: {
    colors() {
      return this.$store.getters.getActualStates.colors;
    },
    colorsNumber() {
      return this.$store.getters.getActualStates.colors
        ? this.$store.getters.getActualStates.colors.length
        : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.colors {
  display: flex;
  flex-direction: column;
  align-items: center;
}

hr {
  width: 100%;
  margin: 20px;
}

.new-color {
  height: 200px;
  width: 200px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-weight: bold;
  font-size: 22px;
  text-transform: uppercase;
  cursor: pointer;
  span {
    pointer-events: none;
  }
}

.add-color {
  width: 200px;
  height: 40px;
  background: #97999b;
  border: 1px solid #97999b;
  font-weight: bold;
  &:hover {
    // transform: scale(1.05);
    cursor: pointer;
  }
  &:active {
    transform: scale(0.99);
  }
}

.colors-list {
  width: 100%;
  list-style: none;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, auto));
  justify-content: space-between;
  padding: 0;
  margin: 0;
  .color__sample {
    position: relative;
    width: 200px;
    height: 200px;
    display: grid;
    align-content: center;
    font-weight: bold;
    font-size: 24px;
    -webkit-box-shadow: 9px 10px 16px 0px rgba(0, 0, 0, 0.45);
    -moz-box-shadow: 9px 10px 16px 0px rgba(0, 0, 0, 0.45);
    box-shadow: 9px 10px 16px 0px rgba(0, 0, 0, 0.45);
    .delete-color {
      position: absolute;
      right: 0;
      top: 0;
      width: 32px;
      height: 32px;
      opacity: 0.7;
      background: url(../../assets/delete.svg) no-repeat center;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
        opacity: 1;
      }
    }
  }
  .text-color {
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>

