<template>
  <div class="print-shedule">
    <!-- <table>
      <tbody v-for="(car, c) in cars" :key="`car-${c}`">
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
          <tr v-for="driver, d in crew(car)" :key="`${car.id}-${d}`">
            <td>
              {{d + 1}}
            </td>
            <td ref="driverName">{{driver.name}}</td>
            <td>{{driver.position}}</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`date-${d}`"
              :style="weekendColor(day)"
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
        </tbody>
      </tbody>
    </table> -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="false"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="Расписание"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
           <table>
      <tbody v-for="(car, c) in cars" :key="`car-${c}`">
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
          <tr v-for="driver, d in crew(car)" :key="`${car.id}-${d}`">
            <td>
              {{d + 1}}
            </td>
            <td ref="driverName">{{driver.name}}</td>
            <td>{{driver.position}}</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`date-${d}`"
              :style="weekendColor(day)"
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
        </tbody>
      </tbody>
    </table>
      </section>
    </vue-html2pdf>
    <button @click.prevent="print">Печать</button>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  components: {
    VueHtml2pdf,
  },
  data() {
    return {
      headerTemplate: ["#", "ФИО", "Должность"],
      date: {
        month: null,
        year: null,
      },
      driverCellWidth: null,
    };
  },
  methods: {
    print() {
      this.$refs.html2Pdf.generatePdf()
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

.car {
  height: 50px;
  font-size: 36px;
}
</style>