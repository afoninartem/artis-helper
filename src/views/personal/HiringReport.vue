<template>
  <div>
    <h1>Сводка по текущим вакансиям</h1>
    <div class="filters">
      <form class="filters__item calendar">
        <input type="date" name="start" id="start" v-model="dates.minDate" />
        <input type="date" name="end" id="end" v-model="dates.maxDate" />
        <button @click.prevent="defaultDates">Сбросить</button>
      </form>
      <div class="filters__item columns">
        <button @click.prevent="toggleManagerShow">Руководитель</button>
        <button @click.prevent="toggleDepartmentShow">Отдел</button>
        <xlsx-workbook>
          <xlsx-sheet
            :collection="sheet.data"
            v-for="sheet in sheets"
            :key="sheet.name"
            :sheet-name="sheet.name"
          />
          <xlsx-download filename="Сводка по вакансиям.xlsx">
            <button>Скачать</button>
          </xlsx-download>
        </xlsx-workbook>
      </div>
      <div class="filters__item url">
        <a :href="this.url" target="_blank">Таблица Google Disc</a>
      </div>
    </div>
    <div class="main">
      <table>
        <thead>
          <tr>
            <th v-if="managerShow">Руководитель</th>
            <th v-if="departmentShow">Отдел</th>
            <th>Должность</th>
            <th v-for="(status, i) in this.statuses" :key="`status-${i}`">
              {{ status }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in this.xlsxDataFilteredByDate" :key="`row-${i}`">
            <td v-if="managerShow">{{ row.Руководитель }}</td>
            <td v-if="departmentShow">{{ row.Отдел }}</td>
            <td>{{ row.Вакансия }}</td>
            <td>{{ row.Собеседование }}</td>
            <td>{{ row.Оформление }}</td>
            <td>{{ row.Внесён_в_1С }}</td>
            <td>{{ row.Пробный_день }}</td>
            <td>{{ row.Отказ }}</td>
            <td>{{ row.Самоотказ }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      managerShow: true,
      departmentShow: true,
      url: "https://docs.google.com/spreadsheets/d/1FM735zq3jVzG38mlP83Srqtwuf4aR3YgdHf7Qjjc9XA/edit#gid=0",
      macrosUrl:
        "https://script.google.com/macros/s/AKfycbyKyJV7MAVolVr2nW1bQPqY44H66d3c9wtcp2q3mX2O4J_CeF5kLb7sn2YZ-D2_7RtH/exec",
      statuses: [
        "Собеседование",
        "Оформление",
        "Внесён в 1С",
        "Пробный день",
        "Отказ",
        "Самоотказ",
      ],
      correctData: null,
      incorrectData: null,
      handledCorrectData: null,
      xlsxData: [{}],
      dates: {
        defaultMinDate: null,
        defaultMaxDate: null,
        minDate: new Date(),
        maxDate: new Date(),
      },
    };
  },
  methods: {
    defaultDates() {
      this.dates.minDate = this.dates.defaultMinDate;
      this.dates.maxDate = this.dates.defaultMaxDate;
    },
    toggleManagerShow() {
      this.managerShow = !this.managerShow;
    },
    toggleDepartmentShow() {
      this.departmentShow = !this.departmentShow;
    },
    filterDates(start, end) {
      start = new Date(new Date(start).getTime() - 24 * 60 * 60 * 1000); //correctly set first date
      const filteredArray = [];
      if (start != "Invalid Date" && end != "Invalid Date") {
        if (this.handledCorrectData) {
          this.handledCorrectData.forEach((manager) => {
            manager.departments.forEach((department) => {
              department.vacancies.forEach((job) => {
                let interview = 0;
                let registration = 0;
                let base1C = 0;
                let trial = 0;
                let reject = 0;
                let selfReject = 0;
                job.statuses.forEach((item) => {
                  if (item.date >= start && item.date <= end) {
                    switch (item.status) {
                      case "Собеседование":
                        interview += 1;
                        break;
                      case "Оформление":
                        registration += 1;
                        break;
                      case "Внесён в 1С":
                        base1C += 1;
                        break;
                      case "Пробный день":
                        trial += 1;
                        break;
                      case "Отказ":
                        reject += 1;
                        break;
                      case "Самоотказ":
                        selfReject += 1;
                        break;
                    }
                  }
                });
                if (
                  interview +
                    registration +
                    base1C +
                    trial +
                    reject +
                    selfReject >
                  0
                ) {
                  filteredArray.push({
                    Руководитель: manager.name,
                    Отдел: department.name,
                    Вакансия: job.name,
                    Собеседование: interview,
                    Оформление: registration,
                    Внесён_в_1С: base1C,
                    Пробный_день: trial,
                    Отказ: reject,
                    Самоотказ: selfReject,
                  });
                }
              });
            });
          });
        }
      }
      this.xlsxData = filteredArray;
      return filteredArray.length ? filteredArray : [{}];
    },
  },

  computed: {
    xlsxDataFilteredByDate() {
      let start, end;
      if (this.dates.minDate && this.dates.maxDate) {
        start = new Date(this.dates.minDate);
        end = new Date(this.dates.maxDate);
      }
      return this.filterDates(start, end);
    },
    sheets() {
      return {
        sheets: {
          name: "Сводка по подбору персонала",
          data: this.xlsxDataFilteredByDate,
        },
      };
    },
  },
  mounted: function () {
    //this code should be in gs script ↓
    // const sheet = SpreadsheetApp.getActiveSheet();
    // function getData() {
    //   const range = sheet.getRange('A:K');
    //   const values = range.getValues();
    //   return values;
    // }

    // function doGet() {
    //   var data = getData();
    //   if (!data) {
    //     data = '';
    //   }
    //   return ContentService.createTextOutput(
    //     JSON.stringify(data));
    // }
    //this code should be in gs script ↑
    fetch(this.macrosUrl)
      .then((res) => res.json())
      .then((data) => {
        const temp = data.filter((d) => !d.every((e) => e === ""));
        temp.shift();
        const [colDate, colManager, colStatus, colPosition, colDepartment] = [
          0, 8, 3, 6, 7,
        ];
        this.correctData = temp.filter(
          (d) => d[colDate] && d[colManager] && d[colStatus] && d[colPosition]
        );
        this.incorrectData = temp.filter(
          (d) =>
            !d[colDate] || !d[colManager] || !d[colStatus] || !d[colPosition]
        );

        const handledCorrectData = [];
        temp
          .filter(
            (d) => d[colDate] && d[colManager] && d[colStatus] && d[colPosition]
          )
          .forEach((row) => {
            if (
              handledCorrectData.some(
                (manager) => manager.name === row[colManager].trim()
              )
            ) {
              const currentManager = handledCorrectData.filter(
                (manager) => manager.name === row[colManager].trim()
              )[0];
              const currentDepartment = currentManager.departments.filter(
                (department) => department.name === row[colDepartment].trim()
              )[0];
              if (currentDepartment) {
                const currentJob = currentDepartment.vacancies.filter(
                  (job) => job.name === row[colPosition].trim()
                )[0];
                if (currentJob) {
                  currentJob.statuses.push({
                    date: new Date(row[colDate]),
                    status: row[colStatus].trim(),
                  });
                } else {
                  currentDepartment.vacancies.push({
                    name: row[colPosition].trim(),
                    statuses: [
                      {
                        date: new Date(row[colDate]),
                        status: row[colStatus].trim(),
                      },
                    ],
                  });
                }
              } else {
                currentManager.departments.push({
                  name: row[colDepartment].trim(),
                  vacancies: [
                    {
                      name: row[colPosition].trim(),
                      statuses: [
                        {
                          date: new Date(row[colDate]),
                          status: row[colStatus].trim(),
                        },
                      ],
                    },
                  ],
                });
              }
            } else {
              handledCorrectData.push({
                name: row[colManager].trim(),
                departments: [
                  {
                    name: row[colDepartment].trim(),
                    vacancies: [
                      {
                        name: row[colPosition].trim(),
                        statuses: [
                          {
                            date: new Date(row[colDate]),
                            status: row[colStatus].trim(),
                          },
                        ],
                      },
                    ],
                  },
                ],
              });
            }
          });
        // handledCorrectData.shift();
        this.handledCorrectData = handledCorrectData;
        // const gridTableData = [];
        const xlsxData = [];
        handledCorrectData.forEach((manager) => {
          const currentManager = manager.name;
          manager.departments.forEach((department) => {
            const currentDepartment = department.name;
            department.vacancies.forEach((job) => {
              const currentJob = job.name;
              let interview = 0;
              let registration = 0;
              let base1C = 0;
              let trial = 0;
              let reject = 0;
              let selfReject = 0;
              job.statuses.forEach((item) => {
                // console.log(item)
                this.dates.minDate
                  ? this.dates.minDate > item.date
                    ? (this.dates.minDate = item.date)
                    : null
                  : (this.dates.minDate = item.date);

                this.dates.maxDate
                  ? this.dates.maxDate < item.date
                    ? (this.dates.maxDate = item.date)
                    : null
                  : (this.dates.maxDate = item.date);

                switch (item.status) {
                  case "Собеседование":
                    interview += 1;
                    break;
                  case "Оформление":
                    registration += 1;
                    break;
                  case "Внесён в 1С":
                    base1C += 1;
                    break;
                  case "Пробный день":
                    trial += 1;
                    break;
                  case "Отказ":
                    reject += 1;
                    break;
                  case "Самоотказ":
                    selfReject += 1;
                    break;
                }
              });
              xlsxData.push({
                Руководитель: currentManager,
                Отдел: currentDepartment,
                Вакансия: currentJob,
                Собеседование: interview,
                Оформление: registration,
                Внесён_в_1С: base1C,
                Пробный_день: trial,
                Отказ: reject,
                Самоотказ: selfReject,
              });
            });
          });
        });
        this.dates.defaultMinDate = this.dates.minDate;
        this.dates.defaultMaxDate = this.dates.maxDate;
        this.xlsxData = xlsxData;
      });
  },
};
</script>



<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;

.filters {
  padding: 15px;
  display: flex;
  justify-content: space-around;
  .columns {
    display: flex;
    gap: 5px;
    button {
      width: 100px;
    }
  }
}

@media print {
  body {
    line-height: 1.2;
    visibility: hidden;
    font-size: 20pt;
    background: #fff;
  }
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
    -moz-color-adjust: exact;
  }
  .other {
    font-size: 20pt;
  }
  .table-info {
    font-size: 20pt;
  }
  .print-area,
  .print-area * {
    visibility: visible;
  }
  .print-area {
    position: absolute;
    top: 50px;
  }
  html,
  body,
  .print-area {
    float: none;
    display: block;
    page-break-inside: avoid;
  }
}
</style>