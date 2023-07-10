<template>
  <div class="drivers">
    <h1>Водители</h1>
    <div class="add-block">
      <AddDriversTimeSheet1C7 v-if="!info1C7" />
      <AddDriversShedule1C8A21 v-if="info1C7 && !shedule1C8_A21" />
      <!-- <AddDriversShedule1C8AP v-if="info1C7 && !shedule1C8_AP" /> -->
      <AddDriversShedule1C8DP v-if="info1C7 && !shedule1C8_DP" />
    </div>

    <div class="menu">
      <div
        class="conventions"
        v-if="showConventions"
      >
        <div
          class="conventions__item"
          v-for="(item, i) in conventions"
          :key="`convention-${i}`"
        >
          <div
            class="color-plate"
            :style="item.color"
          ></div>
          <p>{{ item.description }}</p>
        </div>
      </div>
      <div
        class="btn-block"
        v-if="date.month && date.year"
      >
        <div class="nav-block">
          <button @click.prevent="prevMonth">{{ prevMonthTitle }}</button>
          <!-- <button @click.prevent="save">Сохранить</button> -->
          <button @click.prevent="nextMonth">{{ nextMonthTitle }}</button>
        </div>
        <!-- <router-link
          class="to-filter"
          to="/personal-drivers-filter"
        >Фильтр должностей и сотрудников</router-link> -->
      </div>
    </div>

    <div
      class="positions-diffs"
      v-if="positionsDiffs"
    >

      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должности в 1С7</th>
            <th>Должности в справочнике ОС</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="diff, i in positionsDiffs"
            :key="i"
          >
            <td>{{diff.name}}</td>
            <td>{{diff.position1C7}}</td>
            <td>{{diff.positionOS}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="extra-drivers-from-1c"
      v-if="extras != null && extras != `allgood`"
    >
      <h3>Отсутсвуют в справочнике отдела сервиса:</h3>
      <div class="lists">
        <div
          class="lists__item from1c7"
          v-if="extras.from1C7 && extras.from1C7.length"
        >
          <h4>Сотрудники из 1С7</h4>
          <ol class="lists__item-list">
            <li
              v-for="driver, d in extras.from1C7"
              :key="`d1c7-${d}`"
            >{{capitalizeName(driver.name)}}</li>
          </ol>
        </div>
        <div
          class="lists__item from1c8a21"
          v-if="extras.from1C8_A21 && extras.from1C8_A21.length"
        >
          <h4>Сотрудники из 1С8 A21</h4>
          <ol class="lists__item-list">
            <li
              v-for="driver, d in extras.from1C8_A21"
              :key="`d1c8-a21-${d}`"
            >{{capitalizeName(driver.name)}}</li>
          </ol>
        </div>
        <div
          class="lists__item from1c8ap"
          v-if="extras.from1C8_AP && extras.from1C8_AP.length"
        >
          <h4>Сотрудники из 1С8 AП</h4>
          <ol class="lists__item-list">
            <li
              v-for="driver, d in extras.from1C8_AP"
              :key="`d1c8-ap-${d}`"
            >{{capitalizeName(driver.name)}}</li>
          </ol>
        </div>
        <div
          class="lists__item from1c8dp"
          v-if="extras.from1C8_DP && extras.from1C8_DP.length"
        >
          <h4>Сотрудники из 1С8 ДП</h4>
          <ol>
            <li
              v-for="driver, d in extras.from1C8_DP"
              :key="`d1c8-dp-${d}`"
            >{{capitalizeName(driver.name)}}</li>
          </ol>
        </div>
      </div>
    </div>
    <div
      class="no-extra-drivers-from-1c"
      style="background: rgb(40, 199, 101)"
      v-if="extras === `allgood`"
    >
      Все водители из 1С присутствуют в справочнике отдела сервиса.
    </div>

    <div
      class="car"
      v-for="(car, c) in cars"
      :key="c"
    >
      <!-- <div class="car-crew-info" v-if="car.crew.length">some summary</div> -->

      <table v-if="car.crew.length">
        <thead>
          <tr>
            <th :colspan="
                numberOfDays(date.year, date.month) + headerTemplate.length
              ">
              {{ car.mark.toUpperCase() }} {{ car.number }}
            </th>
          </tr>
          <tr>
            <th
              :colspan="
                numberOfDays(date.year, date.month) + headerTemplate.length
              "
              class="month"
            >
              {{
                new Date(date.year, date.month)
                  .toLocaleString("default", { month: "long",
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
        <tbody
          v-for="(driver, d) in car.crewDetails"
          :key="`driver-info-${d}`"
        >
          <tr>
            <td :rowspan="driver.rowspan">{{ d + 1 }}</td>
            <td
              :rowspan="driver.rowspan"
              ref="name"
              :style="driver.backGround"
            >{{ driver.name }}</td>
            <td>Отдел сервиса</td>
            <td
              v-for="(day, d) in daySpec(date.month, date.year)"
              :key="`curr-date-${d}`"
              :style="
                driver.extras.filter((e) => e.day == new Date(date.year, date.month, day.dayOfMonth).toISOString()).length
                  ? driver.extras.filter(
                      (e) =>
                        e.day ==
                        new Date(
                          date.year,
                          date.month,
                          day.dayOfMonth
                        ).toISOString()
                    )[0].cut.length
                    ? `background: ${
                        driver.extras.filter(
                          (e) =>
                            (e.day ==
                            new Date(
                              date.year,
                              date.month,
                              day.dayOfMonth
                            ).toISOString())
                        )[0].bgColor
                      }`
                    : setStyle(
                        new Date(date.year, date.month, day.dayOfMonth),
                        driver,
                        day
                      )
                  : setStyle(
                      new Date(date.year, date.month, day.dayOfMonth),
                      driver,
                      day
                    )
              "
            >
              {{
                driver.extras.filter(
                  (e) =>
                    e.day ==
                    new Date(
                      date.year,
                      date.month,
                      day.dayOfMonth
                    ).toISOString()
                ).length
                  ? driver.extras.filter(
                      (e) =>
                        e.day ==
                        new Date(
                          date.year,
                          date.month,
                          day.dayOfMonth
                        ).toISOString()
                    )[0].cut
                  : count(
                      driver.sheduleStart,
                      driver.sheduleType,
                      driver.sheduleShift,
                      new Date(date.year, date.month, day.dayOfMonth)
                    )
              }}
            </td>
          </tr>
          <tr v-if="driver.shedule1C8">
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
              Object.keys(driver.shedule1C8.shedule).includes(new Date(date.year, date.month, day.dayOfMonth).toLocaleDateString("ru-Ru")) 
                ? driver.shedule1C8.shedule[new Date(date.year, date.month, day.dayOfMonth).toLocaleDateString("ru-Ru")].mark
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
import AddDriversTimeSheet1C7 from "@/components/PersonalComponents/AddDriversTimeSheet1C7";

import AddDriversShedule1C8A21 from "@/components/PersonalComponents/AddDriversShedule1C8_A21";
// import AddDriversShedule1C8AP from "@/components/PersonalComponents/AddDriversShedule1C8_AP";
import AddDriversShedule1C8DP from "@/components/PersonalComponents/AddDriversShedule1C8_DP";
export default {
  components: {
    AddDriversTimeSheet1C7,
    AddDriversShedule1C8A21,
    // AddDriversShedule1C8AP,
    AddDriversShedule1C8DP,
  },
  data() {
    return {
      headerTemplate: ["#", "ФИО", "Источники данных"],
      date: {
        month: null,
        year: null,
      },
      conventions: [
        {
          description: "Вышел на работу в свой выходной",
          color:
            "background: rgba(225, 50, 50, 0.9); color: red; font-weight: bold",
        },
        {
          description: "Не вышел на работу",
          color: "background: rgba(251, 255, 0, 0.452)",
        },
        {
          description: "Работал в отпуске",
          color: "background: rgb(0, 128, 0)",
        },
        {
          description: "Несоответсвие ОС и 1С8",
          color: "background: rgba(153, 0, 255, 0.288)",
        },
      ],
      showConventions: false,
    };
  },
  methods: {
    capitalizeName(str) {
      const cap = require("../../store/stringsHandler").capitalizeName;
      return cap(str);
    },
    cutName(str) {
      const cut = require("../../store/stringsHandler").nameCutter;
      return cut(str);
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
    save() {
      alert("Дописать функционал сохранения"); // какого сохранения... в xls?
    },
    setStyle(date, driver) {
      if (!driver.info1C7 || !driver.shedule1C8) return;

      const redBgBlackColor =
        "background: rgba(225, 50, 50, 0.9); color: black; font-weight: bold";
      const greenBG = "background: rgb(0, 128, 0)";
      const orangeBG = "background: rgba(251, 255, 0, 0.452)";
      const undefinedDataCombination = "background: rgba(153, 0, 255, 0.288)";

      const service = Boolean(
        this.count(
          driver.sheduleStart,
          driver.sheduleType,
          driver.sheduleShift,
          date
        )
      );

      const extra = this.getDateExtra(driver.extras, date);

      const info1C7 = driver.info1C7
        ? this.compareDates(driver.info1C7, date)
        : null;

      const info1C8 =
        driver.shedule1C8 &&
        Object.keys(driver.shedule1C8.shedule).includes(
          date.toLocaleDateString("ru-RU")
        )
          ? driver.shedule1C8.shedule[date.toLocaleDateString("ru-Ru")].mark
          : false;

      const stateStore = {};
      stateStore.date = date.toLocaleDateString();
      stateStore.name = driver.name;

      stateStore.noData = !service && !info1C7 && !info1C8 && !extra;

      stateStore.dayOff = !service && !extra && !info1C7 && info1C8 === "В";

      stateStore.workingGood = extra
        ? extra.cut === "Р" && info1C7 && info1C8 === "Я"
        : service && info1C7 && info1C8 === "Я";

      stateStore.vacation = extra
        ? !info1C7 &&
          (info1C8 === "ОТ" || info1C8 === "ДО") &&
          extra.cut === "О"
        : !info1C7 && (info1C8 === "ОТ" || info1C8 === "ДО");

      stateStore.illness = extra
        ? !info1C7 && info1C8 === "Б" && extra.cut === "Б"
        : !info1C7 && info1C8 === "Б";

      stateStore.absence = extra
        ? extra.cut === "Н" && !info1C7 && info1C8 === "НН"
        // : !info1C7 && info1C8 === "НН" && service;
        : false;

      //red BG and red Text
      stateStore.workInDayOff = extra
        ? extra.cut != "Р" && info1C7 && info1C8 === "В"
        : !service && info1C7 && info1C8 === "В";

      //orange BG
      stateStore.sheduleButNoFact = service && info1C8 === "Я" && !info1C7;
      // const mistake1C8 = service && info1C7 && info1C8 !== "Я";

      //green BG
      stateStore.vacationWork =
        (service || !service) && info1C7 && info1C8 === "ОТ";
      this.showConventions = true;

      //violet BG
      stateStore.missMatchVacation = extra
        ? extra.cut === "О" && info1C8 != "ОТ" && info1C8 != "ДО"
        : service && (info1C8 === "ОТ" || info1C8 === "ДО");

      const checkForUniqueTruth = Object.entries(stateStore).filter(
        (a) => Boolean(a[1]) == true
      );
      // if (checkForUniqueTruth.length > 3) {
      //   console.table(stateStore)
      // }
      const status =
        checkForUniqueTruth.length > 2 ? checkForUniqueTruth[2][0] : null;


      // if (
      //   date.toLocaleDateString() === "04.06.2023" &&
      //   driver.name === "Артемов Андрей Владимирович"
      // ) {
      //   console.table(driver);
      // }

      if (driver.mark === "наем") {
         const sheduleWorkDays = Object.entries(driver.shedule1C8.shedule).filter(s => s[1].mark == "Я").length;
           driver.info1C7.length < sheduleWorkDays
          ? driver.backGround =  "background: rgba(225, 50, 50, 0.9); color: black; font-weight: bold" : null
        return;
      }

      switch (status) {
        case "noData":
        case "workingGood":
        case "dayOff":
        case "vacation":
        case "illness":
        case "absence":
          return;
        case "workInDayOff":
          return redBgBlackColor;
        case "sheduleButNoFact":
          return orangeBG;
        case "vacationWork":
          return greenBG;
        case "missMatchVacation":
          return undefinedDataCombination;
        default:
          return undefinedDataCombination;
      }
      //
      // return factButNoShedule
      //   ? redBgBlackColor
      //   : sheduleButNoFact
      //   ? orangeBG
      //   : vacationWork
      //   ? greenBG
      //   : undefinedDataCombination;
    },
    getDateExtra(extras, date) {
      const isosDate = date.toISOString();
      return extras.filter((e) => e.day === isosDate).length
        ? extras.filter((e) => e.day === isosDate)[0]
        : null;
    },
    daySpec(month, year) {
      const lastDay = this.numberOfDays(month, year);
      const result = [];
      for (let day = 1; day <= lastDay; day += 1) {
        result.push({
          weekday: new Date(year, month, day).toLocaleString("default", {
            weekday: "short",
          }),
          // dayOfMonth: new Date(year, month, day).getDate(),
          dayOfMonth: day,
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
    extraCrew(car) {
      if (!car.extraCrew || (car.extraCrew && !car.extraCrew.length)) return [];
      const extraCrew = car.extraCrew.map((id) => {
        const driver = this.drivers.filter((d) => d.driverID === id)[0];
        // console.log(driver)
        const result = driver.extras?.filter((e) => e.carID === car.carID);
        // console.log(result)
        return result || [];
      });
      return extraCrew;
    },
    crew(car) {
      const driverlist = car.crew;
      const crew = [];
      Array.from(driverlist).forEach((id) => {
        const driver = this.drivers.filter((d) => d.driverID === id)[0];
        if (!driver) return;
        const result = driver.carslist
          .filter((cl) => cl.carID === car.carID)
          .map((cl) => {
            cl.extras = cl.extras.filter((e) => e.cut != "ХР");
            cl.tin = driver.tin;
            cl.mark = car.mark
            return cl;
          })[0];
        result.rowspan = 1;
        //get data from 1C7
        if (this.info1C7) {
          result.rowspan += 1;
          result.info1C7 = Array.from(this.info1C7).filter(
            (i) => i.tin === result.tin
          ).length
            ? Array.from(this.info1C7)
                .filter((i) => i.tin === result.tin)[0]
                .dates.map((date) => {
                  const d = date.split(".");
                  return new Date(Date.parse(`20${d[2]}-${d[1]}-${d[0]}`));
                })
            : null;
        }
        //get data from 1C8
        if (this.shedule1C8 && this.shedule1C8.length) {
          result.rowspan += 1;
          result.shedule1C8 = Array.from(this.shedule1C8).filter(
            (i) => i.tin === result.tin
          ).length
            ? Array.from(this.shedule1C8).filter((i) => i.tin === result.tin)[0]
            : null;
          // console.log(result.name, result.shedule1C8)
        }
        crew.push(result);
      });
      return crew.flat();
    },
  },
  computed: {
    positionsDiffs() {
      return this.$store.getters.getPositionsDiffs;
    },
    //
    extras() {
      if (
        !this.extraDriversFrom1C.from1C7 &&
        !this.extraDriversFrom1C.from1C8_A21 &&
        !this.extraDriversFrom1C.from1C8_AP &&
        !this.extraDriversFrom1C.from1C8_DP
      )
        return null;
      let allExtras = [];
      for (let e in this.extraDriversFrom1C) {
        if (this.extraDriversFrom1C[e] && this.extraDriversFrom1C[e].length) {
          allExtras = allExtras.concat(this.extraDriversFrom1C[e]);
        }
      }
      if (!allExtras.length) return "allgood";
      return this.extraDriversFrom1C;
    },
    extraDriversFrom1C() {
      return this.$store.getters.getExtraDriversFrom1C;
    },
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
    cars() {
      return this.$store.getters.getActualStates.catalogCars
        ? Array.from(this.$store.getters.getActualStates.catalogCars)
            ?.sort((a, b) => a.number - b.number)
            .map((car) =>
              Object.assign(car, {
                crewDetails: this.crew(car),
                extraCrewDetails: this.extraCrew(car),
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
    //test drivers shedule from 1C8
    shedule1C8() {
      return []
        .concat(this.shedule1C8_A21, this.shedule1C8_AP, this.shedule1C8_DP)
        .filter((d) => d !== null);
    },
    shedule1C8_A21() {
      return this.$store.getters.getShedule1C8_A21;
    },
    shedule1C8_AP() {
      return this.$store.getters.getShedule1C8_AP;
    },
    shedule1C8_DP() {
      return this.$store.getters.getShedule1C8_DP;
    },
    pickedMonth() {
      return this.$store.getters.getPickedMonth;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogDrivers");
    await this.$store.dispatch("setActualCatalogCars");
    this.date.year = new Date().getFullYear();
    this.date.month = new Date().getMonth();
    const cells = this.$refs.name;
    const maxWidth = Math.max(...cells.map((c) => c.clientWidth));
    cells.forEach((cell) => (cell.style.width = `${maxWidth}px`));
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
tbody {
  box-shadow: 0 0 0 2px black;
}
.month {
  button {
    background: green;
  }
}
tbody:nth-child(2n + 1) > tr > td {
  background: rgba(204, 204, 204, 0.5);
}
.car:not(:last-child) {
  margin-bottom: 15px;
}
.add-block {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
.test {
  color: rgba(153, 0, 255, 0.288);
}
//conventions legend
.menu {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fbf9fc;
  // border-bottom: 1px solid black;
  padding: 10px;
  .conventions {
    display: flex;
    justify-content: space-evenly;
    .conventions__item {
      display: flex;
      align-items: center;
      gap: 10px;
      .color-plate {
        width: 25px;
        height: 25px;
        border: 1px solid black;
      }
    }
  }
  .btn-block {
    display: flex;
    justify-content: space-evenly;
  }
}
.extra-drivers-from-1c {
  background: salmon;
  padding: 15px 0 15px 0;
  .lists {
    display: flex;
    justify-content: space-evenly;
    &__item {
      text-align: left;
    }
    ol {
      padding: 0;
    }
  }
}
</style>