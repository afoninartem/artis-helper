<template>
  <div class="shedule-popup" v-if="show.show">
    <div class="shedule-popup__background">
      <div class="shedule-popup__content">
        <h1>{{ driver.name }}</h1>
        <table>
          <thead>
            <tr>
              <th colspan="2">
                {{
                  new Date(date.year, date.month)
                    .toLocaleString("default", { month: "long" })
                    .toUpperCase()
                }}
              </th>
              <th
                v-for="(weekday, w) in this.daySpec(date.month, date.year)"
                :key="w"
              >
                {{ weekday.weekday }}
              </th>
            </tr>
            <tr>
              <th>Должность</th>
              <th>Машина</th>
              <th
                v-for="(monthday, m) in this.daySpec(date.month, date.year)"
                :key="m"
              >
                {{ monthday.dayOfMonth }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in table" :key="i">
              <td>{{ item.position }}</td>
              <td>{{ item.car }}</td>
              <td
                v-for="(day, d) in daySpec(date.month, date.year)"
                :key="d"
                :style="
                  dayStyles(new Date(date.year, date.month, d + 1), item.extras)
                "
              >
                {{
                  item.extras.filter(
                    (e) =>
                      e.day ==
                      new Date(date.year, date.month, d + 1).toISOString()
                  ).length
                    ? item.extras.filter(
                        (e) =>
                          e.day ==
                          new Date(date.year, date.month, d + 1).toISOString()
                      )[0].cut
                    : count(
                        item.sheduleStart,
                        item.sheduleType,
                        item.sheduleShift,
                        new Date(date.year, date.month, d + 1)
                      )
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <form action="">
          <label for="car-and-position">Машина и должность:</label>
          <select
            name="car-and-position"
            id="car-and-position"
            v-model="carNumberAndDriverID"
          >
            <option
              v-for="(option, o) in table"
              :key="o"
              :value="{ id: option.driverID, car: option.car }"
            >
              {{ option.car }} - {{ option.position }}
            </option>
          </select>
          <label for="shedule">Установить график</label>
          <select name="shedule" id="shedule" v-model="sheduleType">
            <option>3/3</option>
            <option>2/2/3</option>
          </select>
          <label for="start" v-if="this.sheduleType === `3/3`">Начиная с</label>
          <input
            type="date"
            name="start"
            id="start"
            v-model="startDate"
            v-if="sheduleType === `3/3`"
          />
          <label for="sheduleShift" v-if="this.sheduleType === `2/2/3`"
            >Выбрать смену</label
          >
          <select
            name="sheduleShift"
            id="sheduleShift"
            v-model="sheduleShift"
            v-if="this.sheduleType === `2/2/3`"
          >
            <option>1</option>
            <option>2</option>
          </select>
        </form>
        <div class="btn-block">
          <button type="submit" @click.prevent="setShedule">
            Установить график
          </button>
          <button @click.prevent="close">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: "",
      conditionalStartDate: "2022-04-01T00:00",
      sheduleShift: null,
      sheduleType: null,
      carNumberAndDriverID: null,
      date: {
        month: null,
        year: null,
      },
    };
  },
  methods: {
    dayStyles(extras, date) {
      const styles = require("../../store/service/sheduleDayStyles");
      return styles.default(extras, date);
    },
    count(sheduleStart, sheduleType, sheduleShift, currDate) {
      const count = require("../../store/service/sheduleCounter");
      return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
    async close() {
      return await this.$store.dispatch("closeShedulePopup");
    },
    async setShedule() {
      if (
        (this.startDate?.length || this.sheduleShift) &&
        this.sheduleType &&
        this.carNumberAndDriverID
      ) {
        await this.$store.dispatch("setShedule", {
          sheduleType: this.sheduleType,
          sheduleStart: this.startDate,
          sheduleShift: this.sheduleShift,
          carNum: this.carNumberAndDriverID.car,
          driverID: this.carNumberAndDriverID.id
        });
        await this.$store.dispatch("updateCatalogDriversDate");
        await this.$store.dispatch("setActualCatalogDrivers");
        await this.$store.dispatch("updateCatalogCarsDate");
        await this.$store.dispatch("setActualCatalogCars");
        this.sheduleType = null;
        this.startDate = null;
        this.driverID = null;
        return await this.$store.dispatch("closeShedulePopup");
      } else {
        alert("Необходимо заполнить все поля формы!");
      }
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
  },
  computed: {
    driver() {
      if (
        !this.$store.getters.getActualStates.catalogDrivers ||
        !this.$store.getters.getActualStates.catalogDrivers.filter(
          (driver) => driver.driverID === this.show.driverID
        ).length
      )
        return;
      return this.$store.getters.getActualStates.catalogDrivers.filter(
        (driver) => driver.driverID === this.show.driverID
      )[0];
    },
    table() {
      if (!this.driver) return;
      return this.driver.carslist.map((cl) => {
        cl.extras = this.driver.extras;
        cl.name = this.driver.name;
        return cl;
      });
    },
    show() {
      return this.$store.getters.getShedulePopupVisibility;
    },
  },
  mounted: async function () {
    this.date.year = new Date().getFullYear();
    this.date.month = new Date().getMonth();
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
  },
};
</script>

<style lang="scss" >
@import "@/scss/personalTable.scss";
@include personal-table;
.shedule-popup {
  .shedule-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    .shedule-popup__content {
      // transform: scale(1.2);
      display: grid;
      place-items: center;
      form {
        display: grid;
        padding: 20px;
        grid-template-columns: max-content 200px;
        // grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: max-content;
        // margin: 0 auto;

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
        select {
          option {
            font-size: 14px;
            text-align: center;
          }
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none; // не работает в FF почему-то
          margin: 0;
        }
      }
      .close-btn {
        width: 50%;
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
          width: 30%;
        }
      }
    }
  }
}
</style>