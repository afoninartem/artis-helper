<template>
  <div class="popup" v-if="show">
    <div class="popup__content">
      <h1>{{ info.driver.name }} - {{ info.driver.car }}</h1>
      <div class="conventions">
        <div
          class="conventions__item"
          v-for="(item, i) in conventions"
          :key="`conventions-item-${i}`"
        >
          <div class="conventions__sample" :style="{ background: item.color }">
            {{ item.cut }}
          </div>
          <div class="conventions__description">{{ item.description }}</div>
        </div>
      </div>
      <div class="block-btn">
        <button class="save-btn" @click.prevent="save">Сохранить</button>
        <button class="close-btn" @click.prevent="close">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conventions: [
        { description: "Отпуск", cut: "О", color: "#FF7F50" },
        { description: "Больничный", cut: "Б", color: "#40E0D0" },
        { description: "Хочет работать", cut: "ХР", color: "#00FF7F" },
        { description: "Неявка", cut: "Н", color: "#B22222" },
      ],
    };
  },
  methods: {
    close() {
      return this.$store.dispatch("closeDriverExtraPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getDriverExtraPopupVisibility;
    },
    info() {
      return this.$store.getters.getDriverExtraPopupDetails;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 100px;
  bottom: 100px;
  left: 100px;
  right: 100px;
  background: #fff;
  border-radius: 25px;
  .popup__content {
    height: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    align-items: center;
    .conventions {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      .conventions__item {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        &:hover {
          transform: scale(1.1);
        }
        .conventions__sample {
          height: 25px;
          width: 25px;
          border: 0.5px solid black;
          display: grid;
          place-content: center;
        }
      }
    }
    .block-btn {
      margin-top: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  }
}
</style>