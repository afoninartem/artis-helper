<template>
  <div class="popup" v-if="show">
    <div class="popup__content">
      <h1>{{ info.driver.name }} - {{ info.driver.car }}</h1>
      <div class="conventions">
        <div
          class="conventions__item"
          v-for="(item, i) in conventions"
          :key="`conventions-item-${i}`"
          @click.prevent="setExtra(item)"
        >
          <div class="conventions__sample" :style="{ background: item.color }">
            {{ item.cut }}
          </div>
          <div class="conventions__description">{{ item.description }}</div>
        </div>
        <div class="conventions__item" @click.prevent="setExtra({color: `#fff`, description: `Очистить`, cut: `delete`})">
          <div class="conventions__sample"></div>
          <div class="conventions__description">Очистить</div>
        </div>
      </div>
      <div class="dates" v-if="info" ref="dates">
        <div v-if="info.days.length === 1">
          {{ info.days[0].toLocaleString().split(",")[0] }}
        </div>
        <div v-if="info.days.length > 1">
          {{ info.days[0].toLocaleString().split(",")[0] }} -
          {{ info.days[info.days.length - 1].toLocaleString().split(",")[0] }}
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
      result: null,
    };
  },
  methods: {
    async close() {
      return await this.$store.dispatch("closeDriverExtraPopup");
    },
    setExtra(item) {
      console.log(item);
      const dates = this.$refs.dates;
      console.log(dates);
      dates.style.background = item.color;
      this.result = {
        days: Array.from(this.info.days).map((day) => ({ day: day.toString(), cut: item.cut, bgColor: item.color })),
      };
    },
    async save() {
      if (!this.result) return;
      const result = this.result;
      result.driverID = this.info.driver.driverID;
      await this.$store.dispatch("updateExtras", result);
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      return await this.$store.dispatch("closeDriverExtraPopup");
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
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    .conventions {
      margin-bottom: auto;
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
    .dates {
      margin: auto;
      transform: translateY(-100px);
      font-size: 24px;
      font-weight: bold;
      padding: 10px;
      border: 1px solid black;
    }
    .block-btn {
      // margin-top: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  }
}
</style>