<template>
  <div class="today-working">
    <h1>{{ new Date(Date.now()).toLocaleDateString() }}</h1>
    <div class="today-working__grid">
      <h2>ВАРИАНТ 1</h2>
      <table v-if="todayWorks">
        <thead>
          <tr>
            <th>Машина</th>
            <th>№</th>
            <th>Сотрудник</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(car, c) in todayWorks" :key="`car-table-${c}`">
            <td :rowspan="car.length">{{ c }}</td>
            <td>{{car[0]}}</td>
          </tr>
        </tbody>
      </table>
      <h2>ВАРИАНТ 2</h2>
      <div class="cars-grid" v-if="todayWorks">
        <div
          class="car"
          v-for="(car, c) in Object.keys(todayWorks)"
          :key="`car-${c}`"
        >
          <div class="card">
            <div class="card__title">{{ car }}</div>
            <div
              class="card__driver"
              v-for="(driver, d) in todayWorks[car]"
              :key="`driver-card-${d}`"
            >
              {{ driver }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate) {
      const counter = require("../../store/service/sheduleCounter");
      return counter.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
  },
  computed: {
    todayWorks() {
      if (!this.cars || !this.drivers) return null;
      const array = [];
      const today = new Date(Date.now()).toLocaleDateString();
      console.log(today);
      this.cars
        .filter((car) => car.crew.length)
        .forEach((car) =>
          car.crew.forEach((driverID) => {
            const driver = this.drivers
              .filter((d) => d.driverID === driverID)[0]
              .carslist.filter((c) => c.carID === car.carID)[0];
            // console.log(this.sheduleCounter(driver.sheduleStart, driver.sheduleType, driver.sheduleShift, today))
            if (
              this.sheduleCounter(
                driver.sheduleStart,
                driver.sheduleType,
                driver.sheduleShift,
                today
              )
            )
              array.push(driver);
          })
        );
      const result = {};
      array.forEach((item) =>
        result[item.car]
          ? result[item.car].push(item.name)
          : (result[item.car] = [item.name])
      );
      return result;
    },
    todayWorksByCars() {
      if (!this.todayWorks) return null;
      const result = {};
      this.todayWorks.forEach((item) => {
        result[item.car]
          ? result[item.car].push(item.name)
          : (result[item.car] = [item.name]);
      });
      return result;
    },
    drivers() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? Array.from(this.$store.getters.getActualStates.catalogDrivers)
            .filter((driver) => {
              return driver.carslist && driver.carslist.length;
            })
            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
        : null;
    },
    cars() {
      return this.$store.getters.getActualStates.catalogCars && this.drivers
        ? Array.from(this.$store.getters.getActualStates.catalogCars).sort(
            (a, b) => (a.number > b.number ? 1 : b.number > a.number ? -1 : 0)
          )
        : null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.cars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  .car {
    .card {
      border: 0.5px solid black;
      border-radius: 5px;
      // padding: 5px;
      &__title {
        background: #ccc;
        font-weight: bold;
        font-size: 24px;
      }
      &__driver {
        // border: .5px solid black;
        padding: 5px;
      }
    }
  }
}
</style>