<template>
  <div class="time-track" v-if="this.gsDataIsLoaded">
    <h1>Учет рабочего времени</h1>
    <div class="service-block">
      <AddTimeTrackSenesysData v-if="!senesys" />
      <div class="btn-block">
        <button
          v-for="(btn, i) in this.buttons"
          :key="`btn-${i}`"
          @click.prevent="showHide"
        >
          {{ btn.txt }}
        </button>
      </div>
      <xlsx-workbook v-if="senesys">
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="УРВ.xlsx">
          <button>Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
      <a :href="this.url.sheet" target="_blank">Общий табель</a>
    </div>
    <table v-if="senesys">
      <thead>
        <tr @click.prevent="showHide">
          <th v-for="(head, i) in header" :key="`title-${i}`">{{ head }}</th>
        </tr>
      </thead>
      <tbody
        v-for="(department, i) in finalData"
        :key="`department-${i}`"
        class="department"
      >
        <tr
          v-for="(employee, i) in department.employees"
          :key="`employee-${i}`"
        >
          <td
            @dblclick.prevent="deptFilter"
            v-for="(data, i) in employee"
            :key="`data-${i}`"
            :style="{ color: data < 0 ? `red` : `black` }"
          >
            {{ data }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="loader" v-else-if="!this.gsDataIsLoaded">
    <p>LOADING...</p>
  </div>
</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
import AddTimeTrackSenesysData from "@/components/PersonalComponents/AddTimeTrackSenesysData";
export default {
  components: {
    AddTimeTrackSenesysData,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      gsData: [],
      names: [],
      gsDataIsLoaded: false,
      url: {
        sheet: `https://docs.google.com/spreadsheets/d/1f8B0LlK0Sk1TdMYZO2a84fS9mUG-xzhmUfgWmVnMPls/edit#gid=1542361243`,
        macros: `https://script.google.com/macros/s/AKfycbxBd2-JDChhQnGrynuotc2IxHkAI5wPiRpkMLubXaPvBi5aiKVl0zFTwERrQIiku2Hi/exec`,
      },
      buttons: [],
      departmentToFilter: null,
    };
  },
  computed: {
    dataToSave() {
      return this.finalData
        .map((department) => {
          return department.employees;
        })
        .flat();
    },
    finalData() {
      const btnFilter = this.buttons.map((btn) => btn.txt);
      const colFilter = Object.entries(this.columns)
        .filter((el) => !el[1])
        .map((arr) => arr[0]);
      const final = this.senesys
        .filter((d) =>
          this.departmentToFilter
            ? d.department === this.departmentToFilter
            : d.department
        )
        .map((d) => {
          return {
            department: d.department,
            employees: d.employees
              .map((e) =>
                Object.entries(e).filter(
                  (key) =>
                    !colFilter.includes(key[0]) && !btnFilter.includes(key[0])
                )
              )
              .map((employee) => Object.fromEntries(employee)),
          };
        });
      return final;
    },
    columns() {
      const obj = {};
      Object.keys(this.senesys.map((d) => d.employees)[0][0]).forEach((key) => {
        obj[key] = this.senesys
          .map((d) => d.employees)
          .flat()
          .some((v) => v[key] != 0);
      });
      return obj;
    },
    senesys() {
      return this.$store.getters.getTimeTrackSenesys;
    },
    header() {
      const btnFilter = this.buttons.map((btn) => btn.txt);
      const colFilter = Object.entries(this.columns)
        .filter((el) => !el[1])
        .map((arr) => arr[0]);
      return this.senesys
        ? Object.keys(this.senesys[0].employees[0]).filter(
            (key) => !colFilter.includes(key) && !btnFilter.includes(key)
          )
        : null;
    },
    sheets() {
      return {
        sheets: {
          name: "Сводка по УРВ",
          data: this.dataToSave,
        },
      };
    },
  },
  methods: {
    deptFilter(event) {
      console.log(event.target.parentElement.childNodes[3].innerText);
      this.departmentToFilter = this.departmentToFilter
        ? null
        : event.target.parentElement.childNodes[3].innerText;
    },
    showHide(event) {
      const txt = event.target.innerText;
      const ind = event.target.cellIndex;
      console.log(txt, ind);

      this.buttons.some((b) => b.txt === txt)
        ? (this.buttons = this.buttons.filter((b) => b.txt !== txt))
        : this.buttons.push({ ind, txt });

      this.buttons = this.buttons
        .sort((a, b) => a.ind - b.ind)
        .filter((e) => e);
    },
  },
  mounted: function () {
    fetch(this.url.macros)
      .then((res) => res.json())
      .then((data) => {
        this.gsDataIsLoaded = true;
        for (let i in data) {
          if (i.trim() && i != "header") {
            const employees = [];
            data[i].forEach((d) => {
              this.names.push(d._01_name.trim());
              employees.push({
                "№": d._00_num,
                ФИО: d._01_name,
                Должность: d._02_positon,
                Отдел: d._03_department,
                "Норма дней": d._16_normaDaysTS,
                "Норма часов": d._17_normaHoursTS,
                "Итого часов": d._04_totalHoursTS,
                "Итого дней": d._05_totalDaysTS,
                "Работа на дому": d._08_workFromHomeDaysTS,
                "Отработано дней в офисе": d._06_officeDaysTS,
                Отпуск: d._09_vacationDaysTS,
                "Нерабочий день": d._07_nonWorkingDaysTS,
                "За свой счет": d._11_ownExpenseDaysTS,
                Больничный: d._10_illnessDaysTS,
                "Прогулы (пр)": d._12_absenceDaysTS,
                "Простой (пс)": d._13_downtimeHoursTS,
                "Командировка (к)": d._14_businessTripDaysTS,
                "Учеба (у)": d._15_studyDaysTS,
                "Переработка по табелю": d._18_overjobHoursTS,
                "Часы УРВ (без обедов)": d._19_hardWorkingHoursSenesys,
                "Переработка по УРВ": d._20_overJobHoursSenesys,
                "Расхождение табель - УРВ": d._21_dataDifference,
                Компенсация: d._22_compensation,
                "Дата увольнения": d._23_firing,
                Примечание: d._24_comment,
              });
            });
            this.gsData.push({ department: i.trim(), employees });
            this.$store.dispatch("setGoogleData", this.gsData);
          }
        }
        if (this.names.length) {
          this.$store.dispatch("setEmployeesNames", this.names);
        }
      });
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
thead tr th {
  cursor: pointer;
}
.service-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  a {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-decoration: none;
  }
  .btn-block {
    display: flex;
    gap: 5px;
  }
}
</style>