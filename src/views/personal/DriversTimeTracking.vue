<template>
  <div class="drivers">
    <h1>Водители</h1>
    <div class="add-block">
      <AddDriversTimeSheet1C7 v-if="!info1C7" />
      <AddDriversTimeSheet1C8A21 v-if="!info1C8_A21" />
      <AddDriversTimeSheet1C8AP v-if="!info1C8_AP" />
      <AddDriversTimeSheet1C8DP v-if="!info1C8_DP" />
    </div>

    <hr />

    <div class="car" v-for="(car, c) in cars" :key="c">
      <div class="car-crew-info" v-if="car.crew.length">some summary</div>

      <table v-if="car.crew.length">
        <thead>
          <tr>
            <th
              :colspan="
                numberOfDays(date.year, date.month) + headerTemplate.length
              "
            >
              {{ car.mark.toUpperCase() }} {{ car.number }}
            </th>
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
              v-for="(head, h) in headerTemplate"
              :key="`header-template-${h}`"
              rowspan="2"
            >
              {{ head }}
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
        <tbody v-for="(driver, d) in car.crewDetails" :key="`driver-info-${d}`">
          <tr>
            <td :rowspan="driver.rowspan">{{ d + 1 }}</td>
            <td :rowspan="driver.rowspan">{{ driver.name }}</td>
            <td>Отдел сервиса</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
              :style="
                setStyle(
                  new Date(date.year, date.month, day.dayOfMonth),
                  driver,
                  day
                )
              "
            >
              {{
                count(
                  driver.sheduleStart,
                  driver.sheduleType,
                  driver.sheduleShift,
                  new Date(date.year, date.month, day.dayOfMonth)
                )
              }}
            </td>
          </tr>
          <tr v-if="driver.info1C8">
            <td>1C8</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
              :style="
                setStyle(
                  new Date(date.year, date.month, day.dayOfMonth),
                  driver,
                  day
                )
              "
            >
              {{
                driver.info1C8.some(
                  (k) =>
                    k[0].split(" ")[0] === day.dayOfMonth.toString() &&
                    k[0].split(" ")[1].toLowerCase() === day.weekday
                )
                  ? "X"
                  : null
              }}
            </td>
          </tr>
          <tr v-if="driver.info1C7">
            <td>1C7 (факт)</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
              :style="
                setStyle(
                  new Date(date.year, date.month, day.dayOfMonth),
                  driver,
                  day
                )
              "
            >
              {{
                compareDates(
                  driver.info1C7,
                  new Date(date.year, date.month, day.dayOfMonth)
                )
                  ? "X"
                  : null
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!drivers">Загружаем список сотрудников</p>
  </div>
</template>

<script>
// import AddDriversCatalog from "@/components/PersonalComponents/AddDriversCatalog";
import AddDriversTimeSheet1C7 from "@/components/PersonalComponents/AddDriversTimeSheet1C7";
import AddDriversTimeSheet1C8A21 from "@/components/PersonalComponents/AddDriversTimeSheet1C8_A21";
import AddDriversTimeSheet1C8AP from "@/components/PersonalComponents/AddDriversTimeSheet1C8_AP";
import AddDriversTimeSheet1C8DP from "@/components/PersonalComponents/AddDriversTimeSheet1C8_DP";
export default {
  components: {
    AddDriversTimeSheet1C7,
    AddDriversTimeSheet1C8A21,
    AddDriversTimeSheet1C8AP,
    AddDriversTimeSheet1C8DP,
    // AddDriversCatalog,
  },
  data() {
    return {
      headerTemplate: ["#", "ФИО", "Источники данных"],
      date: {
        month: null,
        year: null,
      },
    };
  },
  methods: {
    setStyle(date, driver, day) {
      // console.log(date, driver)
      if (!driver.info1C7 || !driver.info1C8) return;
      const redBG = "background: rgba(225, 100, 100, 0.7)";
      const redBGredColor = "background: rgba(225, 100, 100, 0.7); color: red"
      const greenBG = "background: rgba(99, 223, 126, 0.7)";
      const orangeBG = "background: rgba(245, 215, 83, 0.7)"
      // const result = { service: null, info1C7: null, info1C8: null };
      const service = this.count(
        driver.sheduleStart,
        driver.sheduleType,
        driver.sheduleShift,
        date
      );
      const info1C7 = driver.info1C7
        ? this.compareDates(driver.info1C7, date)
        : null;
      const info1C8 = driver.info1C8
        ? driver.info1C8.some(
            (k) =>
              k[0].split(" ")[0] === day.dayOfMonth.toString() &&
              k[0].split(" ")[1].toLowerCase() === day.weekday
          )
        : null;
      const allGood = service && info1C7 && info1C8;
      const sheduleButNoFact = service && info1C8 && !info1C7;
      const factButNoShedule = !service && !info1C8 && info1C7;
      const noData = !service && !info1C7 && !info1C8;
      if (noData) return;
      return allGood ? greenBG : sheduleButNoFact ? orangeBG : factButNoShedule ? redBGredColor : redBG
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
    numberOfDays(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },
    count(sheduleStart, sheduleType, sheduleShift, currDate) {
      const count = require("../../store/service/sheduleCounter");
      return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
    compareDates(arrayOfDates, date) {
      const dateHandler = require("../../store/dateHandler");
      const handledArrayOfDates = arrayOfDates.map((date) =>
        dateHandler.getFullDate(date)
      );
      const handledDate = dateHandler.getFullDate(date);
      return handledArrayOfDates.includes(handledDate);
    },
    crew(car) {
      const driverlist = car.crew;
      const crew = [];
      Array.from(driverlist).forEach((id) => {
        const driver = this.drivers.filter((d) => d.driverID === id)[0];
        const result = driver.carslist
          .filter((cl) => cl.carID === car.carID)
          .map((cl) => {
            cl.name = driver.name;
            cl.position = driver.position;
            cl.driverID = driver.driverID;
            return cl;
          })[0];
        result.rowspan = 1;
        if (this.info1C7) {
          result.rowspan += 1;
          result.info1C7 = Array.from(this.info1C7).filter(
            (i) => i.driverID === id
          ).length
            ? Array.from(this.info1C7)
                .filter((i) => i.driverID === id)[0]
                .workDays.map((date) => {
                  const d = date.split(".");
                  return new Date(`${d[1]}.${d[0]}.${d[2]}`);
                })
            : null;
        }
        if (this.info1C8.length) {
          result.rowspan += 1;
          result.info1C8 = Array.from(this.info1C8)
            .filter((i) => Object.entries(i)[1][1] === result.name)
            .flat()
            .map((o) => Object.entries(o))
            .flat()
            .filter((k) => parseInt(k[0]))
            .filter((k) => k[1].trim().length > 1);
        }
        crew.push(result);
      });
      return crew.flat();
    },
  },
  computed: {
    cars() {
      return this.$store.getters.getActualStates.catalogCars
        ? Array.from(this.$store.getters.getActualStates.catalogCars)
            ?.sort((a, b) => a.number - b.number)
            .map((car) =>
              Object.assign(car, {
                crewDetails: this.crew(car),
              })
            )
        : null;
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
    info1C7() {
      return this.$store.getters.get1C7info;
    },
    info1C8() {
      return []
        .concat(this.info1C8_A21, this.info1C8_AP, this.info1C8_DP)
        .filter((d) => d !== null);
    },
    info1C8_A21() {
      return this.$store.getters.get1C8info_A21;
    },
    info1C8_AP() {
      return this.$store.getters.get1C8info_AP;
    },
    info1C8_DP() {
      return this.$store.getters.get1C8info_DP;
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
tbody {
  box-shadow: 0 0 0 2px black;
}

tbody:nth-child(2n + 1) > tr > td {
  background: #ccc;
}
.car:not(:last-child) {
  margin-bottom: 15px;
}
.add-block {
  display: flex;
  justify-content: space-around;
}
.test {
  color: rgba(245, 215, 83, 0.705);
}
</style>