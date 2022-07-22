<template>
  <div class="weekly-reqruitment-report">
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download :filename="`${filename}.xlsx`">
        <button class="hidden-button" ref="hiddenButton">
          Скачать таблицу в XLSX
        </button>
      </xlsx-download>
    </xlsx-workbook>

    <table v-if="weeks">
      <thead>
        <tr>
          <th v-for="(head, h) in header" :key="h">{{ head }}</th>
        </tr>
        <tr>
          <th></th>
          <th>ИТОГО</th>
          <th v-for="(status, s) in statuses" :key="s">
            {{ statusByDate.filter((s) => s.status === status.status).length }}
          </th>
        </tr>
      </thead>
      <!-- cursorOn and cursorOff on tag tbody ↓ -->
      <tbody> 
        <tr v-for="(week, w) in weeks" :key="w">
          <th>
            {{ w + 1 }}
          </th>
          <th
            @click="downloadWeekList(week.items)"
            :style="{ cursor: `pointer` }"
          >
            {{ week.tableMonday }} - {{ week.tableSunday }}
          </th>
          <th
            v-for="(status, s) in statuses"
            :key="s"
            :style="{
              color:
                week.items.filter((w) => w.status === status.status).length > 0
                  ? `black`
                  : `gray`,
            }"
          >
            {{
              week.items.filter((w) => w.status === status.status).length || ""
            }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
  },
  data() {
    return {
      filename: "",
      sheets: [],
      // gsIndexes: {
      //   date: null,
      //   candidate: null,
      //   vacancy: null,
      //   status: null,
      // },
      // gsRows: null,
      // gsWeeks: [],
      // gsWeeksInfo: [],
      // macrosUrl:
      //   "https://script.google.com/macros/s/AKfycbyKyJV7MAVolVr2nW1bQPqY44H66d3c9wtcp2q3mX2O4J_CeF5kLb7sn2YZ-D2_7RtH/exec",
    };
  },
  methods: {
    async downloadWeekList(list) {
      const button = this.$refs.hiddenButton;
      console.log(button);
      this.filename = event.target.innerText;
      this.sheets = [];
      this.sheets.push({ name: this.filename, data: list });
      button.click();
    },
    // cursorOn() {
    //   const cell = event.target;
    //   const row = cell.parentElement;
    //   const rowCells = row.children;
    //   const tbody = row.parentElement;
    //   const tbodyRows = tbody.children;
    //   const colIndex = Array.from(rowCells).indexOf(cell);
    //   const thead = tbody.parentElement.firstChild;
    //   const theadCells = Array.from(thead.children).map(
    //     (tr) => tr.children[colIndex]
    //   );
    //   const col = Array.from(tbodyRows).map((r) => r.children[colIndex]);
    //   theadCells
    //     .concat(Array.from(rowCells), Array.from(col))
    //     .forEach((r) => r.classList.add("cursor"));
    // },
    // cursorOff() {
    //   console.log(event.target)
    //   Array.from(event.target.children).forEach(elem => Array.from(elem.children).forEach(e => e.classList.remove("cursor")))
    //   Array.from(event.target.parentElement.firstChild.children).forEach(row => Array.from(row.children).forEach(th => th.classList.remove("cursor")))
    // },
    compareWeekInfo(weekInfo) {
      let gsWeekInfo = this.gsWeeksInfo.filter(
        (w) => w.monday === weekInfo.monday
      )[0];
      if (!gsWeekInfo)
        gsWeekInfo = {
          monday: weekInfo.monday,
          sunday: weekInfo.sunday,
          items: [],
        };
      // console.log(weekInfo, gsWeekInfo);
      let mistakes = 0;
      if (weekInfo.items.length !== gsWeekInfo.items.length)
        return (mistakes += Math.abs(
          weekInfo.items.length - gsWeekInfo.items.length
        ));
      weekInfo.items.forEach((weekInfo_item, i) => {
        // console.log(weekInfo_item, i);
        const gsWeekInfo_item = gsWeekInfo.items[i];
        for (let key in weekInfo_item) {
          if (weekInfo_item[key] !== gsWeekInfo_item[key]) {
            mistakes += 1;
          }
        }
      });
      return mistakes;
    },
  },
  computed: {
    // sheets() {
    //   return {
    //     sheets: {
    //       name: this.filename,
    //       data: this.listToDownload,
    //     },
    //   };
    // },
    candidates() {
      return this.$store.getters.getActualStates.candidates;
    },
    statusByDate() {
      return this.candidates
        ? this.candidates
            .map((candidate) =>
              candidate.statuslist
                .filter((status) => status.datetime)
                .map((status) => ({
                  status: status.status,
                  name: candidate.name,
                  date: status.datetime.split("T")[0],
                  weekday:
                    new Date(status.datetime.split("T")[0]).getDay() === 0
                      ? 7
                      : new Date(status.datetime.split("T")[0]).getDay(),
                }))
            )
            .flat()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        : null;
    },
    weeks() {
      if (!this.statusByDate) return null;
      const dateHandler = require("../../store/dateHandler");

      const arr = Array.from(this.statusByDate);
      const weeks = [];
      const mondays = [];
      arr.forEach((elem) => {
        const date = new Date(elem.date);
        const first = date.getDate() - date.getDay() + 1;
        const monday = new Date(date.setDate(first));
        if (!mondays.includes(monday.toString())) {
          mondays.push(monday.toString());
          const sunday = new Date(date.setDate(first + 6));
          const items = this.statusByDate
            .filter(
              (s) =>
                new Date(s.date) >= new Date(monday) &&
                new Date(s.date) <= new Date(sunday)
            )
            .map((i) => ({ date: i.date, status: i.status, name: i.name }));
          const tableMonday = dateHandler.getFullDate(monday);
          const tableSunday = dateHandler.getFullDate(sunday);
          weeks.push({ monday, tableMonday, sunday, tableSunday, items });
        }
      });

      return weeks.reverse();
    },
    header() {
      return ["#", "Неделя"].concat(this.statuses.map((s) => s.status));
    },
    statuses() {
      return this.$store.getters.getCandidateStatusList;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCandidates");
    //  fetch(this.macrosUrl)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     // console.log(data);
    //     const statuses = this.statuses.map((s) => s.status);
    //     this.gsIndexes.date = data[0].indexOf("Дата");
    //     this.gsIndexes.candidate = data[0].indexOf("ФИО");
    //     this.gsIndexes.status = data[0].indexOf("Статус");
    //     this.gsIndexes.vacancy = data[0].indexOf("Вакансия");
    //     this.gsRows = data
    //       .filter((row) => statuses.includes(row[this.gsIndexes.status]))
    //       .map((row) => ({
    //         date: row[this.gsIndexes.date].split("T")[0],
    //         name: row[this.gsIndexes.candidate],
    //         status: row[this.gsIndexes.status],
    //         weekday:
    //           new Date(row[this.gsIndexes.date].split("T")[0]).getDay() === 0
    //             ? 7
    //             : new Date(row[this.gsIndexes.date].split("T")[0]).getDay(),
    //       }))
    //       .filter((row) => row.date >= this.startDate);
    //     let start = 0;
    //     this.gsRows.forEach((elem, i) => {
    //       if (
    //         this.gsRows[i + 1] &&
    //         this.gsRows[i + 1].weekday < this.gsRows[i].weekday
    //       ) {
    //         this.gsWeeks.push(this.gsRows.slice(start, i + 1));
    //         start = i + 1;
    //       }
    //     });
    //     this.gsWeeks.reverse();
    //     this.gsWeeks.forEach((week) =>
    //       this.gsWeeksInfo.push(this.weekInfo(week))
    //     );
    //   });
    //   this.componentKey += 1;
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
table {
  font-size: 14px;
}
.hidden-button {
  position: absolute;
  top: -100px;
}
.cursor {
  background: rgba(28, 103, 201, 0.39);
}
</style>
