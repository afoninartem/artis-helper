<template>
  <div class="car-crew-popup" v-if="show">
    <div class="car-crew-popup__background">
      <div class="car-crew-popup__content">
        <h1>{{ car.mark }} {{ car.number }}</h1>
        <div class="actual-crew">
          <p v-if="car.crew.length">Действующий экипаж:</p>
          <p v-if="!car.crew.length">Экипаж не назначен</p>
          <table>
            <thead>
              <tr>
                <th
                  :colspan="
                    numberOfDays(date.year, date.month) + headerTemplate.length
                  "
                >
                  {{ car.mark.toUpperCase() }} {{ car.number }}
                </th>
                <th rowspan="4" class="delete">Удалить</th>
              </tr>
              <tr>
                <th
                  :colspan="
                    numberOfDays(date.year, date.month) + headerTemplate.length
                  "
                >
                  {{
                    new Date(date.year, date.month)
                      .toLocaleString("default", {
                        month: "long",
                      })
                      .toUpperCase()
                  }}
                </th>
              </tr>
              <tr>
                <th
                  v-for="(ht, t) in headerTemplate"
                  :key="`template-${t}`"
                  rowspan="2"
                >
                  {{ ht }}
                </th>
                <th
                  v-for="(dayInfo, wd) in daySpec(date.month, date.year)"
                  :key="`weekday-${wd}`"
                >
                  {{ dayInfo.weekday }}
                </th>
              </tr>
              <tr>
                <th
                  v-for="(dayInfo, md) in daySpec(date.month, date.year)"
                  :key="`day-of-month-${md}`"
                >
                  {{ dayInfo.dayOfMonth }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(driver, d) in crew" :key="`driver-${d}`">
                <td>{{ d + 1 }}</td>
                <td @click.prevent="openShedulePopup(driver.name)" class="car">
                  {{ driver.name }}
                </td>
                <td
                  @click.prevent="openShedulePopup(driver.name)"
                  class="position"
                >
                  {{ driver.position }}
                </td>
                <td v-for="(day, d) in header" :key="`date-${d}`">
                  {{
                    count(
                      driver.sheduleStart,
                      driver.sheduleType,
                      driver.sheduleShift,
                      new Date(date.year, date.month, day)
                    )
                  }}
                </td>
                <td class="delete-btn" colspan="2" @click.prevent="removeDriverFromCar({driverID: driver.driverID, carID: car.carID})"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <form action="" class="car-crew__form">
          <input
            type="text"
            name="name"
            id="name"
            @input="findDriver"
            ref="findDriver"
            placeholder="Введите ФИО сотрудника"
          />
        </form>
        <button class="close-btn" @click.prevent="close">Закрыть</button>
        <ul>
          <li
            v-for="(tip, t) in tips"
            :key="t"
            class="tip"
            @click.prevent="addToCrew({ driver: tip, car })"
          >
            <p>
              {{ tip.name }} -
              <span style="font-weight: bold">{{ tip.position }}</span>
            </p>
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
      headerTemplate: ["#", "ФИО", "Должность"],
      tips: null,
      date: {
        month: null,
        year: null,
      },
    };
  },
  methods: {
    async close() {
      this.tips = null;
      return await this.$store.dispatch("closeCarCrewPopup");
    },
    async openShedulePopup(car_id) {
      return await this.$store.dispatch("openShedulePopup", car_id);
    },
    count(sheduleStart, sheduleType, sheduleShift, currDate) {
      const count = require("../../store/service/sheduleCounter");
      return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
    numberOfDays(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },
    daySpec(month, year) {
      const lastDay = this.numberOfDays(month, year);
      const result = [];
      for (let day = 1; day <= lastDay; day += 1) {
        result.push({
          weekday: new Date(year, month, day).toLocaleString("default", {
            weekday: "short",
          }),
          dayOfMonth: new Date(year, month, day).getDate(),
        });
      }
      return result;
    },
    async addToCrew(payload) {
      this.$refs.findDriver.value = "";
      this.tips = null;
      await this.$store.dispatch("updateCarCrew", payload);
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      await this.$store.dispatch("setActualCatalogCars");
    },
    findDriver() {
      // const str = this.$refs.findDriver.value.toLowerCase();
      const str = event.target.value.toLowerCase();
      if (str.length > 2) {
        this.tips =
          this.drivers
            .filter((driver) => driver.name.toLowerCase().includes(str))
            .slice(0, 4) || null;
      } else {
        this.tips = null;
      }
    },
    async removeDriverFromCar(payload) {
      await this.$store.dispatch("removeDriverFromCar", payload);
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      await this.$store.dispatch("setActualCatalogCars");
    },
  },
  computed: {
    crew() {
      const driverlist = this.car.crew;
      const crew = [];
      Array.from(driverlist).forEach(id => {
        const driver = this.drivers.filter(d => d.driverID === id)[0];
        const result = driver.carslist.filter(cl => cl.carID === this.car.carID).map(cl => {
          cl.name = driver.name;
          cl.position = driver.position;
          cl.driverID = driver.driverID;
          return cl
        })
        crew.push(result)
      })
        console.log("crew:", crew.flat())
      return crew.flat()
    },
    show() {
      return this.$store.getters.getCarCrewPopupVisibility?.show;
    },
    header() {
      // if (!this.numberOfDays) return null;
      // const header = Array.from(this.headerTemplate);
      const header = [];
      const lastDayOfMonth = this.numberOfDays(this.date.month, this.date.year);
      for (let i = 1; i <= lastDayOfMonth; i += 1) {
        const date = new Date(this.date.year, this.date.month, i.toString());
        header.push(date.toLocaleDateString().substring(0, 2));
      }
      return header;
    },
    drivers() {
      return this.$store.getters.getActualStates.catalogDrivers
        ? Array.from(this.$store.getters.getActualStates.catalogDrivers).sort(
            (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          )
        : null;
    },
    car() {
      const id = this.$store.getters.getCarCrewPopupVisibility
        ? this.$store.getters.getCarCrewPopupVisibility.id
        : null;
      const cars = this.$store.getters.getActualStates.catalogCars
        ? this.$store.getters.getActualStates.catalogCars
        : null;

      if (id && cars) {
        const car = cars.filter((car) => car.carID === id)[0];
        return car;
      }
      return null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
    this.date.year = new Date().getFullYear();
    this.date.month = new Date().getMonth();
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
.car-crew-popup {
  .car-crew-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    .car-crew-popup__content {
      // transform: scale(1.2);
      display: grid;
      .actual-crew {
        ul {
          li {
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .car-crew__form__form {
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