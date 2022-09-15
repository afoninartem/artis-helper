<template>
  <div class="car-crew-popup" v-if="show" :key="componentKey">
    <div class="car-crew-popup__background">
      <div class="car-crew-popup__content">
        <!-- <h1>{{ car.mark }} {{ car.number }}</h1> -->
        <div class="menu-block">
          <div class="menu-block__car">
            {{ car.mark.toUpperCase() }} <br />
            {{ car.number }}
          </div>
          <div class="menu-block__repair">
            В ремонте с
            <input
              type="date"
              name="repair-start"
              id="repair-start"
              v-model="repairStart"
            />
            по
            <input
              type="date"
              name="repair-end"
              id="repair-end"
              v-model="repairEnd"
            />
          </div>
          <div class="menu-block__crew">
            <form action="" class="car-crew__form">
              <button @click.prevent="showNewEmp = true" v-if="!showNewEmp">
                Добавить сотрудника
              </button>
              <select
                name="positions"
                id="positions"
                v-if="showNewEmp && !showChoiceButtons"
                v-model="newEmp.position"
              >
                <!-- <option :value="newEmp.position"></option> -->
                <option v-for="(position, p) in positions" :key="p">
                  {{ position.toLowerCase() }}
                </option>
              </select>
              <input
                v-if="showNewEmp && !showChoiceButtons"
                v-model="newEmp.name"
                type="text"
                name="name"
                id="name"
                @input="findDriver"
                ref="findDriver"
                placeholder="Введите ФИО сотрудника"
              />
              <div class="btn-block">
                <button
                  v-if="
                    showNewEmp &&
                    newEmp.position &&
                    newEmp.name.split(` `).length > 1 &&
                    !showChoiceButtons
                  "
                  @click.prevent="addToCrew(true)"
                >
                  Добавить в экипаж
                </button>
                <button
                  v-if="
                    showNewEmp &&
                    newEmp.position &&
                    newEmp.name.split(` `).length > 1 &&
                    !showChoiceButtons
                  "
                  @click.prevent="addToCrew(false)"
                >
                  Добавить на замену
                </button>
              </div>

              <!-- <button v-if="showChoiceButtons" @click.prevent="addToCrew(true)">
                Основной экипаж
              </button>
              <button
                v-if="showChoiceButtons"
                @click.prevent="addToCrew(false)"
              >
                Замена / Подработка
              </button> -->
            </form>
          </div>
          <div class="menu-block__months">
            <button @click.prevent="prevMonth">{{ prevMonthTitle }}</button>
            <h2>
              {{
                new Date(date.year, date.month)
                  .toLocaleString("default", {
                    month: "long",
                  })
                  .toUpperCase()
              }}
            </h2>
            <button @click.prevent="nextMonth">{{ nextMonthTitle }}</button>
          </div>
        </div>

        <ul>
          <li
            v-for="(tip, t) in tips"
            :key="t"
            class="tip"
            @click.prevent="setDriver({ driver: tip, car })"
          >
            <p>
              <span style="font-weight: bold">{{ tip.name }}</span
              >, оформлен как
              <span style="font-weight: bold">{{ tip.mainPosition }}</span>
            </p>
          </li>
        </ul>

        <div class="actual-crew">
          <!-- <p v-if="car.crew.length">Действующий экипаж:</p> -->
          <p v-if="!car.crew.length">Экипаж не назначен</p>
          <table v-if="crew.length">
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
                  :style="dayStyles(new Date(date.year, date.month, wd + 1))"
                >
                  {{ dayInfo.weekday }}
                </th>
              </tr>
              <tr>
                <th
                  v-for="(dayInfo, md) in daySpec(date.month, date.year)"
                  :key="`day-of-month-${md}`"
                  :style="dayStyles(new Date(date.year, date.month, md + 1))"
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
                <td
                  @click.prevent="openShedulePopup(driver.driverID)"
                  class="car"
                >
                  {{ driver.name }}
                </td>
                <td
                  @click.prevent="openShedulePopup(driver.driverID)"
                  class="position"
                >
                  {{ driver.position }}
                </td>
                <td
                  class="cell"
                  v-for="(day, d) in header"
                  :key="`date-${d}`"
                  :style="
                    dayStyles(
                      new Date(date.year, date.month, d + 1),
                      driver.extras,
                      carID
                    )
                  "
                  @mousedown="startCollectSelectionCells(driver, day)"
                  @mouseover="collectSelectionCells(driver, day)"
                  @mouseup="stopCollectSelectionCells"
                >
                  {{
                    extrasAndShedule(
                      driver.sheduleStart,
                      driver.sheduleType,
                      driver.sheduleShift,
                      new Date(date.year, date.month, day),
                      driver.extras,
                      driver.carID
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
            <thead v-if="extraCrewData.length">
              <tr>
                <th
                  :colspan="
                    numberOfDays(date.year, date.month) +
                    headerTemplate.length +
                    1
                  "
                >
                  Дополнительно: замены и подработки
                </th>
              </tr>
            </thead>
            <tbody v-if="extraCrewData.length">
              <tr v-for="(extra, e) in extraCrewData" :key="e">
                <td class="number-and-arrows">
                  <span
                    class="arrow-up"
                    @click.prevent="move(e, `up`)"
                    v-if="e > 0"
                  ></span>
                  <span
                    v-if="e < crewData.length - 1"
                    class="arrow-down"
                    @click.prevent="move(e, `down`)"
                  ></span>
                  <span class="number">{{ e + 1 }}</span>
                </td>
                <td
                  @click.prevent="openShedulePopup(extra.driverID)"
                  class="car"
                >
                  {{ extra.name }}
                </td>
                <td
                  @click.prevent="openShedulePopup(extra.driverID)"
                  class="position"
                >
                  {{ extra.position }}
                </td>
                <td
                  class="cell"
                  v-for="(day, d) in header"
                  :key="`date-${d}`"
                  :style="
                    dayStyles(
                      new Date(date.year, date.month, d + 1),
                      extra.extras,
                      carID
                    )
                  "
                  @mousedown="startCollectSelectionCells(extra, day)"
                  @mouseover="collectSelectionCells(extra, day)"
                  @mouseup="stopCollectSelectionCells"
                >
                  {{
                    extrasAndShedule(
                      extra.sheduleStart,
                      extra.sheduleType,
                      extra.sheduleShift,
                      new Date(date.year, date.month, day),
                      extra.extras,
                      extra.carID
                    )
                  }}
                </td>
                <td
                  class="delete-btn"
                  title="Удалять двойным кликом"
                  colspan="2"
                  @dblclick.prevent="
                    removeExtraFromCar({
                      driverID: extra.driverID,
                      carID,
                    })
                  "
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="close-btn" @click.prevent="close">Закрыть</button>
      </div>
    </div>
    <DriverExtraPopup />
  </div>
</template>

<script>
import DriverExtraPopup from "@/components/ServiceComponents/DriverExtraPopup";
export default {
  components: {
    DriverExtraPopup,
  },
  data() {
    return {
      headerTemplate: ["#", "ФИО", "Должность"],
      tips: null,
      date: {
        month: null,
        year: null,
      },
      showNewEmp: false,
      newEmp: {
        position: "",
        name: "",
        driverID: "",
        mainCrew: null,
      },
      showChoiceButtons: false,
      crewData: null,
      extraCrewData: null,
      componentKey: 0,
      mouseIsDown: false,
      selectedDriver: null,
      cellsCollection: [],
      cellsCollectionForStyling: [],
      carID: null,
      repairStart: "",
      repairEnd: "",
    };
  },
  watch: {
    cellsCollectionForStyling(newArr, oldArray) {
      oldArray.forEach((cell) => cell.classList.remove("selected-cells"));
      newArr.forEach((cell) => cell.classList.add("selected-cells"));
    },
  },
  methods: {
    extrasAndShedule(
      sheduleStart,
      sheduleType,
      sheduleShift,
      currDate,
      extras,
      currCarID
    ) {
      const res = require("../../store/service/extrasAndShedule");
      return res.default(
        sheduleStart,
        sheduleType,
        sheduleShift,
        currDate,
        extras,
        currCarID
      );
    },
    async addToCrew(payload) {
      this.newEmp.mainCrew = payload;
      //check if driver else where
      const driver = this.drivers.filter(
        (d) => d.driverID === this.newEmp.driverID
      )[0];
      if (
        this.newEmp.position === "водитель" &&
        driver.carslist.map((d) => d.position).includes("водитель")
      ) {
        alert(
          `Сотрудник ${driver.name} уже назначен водителем на машине ${
            driver.carslist.filter(
              (car) => car.position === this.newEmp.position
            )[0].car
          }. Пожалуйста, проверьте корректность заполнения графика.`
        );
      }
      this.newEmp.mainCrew
        ? await this.$store.dispatch("updateCarCrew", {
            driver: driver,
            position: this.newEmp.position,
            car: this.car,
          })
        : await this.$store.dispatch("updateExtraCrew", {
            driver: driver,
            position: this.newEmp.position,
            car: this.car,
          });
      this.showChoiceButtons = false;
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("setActualCatalogCars");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
    },
    prevMonth() {
      this.date.month === 0
        ? ((this.date.month = 11), (this.date.year -= 1))
        : (this.date.month -= 1);
    },
    nextMonth() {
      this.date.month === 11
        ? ((this.date.month = 0), (this.date.year += 1))
        : (this.date.month += 1);
    },
    async startCollectSelectionCells(driver, day) {
      this.mouseIsDown = true;
      this.cellsCollection = [day];
      this.selectedDriver = driver;
      //styles
      this.cellsCollectionForStyling.push(event.target);
      // event.target.style.background = `rgba(0, 0, 255, 0.2) `;
    },
    async stopCollectSelectionCells() {
      this.mouseIsDown = false;
      const days = this.cellsCollection
        .sort((a, b) => Number(a) - Number(b))
        .map((day) => new Date(this.date.year, this.date.month, day));
      await this.$store.dispatch("openDriverExtraPopup", {
        driver: this.selectedDriver,
        days,
        carID: this.carID,
      });
      this.selectedDriver = null;
      this.cellsCollectionForStyling = [];
    },
    async collectSelectionCells(driver, day) {
      if (
        this.mouseIsDown &&
        this.selectedDriver &&
        driver.driverID === this.selectedDriver.driverID
      ) {
        // console.log(driver, day);
        this.cellsCollection.push(day);
        //styles
        this.cellsCollectionForStyling.push(event.target);
        // event.target.style.background = `rgba(0, 0, 255, 0.2) `;
      }
    },
    // async setExtra(driver, day) {
    //   // console.log(event.target, driver, day);
    //   const days = [day];
    //   console.log(days)
    //   await this.$store.dispatch("openDriverExtraPopup", { driver, days });
    // },
    setCrewData(array) {
      this.crewData = array;
    },
    setExtraCrewData(array) {
      this.extraCrewData = array;
    },
    setCarID(carID) {
      this.carID = carID;
    },
    setRepair(car) {
      if (!car) return;

      this.repairStart;
    },
    move(index, arrow) {
      const swapIndex = arrow === "up" ? index - 1 : index + 1;
      const array = this.crewData;
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
      this.crewData = array;
      this.componentKey += 1;
      return array;
    },
    dayStyles(extras, date, currCarID) {
      const styles = require("../../store/service/sheduleDayStyles");
      return styles.default(extras, date, currCarID);
    },
    async close() {
      this.tips = null;
      this.newEmp.position = "";
      this.newEmp.name = "";
      this.showNewEmp = false;
      this.showChoiceButtons = false;
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
    async openShedulePopup(payload) {
      return await this.$store.dispatch("openShedulePopup", payload);
    },
    // count(sheduleStart, sheduleType, sheduleShift, currDate) {
    //   const count = require("../../store/service/sheduleCounter");
    //   return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
    // },
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
    async showChoice() {
      this.showChoiceButtons = true;
    },
    async setDriver(payload) {
      // this.$refs.findDriver.value = "";
      console.log(payload);
      const carCrew = this.car.crew;
      const driverID = payload.driver.driverID;
      // console.log(carCrew, driverID, carCrew.includes(driverID))
      if (carCrew.includes(driverID))
        return alert(
          `${payload.driver.name} уже назначен на эту машину. Поставьте ему дополнительные рабочие дни, или добавьте его в дополнительную секцию, если он будет работать в другой должности.`
        );
      this.tips = null;
      this.newEmp.name = payload.driver.name;
      this.newEmp.driverID = payload.driver.driverID;
    },
    findDriver() {
      // const str = this.$refs.findDriver.value.toLowerCase();
      const str = event.target.value.toLowerCase();
      if (str.length > 2) {
        this.tips =
          this.drivers.filter((driver) =>
            driver.name.toLowerCase().substring(0, str.length).includes(str)
          ) || null;
        // .slice(0, 4) || null;
      } else {
        this.tips = null;
      }
    },
    async removeExtraFromCar(payload) {
      console.log(payload);
      await this.$store.dispatch("removeExtraFromCar", payload);
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      await this.$store.dispatch("setActualCatalogCars");
    },

    async removeDriverFromCar(payload) {
      console.log(payload);
      await this.$store.dispatch("removeDriverFromCar", payload);
      await this.$store.dispatch("updateCatalogCarsDate");
      await this.$store.dispatch("updateCatalogDriversDate");
      await this.$store.dispatch("setActualCatalogDrivers");
      await this.$store.dispatch("setActualCatalogCars");
    },
  },
  computed: {
    prevMonthTitle() {
      return this.date.month === 0
        ? new Date(this.date.year - 1, 11)
            .toLocaleString("default", {
              month: "long",
            })
            .toUpperCase()
        : new Date(this.date.year, this.date.month - 1)
            .toLocaleString("default", {
              month: "long",
            })
            .toUpperCase();
    },
    nextMonthTitle() {
      return this.date.month === 11
        ? new Date(this.date.year + 1, 0)
            .toLocaleString("default", {
              month: "long",
            })
            .toUpperCase()
        : new Date(this.date.year, this.date.month + 1)
            .toLocaleString("default", {
              month: "long",
            })
            .toUpperCase();
    },
    crew() {
      if (!this.car || !this.drivers) return;

      const crew = this.car.crew.map((id) => {
        const driver = this.drivers.filter((d) => d.driverID === id)[0];
        return driver.carslist
          .filter((car) => car.carID === this.car.carID)
          .map((cl) => {
            return cl;
          });
      });
      this.setCrewData(crew.flat());

      const extraCrew = this.car.extraCrew
        ? this.car.extraCrew.map((extra) => {
            const driver = this.drivers.filter(
              (d) => d.driverID === extra.driverID
            )[0];
            driver.position = extra.position;
            return driver;
          })
        : [];
      this.setExtraCrewData(extraCrew);
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
      const car = id && cars ? cars.filter((car) => car.carID === id)[0] : null;
      this.setCarID(car.carID);
      this.setRepair(car);
      return car;
    },
    positions() {
      return this.$store.getters.getDriversPositions;
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
@import "@/scss/personalTable.scss";
@include personal-table;
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
.cell:hover {
  background: rgba(0, 0, 255, 0.2) !important;
  cursor: pointer;
}
.selected-cells {
  background: rgba(0, 0, 255, 0.2) !important;
}
.car-crew-popup {
  user-select: none;
  .car-crew-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    // background: #fff;
    .car-crew-popup__content {
      // transform: scale(1.2);
      height: 100%;
      display: grid;
      .menu-block {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        gap: 20px;
        background: -moz-linear-gradient(100% 20% 90deg, #e8eaeb, #ededed);
        background: -webkit-gradient(
          linear,
          0% 0%,
          0% 20%,
          from(#ededed),
          to(#e8eaeb)
        );
        height: 100px;
        &__car {
          font-size: 24px;
          font-weight: bold;
        }
        &__months {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        &__crew {
          align-self: center;
          .car-crew__form {
            display: grid;
            padding: 20px;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            width: max-content;
            margin: 0 auto;
            .btn-block {
              grid-column: 1/3;
              display: flex;
              // width: 100%;
              justify-content: space-between;
              button {
                width: 100%;
                text-align: center;
              }
            }
            button {
              font-weight: bold;
              text-align: center;
              grid-column: 1/3;
            }

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
        }
        button {
          border: none;
          padding: 5px;
          width: 120px;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          &:first-child {
            text-align: right;
          }
          &:last-child {
            text-align-last: left;
          }
          &:hover {
            transform: scale(1.1);
          }
        }
      }
      .actual-crew {
        ul {
          li {
            display: flex;
            justify-content: space-between;
          }
        }
      }

      .close-btn {
        width: 20%;
        margin: 0 auto;
      }
      ul {
        list-style: none;
        // margin: 0 auto;
        padding: 0;
        margin: 0;
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