<template>
  <div class="today-working">
    <div class="today-working__menu">
      <input class="curr-date" type="date" v-model="todayDate" />
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download :filename="`${today}.xlsx`">
          <button class="download-btn">Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>

    <div class="today-working__grid">
      <div class="cars-grid" v-if="todayWorks">
        <div class="car" v-for="(car, ca) in todayWorks" :key="ca">
          <div class="card">
            <div
              class="card__title"
              @click.prevent="openCarCrewPopup(car.carID)"
              :style="{ background: car.crewDetails.length > 1 ? null : `red` }"
              :title="`Открыть график экипажа машины ${car.mark.toUpperCase()} ${
                car.number
              }`"
            >
              {{ car.mark.toUpperCase() }} {{ car.number }}
            </div>
            <div
              class="card__driver"
              @click.prevent="openShedulePopup(driver.driverID)"
              v-for="(driver, dr) in car.crewDetails"
              :key="dr"
              :title="`Открыть график сотрудника ${driver.name}`"
            >
              <span>{{ driver.name }}</span>
              <span
                v-if="driver.todayExtra"
                :style="{
                  background: `${driver.todayExtra.bgColor}`,
                  display: `inline-block`,
                  width: `25px`,
                  heigth: `25px`,
                  border: `1px solid black`,
                  position: `absolute`,
                  right: `20px`,
                }"
                >{{ driver.todayExtra.cut }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <CarCrewPopUp />
    <ShedulePopUp />
  </div>
</template>

<script>
// import { db } from "../../main.js";
import CarCrewPopUp from "@/components/ServiceComponents/CarCrewPopUp";
import ShedulePopUp from "@/components/ServiceComponents/ShedulePopUp";
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
    CarCrewPopUp,
    ShedulePopUp,
  },
  data() {
    return {
      todayDate: new Date(),
      todayDateInput: new Date(),
      date: {
        month: null,
        year: null,
        day: null,
      },
    };
  },
  methods: {
    sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate) {
      const counter = require("../../store/service/sheduleCounter");
      return counter.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
    async openCarCrewPopup(car_id) {
      return await this.$store.dispatch("openCarCrewPopup", car_id);
    },
    async openShedulePopup(name) {
      return await this.$store.dispatch("openShedulePopup", name);
    },
  },
  computed: {
    today() {
      return new Date(this.todayDate).toLocaleDateString();
    },
    sheets() {
      return {
        sheets: {
          name: this.today,
          data: this.xlsxData,
        },
      };
    },
    todayWorks() {
      if (!this.cars || !this.drivers) return null;
      const year = new Date(this.todayDate).getFullYear();
      const month = new Date(this.todayDate).getMonth();
      const day = new Date(this.todayDate).getDate();
      return this.cars
        .filter((car) => car.crew.length)
        .map((car) => {
          const crewDetails = car.crew
            .map((driverID) => {
              const driver = this.drivers.filter(
                (d) => d.driverID === driverID
              )[0];
              const currCar = driver.carslist
                .filter((cl) => cl.carID === car.carID)
                .map((cl) => {
                  cl.extras = driver.extras ? driver.extras : [];
                  return cl;
                })[0];
              return currCar;
            })
            .filter((driver) => {
              if (!driver) return;
              driver.todayExtra = driver.extras
                ? driver.extras.filter(
                    (e) => e.day == new Date(year, month, day).toISOString()
                  ).length
                  ? driver.extras.filter(
                      (e) => e.day == new Date(year, month, day).toISOString()
                    )[0]
                  : null
                : null;
              // console.log(driver.name, driver.todayExtra);
              const sheduleWork = Boolean(
                this.sheduleCounter(
                  driver.sheduleStart,
                  driver.sheduleType,
                  driver.sheduleShift,
                  new Date(year, month, day)
                )
              );
              let result;
              if (!driver.todayExtra) return sheduleWork;
              switch (driver.todayExtra.cut) {
                case `Р`:
                case `ХР`:
                  result = true;
                  break;
                case `Б`:
                case `Н`:
                case `О`:
                case `ДО`:
                  result = sheduleWork ? true : false;
                  break;
              }
              return result;
            });
          car.crewDetails = crewDetails;
          return car;
        })
        .filter((car) => car.crewDetails.length);
    },

    xlsxData() {
      if (!this.todayWorks)
        return [
          [
            `Ошибка при загрузке данных, попробуйте скачать файл повторно, в случае неудачи обратитесь к Афонину Артему.`,
          ],
        ];
      // return Object.entries(this.todayWorks)
      //   .map((item) => {
      //     return Array.from(item[1]).map((el, i) => {
      //       return { Машина: item[0], "№": i + 1, Сотрудник: el };
      //     });
      //   })
      //   .flat();
      return this.todayWorks
        .map((car) =>
          Array.from(
            car.crewDetails.map((driver, d) => ({
              Машина: `${car.mark} ${car.number}`.toUpperCase(),
              "№": d + 1,
              Сотрудник: driver.name,
            }))
          )
        )
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
    this.todayDate = new Date().toISOString().substring(0, 10);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
tbody:nth-child(2n + 1) > tr > td {
  background: rgba(204, 204, 204, 0.493);
}
.today-working {
  .today-working__menu {
    padding: 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .curr-date,
    .download-btn {
      appearance: none;
      padding: 5px 10px;
      border: 1px solid black;
      border-radius: 15px;
      font-size: 24px;
      background: #fff;
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
    .download-btn:hover {
      background-color: #f5df4d;
      // cursor: pointer;
    }
  }
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  .car {
    .card {
      border: 0.5px solid black;
      border-radius: 15px;
      overflow: hidden;
      // padding: 5px;
      &__title {
        background: #ccc;
        font-weight: bold;
        font-size: 24px;
        &:hover {
          cursor: pointer;
          transform: scale(1.1);
        }
      }
      &__driver {
        // border: .5px solid black;
        position: relative;
        padding: 5px;
        display: flex;
        justify-content: center;
        gap: 30px;
        &:hover {
          cursor: pointer;
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>