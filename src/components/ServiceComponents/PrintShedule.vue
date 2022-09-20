<template>
  <div
    class="print-shedule"
    v-if="cars"
  >
    <div class="btn-info-block">
      <button @click.prevent="toPDF">Скачать PDF</button>
      <p v-if="showHint">Скачивание началось, подождите.</p>
      <!-- <meter
        min="0"
        max="100"
        :value="progress"
      ></meter> -->
    </div>
    <div
      class="table-preview-block"
      ref="table"
      style="overflow-x:auto;"
    >

      <table>
        <tbody
          v-for="(car, c) in cars"
          :key="`car-${c}`"
        >
          <thead>
            <tr>
              <th
                class="car"
                :colspan="
                numberOfDays(date.year, date.month) + headerTemplate.length
              "
              >
                {{ car.mark.toUpperCase() }}
                {{ car.number.toUpperCase() }}
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
          <tr
            v-for="driver, d in crew(car)"
            :key="`${car.id}-${d}`"
          >
            <td>
              {{d + 1}}
            </td>
            <td ref="driverName">{{driver.name}}</td>
            <td>{{driver.position}}</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`date-${d}`"
              :style="
                    dayStyles(
                      new Date(date.year, date.month, d + 1),
                      driver.extras,
                      driver.carID
                    )
                  "
            >
              {{
                    extrasAndShedule(
                      driver.sheduleStart,
                      driver.sheduleType,
                      driver.sheduleShift,
                      new Date(date.year, date.month, d + 1),
                      driver.extras,
                      driver.carID
                    )
              }}
            </td>
          </tr>
        </tbody>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      headerTemplate: ["#", "ФИО", "Должность"],
      date: {
        month: null,
        year: null,
      },
      driverCellWidth: null,
      progress: 0,
      showHint: false,
    };
  },
  methods: {
    dayStyles(extras, date, currCarID) {
      const styles = require("../../store/service/sheduleDayStyles");
      return styles.default(extras, date, currCarID);
    },
    extrasAndShedule(
      sheduleStart,
      sheduleType,
      sheduleShift,
      currDate,
      extras,
      currCarID
    ) {
      // console.log(...arguments)
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
    toPDF() {
      this.showHint = true;
      const element = this.$refs.table;
      const options = {
        margin: 0,
        filename: "График",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true, width: "1266" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        jsPDF: { unit: "px", format: "a4", orientation: "p" },
      };
      html2pdf().set(options).from(element).save();
    },
    onProgress(event) {
      // console.log(event);
      this.progress = event;
    },
    count(sheduleStart, sheduleType, sheduleShift, currDate) {
      const count = require("../../store/service/sheduleCounter");
      return count.default(sheduleStart, sheduleType, sheduleShift, currDate);
    },
    crew(car) {
      const crew = [];
      Array.from(car.crew).forEach((driverID) => {
        const driver = this.drivers.some(
          (driver) => driver.driverID === driverID
        )
          ? this.drivers.filter((driver) => driver.driverID === driverID)[0]
          : null;
        if (!driver)
          return alert(
            `DriverID ${driverID} не существует. Машина ${car.number}`
          );
        crew.push(driver.carslist.filter((cl) => cl.carID === car.carID)[0]);
      });
      crew.forEach((cm) => {
        cm.name = cm.name.split(" ")[0];
        cm.position = cm.position.includes(`ночной`)
          ? `ночной`
          : cm.position.includes(`на своем`)
          ? `на своем`
          : cm.position;
        // console.log(cm);
      });

      return crew;
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
    weekendColor(day) {
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
  },
  computed: {
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
        ? Array.from(this.$store.getters.getActualStates.catalogCars)
            .sort((a, b) =>
              a.number > b.number ? 1 : b.number > a.number ? -1 : 0
            )
            .filter((car) => car.crew.length)
        : null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
    this.date.year = new Date().getFullYear();
    this.date.month = new Date().getMonth();
    //driver cells width ↓
    const cells = this.$refs.driverName;
    const maxWidth = Math.max(...cells.map((c) => c.clientWidth));
    cells.forEach((cell) => (cell.style.width = `${maxWidth}px`));
    //set month instead of name in headerTemplate ↓
    this.headerTemplate[1] = new Date(this.date.year, this.date.month)
      .toLocaleString("default", {
        month: "long",
      })
      .toUpperCase();
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
table {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  // width: 800px;
  .car {
    height: 50px;
    font-size: 36px;
  }
  tbody tr td {
    width: 32px;
  }
}
</style>