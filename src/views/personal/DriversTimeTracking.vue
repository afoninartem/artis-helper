<template>
  <div class="drivers">
    <h1>Водители</h1>
    <AddDriversTimeSheet />
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
          <tr v-if="driver.info1C7">
            <td>1C7</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
            >
              {{
                (new Date(driver.info1C7[0]).toString() === new Date(date.year, date.month, day.dayOfMonth).toString() ? "X" : null)
              }}
            </td>
          </tr>
          <tr v-if="driver.info1C8">
            <td>1C8</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
            >
              {{}}
            </td>
          </tr>
        </tbody>
        <!-- <tbody>
          <tr v-for="(driver, d) in car.crewDetails" :key="`d-${d}`">
            <td rowspan="3">{{ d + 1 }}</td>
            <td rowspan="3">
              {{ driver.name }} <br />
              {{ driver.position.toLowerCase() }}
            </td>
            <td>Отдел сервиса</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
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
          <tr>
            <td>1C7 s</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-1C7-${d}`"
            >
              1C7
            </td>
          </tr>
          <tr>
            <td>1C7 s</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-1C7-${d}`"
            >
              1C7
            </td>
          </tr>
        </tbody> -->
      </table>
    </div>
    <p v-if="!drivers">Загружаем список сотрудников</p>
  </div>
</template>

<script>
// import AddDriversCatalog from "@/components/PersonalComponents/AddDriversCatalog";
import AddDriversTimeSheet from "@/components/PersonalComponents/AddDriversTimeSheet";
export default {
  components: {
    AddDriversTimeSheet,
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
      // console.log(sheduleStart, sheduleType, sheduleShift, currDate)
      const count = require("../../store/service/sheduleCounter");
      return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
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
          });
        if (this.info1C7) {
          result[0].info1C7 = Array.from(this.info1C7)
            .filter((i) => i.driverID === id)[0]
            .workDays.map((date) => {
              const d = date.split(".");
              return `${d[1]}.${d[0]}.${d[2]}`;
            });
        }
        if (this.info1C8) {
          result[0].info1C8 = Array.from(this.info1C7).filter(
            (i) => i.driverID === id
          )[0].workDays;
        }
        result[0].rowspan =
          1 + Boolean(result[0].info1C7 + Boolean(result[0].info1C8));
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
                // info1C7: this.info1C7?.filter((item) =>
                //   car.crew.includes(item.driverID)
                // ),
                // info1C8: this.info1C8,
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
      //add code later
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
@import "@/scss/personalTable.scss";
@include personal-table;
.car:not(:last-child) {
  margin-bottom: 15px;
}
</style>