<template>
  <div class="weekly-reqruitment-report">
    <!-- {{
      statusByDate.filter((s) => s.status === "Самоотказ после собеседования")
    }}
    {{
      statusByDate.filter((s) => s.status === "Самоотказ после собеседования")
        .length
    }} -->
    <table v-if="gsWeeksInfo.length">
      <thead>
        <tr>
          <th v-for="(head, h) in header" :key="h">{{ head }}</th>
        </tr>
        <tr>
          <th colspan="2">ИТОГО</th>
          <th v-for="(status, s) in statuses" :key="s">
            {{ statusByDate.filter((s) => s.status === status.status).length }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, w) in weeks" :key="w">
          <th>
            {{ compareWeekInfo(weekInfo(week)) }}
          </th>
          <th>{{ weekInfo(week).monday }} - {{ weekInfo(week).sunday }}</th>
          <th v-for="(status, s) in statuses" :key="s">
            {{
              weekInfo(week).items.filter((w) => w.status === status.status)
                .length
            }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gsIndexes: {
        date: null,
        candidate: null,
        vacancy: null,
        status: null,
      },
      gsRows: null,
      gsWeeks: [],
      gsWeeksInfo: [],
      macrosUrl:
        "https://script.google.com/macros/s/AKfycbyKyJV7MAVolVr2nW1bQPqY44H66d3c9wtcp2q3mX2O4J_CeF5kLb7sn2YZ-D2_7RtH/exec",
    };
  },
  methods: {
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
          // console.log(
          //   weekInfo_item[key],
          //   gsWeekInfo_item[key],
          //   weekInfo_item[key] !== gsWeekInfo_item[key]
          // );
          if (weekInfo_item[key] !== gsWeekInfo_item[key]) {
            mistakes += 1;
          }
        }
      });
      return mistakes;
    },

    weekInfo(week) {
      // console.log(week);
      const dateHandler = require("../../store/dateHandler");
      const date = new Date(week[0].date);
      const first = date.getDate() - date.getDay() + 1;
      const monday = new Date(date.setDate(first));
      const sunday = new Date(date.setDate(first + 6));
      const items = this.statusByDate.filter(
        (s) =>
          new Date(s.date) >= new Date(monday) &&
          new Date(s.date) <= new Date(sunday)
      );
      // console.log({
      //   monday: dateHandler.getFullDate(monday),
      //   sunday: dateHandler.getFullDate(sunday),
      //   items,
      // });
      return {
        monday: dateHandler.getFullDate(monday),
        sunday: dateHandler.getFullDate(sunday),
        items,
      };
    },
  },
  computed: {
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
                  // weekday: new Date(
                  //   status.datetime.split("T")[0]
                  // ).toLocaleString("default", { weekday: "short" }),
                }))
            )
            .flat()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        : null;
    },
    startDate() {
      if (!this.statusByDate) return null;
      return this.statusByDate[0].date;
    },
    weeks() {
      if (!this.statusByDate) return null;
      const arr = Array.from(this.statusByDate);
      const weeks = [];
      let start = 0;
      arr.forEach((elem, i) => {
        if (arr[i + 1]) {
          const day1 = new Date(elem.date).getDate();
          const day2 = new Date(arr[i + 1].date).getDate();
          console.log(Math.abs(day2 - day1));
          if (arr[i + 1].weekday < arr[i].weekday) {
            weeks.push(arr.slice(start, i + 1));
            start = i + 1;
          }
        }
      });
      return weeks.reverse();
    },
    header() {
      return ["!", "Неделя"].concat(this.statuses.map((s) => s.status));
    },
    statuses() {
      return this.$store.getters.getCandidateStatusList;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCandidates");
    await fetch(this.macrosUrl)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const statuses = this.statuses.map((s) => s.status);
        this.gsIndexes.date = data[0].indexOf("Дата");
        this.gsIndexes.candidate = data[0].indexOf("ФИО");
        this.gsIndexes.status = data[0].indexOf("Статус");
        this.gsIndexes.vacancy = data[0].indexOf("Вакансия");
        this.gsRows = data
          .filter((row) => statuses.includes(row[this.gsIndexes.status]))
          .map((row) => ({
            date: row[this.gsIndexes.date].split("T")[0],
            name: row[this.gsIndexes.candidate],
            status: row[this.gsIndexes.status],
            weekday:
              new Date(row[this.gsIndexes.date].split("T")[0]).getDay() === 0
                ? 7
                : new Date(row[this.gsIndexes.date].split("T")[0]).getDay(),
          }))
          .filter((row) => row.date >= this.startDate);
        let start = 0;
        this.gsRows.forEach((elem, i) => {
          if (
            this.gsRows[i + 1] &&
            this.gsRows[i + 1].weekday < this.gsRows[i].weekday
          ) {
            this.gsWeeks.push(this.gsRows.slice(start, i + 1));
            start = i + 1;
          }
        });
        this.gsWeeks.reverse();
        this.gsWeeks.forEach((week) =>
          this.gsWeeksInfo.push(this.weekInfo(week))
        );
      });
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
table {
  font-size: 14px;
}
</style>
