<template>
  <div class="today-working">
    <h1>{{ new Date(Date.now()).toLocaleDateString() }}</h1>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Сегодня работают.xlsx">
        <button>Скачать</button>
      </xlsx-download>
    </xlsx-workbook>
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
        <tbody
          v-for="(car, c) in todayWorks"
          :key="`car-table-${c}`"
          :style="{ color: car.length > 1 ? `black` : `red` }"
        >
          <tr>
            <td :rowspan="car.length">{{ c }}</td>
            <td>1</td>
            <td>{{ car[0] }}</td>
          </tr>
          <tr v-for="(driver, d) in car.slice(1)" :key="`driver-table-${d}`">
            <td>{{ d + 2 }}</td>
            <td>{{ driver }}</td>
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
            <div
              class="card__title"
              :style="{ background: todayWorks[car].length > 1 ? null : `red` }"
            >
              {{ car }}
            </div>
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
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  methods: {
    sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate) {
      const counter = require("../../store/service/sheduleCounter");
      return counter.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
  },
  computed: {
    sheets() {
      return {
        sheets: {
          name: "Работают сегодня",
          data: this.xlsxData,
        },
      };
    },
    todayWorks() {
      if (!this.cars || !this.drivers) return null;
      const array = [];
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      this.cars
        .filter((car) => car.crew.length)
        .forEach((car) =>
          car.crew.forEach((driverID) => {
            const driver = this.drivers
              .filter((d) => d.driverID === driverID)[0]
              .carslist.filter((c) => c.carID === car.carID)[0];
            if (
              this.sheduleCounter(
                driver.sheduleStart,
                driver.sheduleType,
                driver.sheduleShift,
                new Date(year, month, day)
              )
            ) {
              driver.fullcar = `${car.mark.toUpperCase()} ${car.number}`;
              // console.log(driver.fullcar, driver.name);
              array.push(driver);
            }
          })
        );
      const result = {};
      array.forEach((item) =>
        result[item.fullcar]
          ? result[item.fullcar].push(item.name)
          : (result[item.fullcar] = [item.name])
      );

      return (
        Object.keys(result)
          // .sort()
          .reduce((obj, key) => {
            obj[key] = result[key];
            return obj;
          }, {})
      );
    },
    xlsxData() {
      if (!this.todayWorks)
        return [
          [`Ошибка при загрузке данных, попробуйте скачать файл повторно или обратитесь к Афонину Артему.`],
        ];
      return Object.entries(this.todayWorks)
        .map((item) => {
          return Array.from(item[1]).map((el, i) => {
            return { Машина: item[0], "№": i + 1, Сотрудник: el };
          });
        })
        .flat();
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

tbody:nth-child(2n + 1) > tr > td {
  background: rgba(204, 204, 204, 0.493);
}
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