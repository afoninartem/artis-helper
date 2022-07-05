<template>
  <div class="car-crew-popup" v-if="show" :key="componentKey">
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
                  :style="weekendColor(dayInfo)"
                >
                  {{ dayInfo.weekday }}
                </th>
              </tr>
              <tr>
                <th
                  v-for="(dayInfo, md) in daySpec(date.month, date.year)"
                  :key="`day-of-month-${md}`"
                  :style="weekendColor(dayInfo)"
                >
                  {{ dayInfo.dayOfMonth }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(driver, d) in crew" :key="`driver-${d}`">
                <td class="number-and-arrows">
                  <span
                    class="arrow-up"
                    @click.prevent="move(d, `up`)"
                    v-if="d > 0"
                  ></span>
                  <span
                    v-if="d < crewData.length - 1"
                    class="arrow-down"
                    @click.prevent="move(d, `down`)"
                  ></span>
                  <span class="number">{{ d + 1 }}</span>
                </td>
                <td @click.prevent="openShedulePopup(driver.name)" class="car">
                  {{ driver.name }}
                </td>
                <td
                  @click.prevent="openShedulePopup(driver.name)"
                  class="position"
                >
                  {{ driver.position }}
                </td>
                <td
                  v-for="(day, d) in header"
                  :key="`date-${d}`"
                  :style="weekendColor(day)"
                >
                  {{
                    count(
                      driver.sheduleStart,
                      driver.sheduleType,
                      driver.sheduleShift,
                      new Date(date.year, date.month, day)
                    )
                  }}
                </td>
                <td
                  class="delete-btn"
                  title="Удалять двойным кликом"
                  colspan="2"
                  @dblclick.prevent="
                    removeDriverFromCar({
                      driverID: driver.driverID,
                      carID: car.carID,
                    })
                  "
                ></td>
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
      crewData: null,
      componentKey: 0,
    };
  },
  methods: {
    setCrewData(array) {
      this.crewData = array;
    },
    move(index, arrow) {
      const swapIndex = arrow === "up" ? index - 1 : index + 1;
      const array = this.crewData;
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
      console.log(
        array.map((c) => {
          return [c.name, c.driverID];
        }),
        swapIndex
      );
      console.log(this.car.crew);
      this.crewData = array;
      this.componentKey += 1;
      return array;
    },
    weekendColor(day) {
      // console.log(+day, typeof day)
      // console.log(day.hasOwnProperty("weekday"))
      // if (typeof day === "object" && day.hasOwnProperty("weekday"))
      return typeof day === "object" &&
        day.weekday &&
        (day.weekday === "сб" || day.weekday === "вс")
        ? "background: rgba(225, 100, 100, 0.3)"
        : new Date(this.date.year, this.date.month, day).toLocaleString(
            "default",
            { weekday: "short" }
          ) === "сб" ||
          new Date(this.date.year, this.date.month, day).toLocaleString(
            "default",
            { weekday: "short" }
          ) === "вс"
        ? "background: rgba(225, 100, 100, 0.3)"
        : null;
    },
    async close() {
      this.tips = null;
      for (let i = 0; i < this.car.crew.length; i += 1) {
        if (this.car.crew[i] !== this.crewData[i].driverID) {
          await this.$store.dispatch("updateCrewOrder", {
            carID: this.car.carID,
            crewNewOrder: this.crewData.map((c) => c.driverID),
          });
          await this.$store.dispatch("updateCatalogCarsDate");
          await this.$store.dispatch("setActualCatalogCars");
          break;
        }
      }
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
      await this.$store.dispatch("setActualCatalogCars");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
    },
    findDriver() {
      // const str = this.$refs.findDriver.value.toLowerCase();
      const str = event.target.value.toLowerCase();
      if (str.length > 2) {
        this.tips =
          this.drivers
            .filter((driver) =>
              driver.name.toLowerCase().substring(0, str.length).includes(str)
            )
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
      const driverlist = this.car ? this.car.crew : null;
      const crew = [];
      Array.from(driverlist).forEach((id) => {
        const driver = this.drivers.filter((d) => d.driverID === id)[0];
        const result = driver.carslist
          .filter((cl) => cl.carID === this.car.carID)
          .map((cl) => {
            cl.name = driver.name;
            cl.position = driver.position;
            cl.driverID = driver.driverID;
            return cl;
          });
        crew.push(result);
      });
      this.setCrewData(crew.flat());
      return this.crewData;
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
        ? Array.from(this.$store.getters.getActualStates.catalogDrivers)
        : // .sort(
          //     (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          //   )
          null;
    },
    car() {
      const id = this.$store.getters.getCarCrewPopupVisibility
        ? this.$store.getters.getCarCrewPopupVisibility.id
        : null;
      const cars = this.$store.getters.getActualStates.catalogCars
        ? this.$store.getters.getActualStates.catalogCars
        : null;
      return id && cars ? cars.filter((car) => car.carID === id)[0] : null;
      // if (id && cars) {
      //   const car = cars.filter((car) => car.carID === id)[0];
      //   return car;
      // }
      // return null;
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
.number-and-arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 32px;
  height: 32px;
  position: relative;
  .arrow-up {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-bottom: 10px solid black;
    display: none;
    cursor: pointer;
    &:hover {
      border-bottom: 10px solid green;
    }
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-top: 10px solid black;
    display: none;

    position: absolute;
    bottom: 5px;
    cursor: pointer;
    &:hover {
      border-top: 10px solid red;
    }
  }

  &:hover {
    .arrow-up {
      display: block;
    }
    .arrow-down {
      display: block;
    }
    .number {
      display: none;
    }
  }
}
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