<template>
  <div class="hiring-report-result" v-if="vacancies">
    <h1>Сводка по вакансиям</h1>
    <div class="options">
      <form class="filters__item calendar">
        <input type="date" name="start" id="start" v-model="dates.minDate" />
        <input type="date" name="end" id="end" v-model="dates.maxDate" />
        <button @click.prevent="defaultDates">Сбросить</button>
      </form>
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="Сводка по вакансиям.xlsx">
          <button>Скачать таблицу в XLSX</button>
        </xlsx-download>
      </xlsx-workbook>
      <div class="options__info">
        <p>Назначено собеседований: {{ resultSummary.appointedInterviews }}</p>
        <p>Проведено собеседований: {{ resultSummary.conductedInterviews }}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="(head, h) in header" :key="h">{{ head }}</th>
        </tr>
        <tr>
          <th v-for="(summary, s) in tableSummary" :key="s">{{ summary }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vacancy, v) in vacancies" :key="v">
          <td>{{ v + 1 }}</td>
          <td>{{ vacancy.title }}</td>
          <td>{{ leftToHire(vacancy.id) }}</td>
          <td>{{ vacancy.supervisor }}</td>
          <td>{{ vacancy.department }}</td>
          <td>{{ vacancy.status }}</td>
          <td v-for="(status, s) in statuses" :key="s">
            {{ detailedDatesAndStatusFilter(status.status, vacancy.id) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>Идёт загрузка</div>
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
      dates: {
        defaultMinDate: null,
        defaultMaxDate: null,
        minDate: new Date(),
        maxDate: new Date(1970),
      },
      xlsx: [{}],
      // exceptStatus: ["Пробный день", "Внесён в 1С", "Оформление"],
      interviewStatus: ["Собеседование", "2-й этап собеседования"],
    };
  },
  methods: {
    datetimeConverter(str) {
      const converter = require("../../store/dateHandler");
      return converter.dateTime(str);
    },
    defaultDates() {
      this.dates.minDate = this.dates.defaultMinDate;
      this.dates.maxDate = this.dates.defaultMaxDate;
    },
    setMinMaxDate(date) {
      const truedate = new Date(date).toISOString().substring(0, 10);
      const mindate = new Date(this.dates.minDate)
        .toISOString()
        .substring(0, 10);
      const maxdate = new Date(this.dates.maxDate)
        .toISOString()
        .substring(0, 10);
      mindate >= truedate ? (this.dates.minDate = truedate) : null;
      maxdate <= truedate ? (this.dates.maxDate = truedate) : null;
      this.dates.defaultMinDate = mindate;
      this.dates.defaultMaxDate = maxdate;
    },
    datesFilter() {
      if (this.candidates) {
        const start = new Date(new Date(this.dates.minDate).getTime())
          .toISOString()
          .substring(0, 10);
        const end = new Date(this.dates.maxDate).toISOString().substring(0, 10);
        return this.candidates.filter((candidate) => {
          const date_time = new Date(candidate.datetime)
            .toISOString()
            .substring(0, 10);
          return date_time >= start && date_time <= end;
        });
      }
      return null;
    },
    detailedDatesAndStatusFilter(status, vacancyID) {
      if (!this.candidates) return;
      const start = new Date(new Date(this.dates.minDate).getTime())
        .toISOString()
        .substring(0, 10);
      const end = new Date(this.dates.maxDate).toISOString().substring(0, 10);
      const result = this.candidates
        .filter((c) => c.vacancyID === vacancyID)
        .map((c) => c.statuslist)
        .flat()
        .filter((s) => s.status === status)
        .filter((s) => s.updateDate > 0)
        .map((s) => {
          try {
            return new Date(s.datetime).toISOString().substring(0, 10)
          } catch (error) {
            console.log(s)
          }
          
        })
        .filter((s) => s >= start && s <= end).length;

      return result;
    },
    leftToHire(vacancyID) {
      if (this.candidates) {
        const requiredQuantity = this.vacancies.filter(
          (v) => v.id === vacancyID
        )[0]?.quantity;
        const hiredQuantity = this.candidates.filter(
          (c) => c.vacancyID === vacancyID && c.status === "Оформление"
        ).length;
        return requiredQuantity - hiredQuantity >= 0
          ? requiredQuantity - hiredQuantity
          : 0;
      }
      return null;
    },
    getAmountOfInterviews(array) {
      const start = new Date(new Date(this.dates.minDate).getTime())
        .toISOString()
        .substring(0, 10);
      const end = new Date(this.dates.maxDate).toISOString().substring(0, 10);
      const appointedInterviews = array
        .filter(
          (o) => new Date(o.datetime).toISOString().substring(0, 10) >= start
        )
        .filter(
          (o) => new Date(o.datetime).toISOString().substring(0, 10) <= end
        );
      return appointedInterviews;
    },
  },
  computed: {
    test() {
      if (!this.candidates) return;
      return this.candidates.filter(candidate => candidate.statuslist.filter(status => typeof status.datetime === "string" && status.datetime.length === 0).length);
    },
    tableSummary() {
      const res = this.downloadXLSX[this.downloadXLSX.length - 1];
      delete res["Назначено собеседований"];
      delete res["Проведено собеседований"];
      return res;
    },
    downloadXLSX() {
      let vacanciesQuan = 0;
      const vacancies = this.vacancies.map((vacancy, v) => {
        vacanciesQuan += this.leftToHire(vacancy.id);
        const vacancyData = {
          "#": v + 1,
          Должность: vacancy.title,
          "Вакантно мест": this.leftToHire(vacancy.id),
          Руководитель: vacancy.supervisor,
          Отдел: vacancy.department,
          Статус: vacancy.status,
        };
        this.statuses.forEach((status) => {
          vacancyData[status.status] = this.detailedDatesAndStatusFilter(
            status.status,
            vacancy.id
          );
        });
        vacancyData["Назначено собеседований"] = this.datesFilter().filter(
          (f) => f.vacancyID === vacancy.id
        );
        vacancyData["Проведено собеседований"] = this.datesFilter().filter(
          (f) => f.vacancyID === vacancy.id
        );
        return vacancyData;
      });
      const lastRow = {
        "#": null,
        Должность: "Всего вакантных мест:",
        "Вакантно мест": vacanciesQuan,
        Руководитель: null,
        Отдел: null,
        Статус: "ВСЕГО:",
      };

      this.statuses.forEach((status) => {
        // lastRow[status.status] = this.datesFilter().filter(
        //   (f) => f.status === status.status
        // ).length;
        lastRow[status.status] = vacancies.reduce(
          (a, b) => a + b[status.status],
          0
        );
      });
      lastRow["Назначено собеседований"] =
        this.resultSummary.appointedInterviews;
      lastRow["Проведено собеседований"] =
        this.resultSummary.conductedInterviews;
      vacancies.push(lastRow);
      return vacancies;
    },
    sheets() {
      return {
        sheets: {
          name: "Сводка по подбору персонала",
          data: this.downloadXLSX,
        },
      };
    },
    candidates() {
      return this.$store.getters.getActualStates.candidates;
    },
    vacancies() {
      return this.$store.getters.getActualStates.vacancies;
    },
    header() {
      return [
        "#",
        "Должность",
        "Вакантно мест",
        "Руководитель",
        "Отдел",
        "Статус",
      ].concat(this.statuses.map((s) => s.status));
    },
    statuses() {
      return this.$store.getters.getCandidateStatusList;
    },
    resultSummary() {
      const start = new Date(new Date(this.dates.minDate).getTime())
        .toISOString()
        .substring(0, 10);
      const end = new Date(new Date(this.dates.maxDate).getTime())
        .toISOString()
        .substring(0, 10);

      const appointedInterviews = Array.from(this.candidates).filter(
        (candidate) =>
          candidate.statuslist.some(
            (status) =>
              this.interviewStatus.includes(status.status) &&
              new Date(status.datetime).toISOString().substring(0, 10) >=
                start &&
              new Date(status.datetime).toISOString().substring(0, 10) <= end
          )
      ).length;

      const conductedInterviews = Array.from(this.candidates).filter(
        (candidate) =>
          candidate.statuslist.some(
            (status) =>
              this.interviewStatus.includes(status.status) &&
              new Date(status.datetime).toISOString().substring(0, 10) >=
                start &&
              new Date(status.datetime).toISOString().substring(0, 10) <= end
          ) &&
          !candidate.statuslist.some(
            (status) =>
              status.status.includes("до собеседования") &&
              status.updateDate > 0
          )
      ).length;

      return {
        appointedInterviews,
        conductedInterviews,
      };
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCandidates");
    await this.$store.dispatch("setActualVacancies");
    const candidates = this.$store.getters.getActualStates.candidates;
    if (candidates) {
      candidates.forEach((candidate) => {
        this.setMinMaxDate(candidate.datetime);
      });
    }
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