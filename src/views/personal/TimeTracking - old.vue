<template>
  <div v-if="this.gsDataIsLoaded">
    <h1>Учет рабочего времени</h1>
    <div class="service-block">
      <AddTimeTrackSenesysData v-if="!senesys" />
      <div class="btn-block" v-if="senesys" @click.prevent="showHide">
        <button v-if="this.buttons.num.status">№</button>
        <button v-if="this.buttons.name.status">ФИО</button>
        <button v-if="this.buttons.position.status">Должность</button>
        <button v-if="this.buttons.department.status">Отдел</button>
        <button v-if="this.buttons.normaDays.status">Норма дней</button>
        <button v-if="this.buttons.normaHours.status">Норма часов</button>
        <button v-if="this.buttons.totalHours.status">Итого часов</button>
        <button v-if="this.buttons.totalDays.status">Итого дней</button>
        <button v-if="columns.workFromHome && this.buttons.workFromHome.status">
          Работа на дому
        </button>
        <button v-if="this.buttons.officeDays.status">
          Отработано дней в офисе
        </button>
        <button v-if="columns.vacation && this.buttons.vacation.status">
          Отпуск
        </button>
        <button v-if="columns.nonWorking && this.buttons.nonWorking.status">
          Нерабочий день
        </button>
        <button v-if="columns.ownExpanse && this.buttons.ownExpanse.status">
          За свой счет
        </button>
        <button v-if="columns.illness && this.buttons.illness.status">
          Больничный
        </button>
        <button v-if="columns.absence && this.buttons.absence.status">
          Прогулы (пр)
        </button>
        <button v-if="columns.downtime && this.buttons.downtime.status">
          Простой (пс)
        </button>
        <button v-if="columns.buisnessTrip && this.buttons.buisnessTrip.status">
          Командировка (к)
        </button>
        <button v-if="columns.study && this.buttons.study.status">
          Учеба (у)
        </button>
        <button v-if="this.buttons.overjobHoursTS.status">
          Переработка по табелю
        </button>
        <button v-if="this.buttons.hardWorking.status">
          Часы УРВ (без обедов)
        </button>
        <button v-if="this.buttons.overJobHoursSenesys.status">
          Переработка по УРВ
        </button>
        <button v-if="this.buttons.dataDifference.status">
          Расхождение табель - УРВ
        </button>
        <button v-if="columns.compensation && this.buttons.compensation.status">
          Компенсация
        </button>
        <button v-if="columns.firingDate && this.buttons.firingDate.status">
          Дата увольнения
        </button>
        <button v-if="columns.comment && this.buttons.comment.status">
          Примечание
        </button>
      </div>
      <xlsx-workbook>
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
    <div class="table-area" v-if="senesys">
      <table ref="table">
        <thead>
          <tr @click.prevent="showHide">
            <th v-if="!this.buttons.num.status">№</th>
            <th v-if="!this.buttons.name.status">ФИО</th>
            <th v-if="!this.buttons.position.status">Должность</th>
            <th v-if="!this.buttons.department.status">Отдел</th>
            <th v-if="!this.buttons.normaDays.status">Норма дней</th>
            <th v-if="!this.buttons.normaHours.status">Норма часов</th>
            <th v-if="!this.buttons.totalHours.status">Итого часов</th>
            <th v-if="!this.buttons.totalDays.status">Итого дней</th>
            <th
              v-if="columns.workFromHome && !this.buttons.workFromHome.status"
            >
              Работа на дому
            </th>
            <th v-if="!this.buttons.officeDays.status">
              Отработано дней в офисе
            </th>
            <th v-if="columns.vacation && !this.buttons.vacation.status">
              Отпуск
            </th>
            <th v-if="columns.nonWorking && !this.buttons.nonWorking.status">
              Нерабочий день
            </th>
            <th v-if="columns.ownExpanse && !this.buttons.ownExpanse.status">
              За свой счет
            </th>
            <th v-if="columns.illness && !this.buttons.illness.status">
              Больничный
            </th>
            <th v-if="columns.absence && !this.buttons.absence.status">
              Прогулы (пр)
            </th>
            <th v-if="columns.downtime && !this.buttons.downtime.status">
              Простой (пс)
            </th>
            <th
              v-if="columns.buisnessTrip && !this.buttons.buisnessTrip.status"
            >
              Командировка (к)
            </th>
            <th v-if="columns.study && !this.buttons.study.status">
              Учеба (у)
            </th>
            <th v-if="!this.buttons.overjobHoursTS.status">
              Переработка по табелю
            </th>
            <th v-if="!this.buttons.hardWorking.status">
              Часы УРВ (без обедов)
            </th>
            <th v-if="!this.buttons.overJobHoursSenesys.status">
              Переработка по УРВ
            </th>
            <th v-if="!this.buttons.dataDifference.status">
              Расхождение табель - УРВ
            </th>
            <th
              v-if="columns.compensation && !this.buttons.compensation.status"
            >
              Компенсация
            </th>
            <th v-if="columns.firingDate && !this.buttons.firingDate.status">
              Дата увольнения
            </th>
            <th v-if="columns.comment && !this.buttons.comment.status">
              Примечание
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, i) in finalReport" :key="`employee-${i}`">
            <!-- <td v-for="detail, i in employee" :key="`detail-${i}`">
              {{detail}}
            </td> -->
            <td v-if="!buttons.num.status">{{ employee._00_num }}</td>
            <td v-if="!buttons.name.status">{{ employee._01_name }}</td>
            <td v-if="!buttons.position.status">{{ employee._02_positon }}</td>
            <td v-if="!buttons.department.status">
              {{ employee._03_department }}
            </td>
            <td v-if="!buttons.normaDays.status">
              {{ employee._16_normaDaysTS }}
            </td>
            <td v-if="!buttons.normaHours.status">
              {{ employee._17_normaHoursTS }}
            </td>
            <td v-if="!buttons.totalHours.status">
              {{ employee._04_totalHoursTS }}
            </td>
            <td v-if="!buttons.totalDays.status">
              {{ employee._05_totalDaysTS }}
            </td>
            <td v-if="columns.workFromHome && !buttons.workFromHome.status">
              {{ employee._08_workFromHomeDaysTS }}
            </td>
            <td v-if="!buttons.officeDays.status">
              {{ employee._06_officeDaysTS }}
            </td>
            <td v-if="columns.vacation && !buttons.vacation.status">
              {{ employee._09_vacationDaysTS }}
            </td>
            <td v-if="columns.nonWorking && !buttons.nonWorking.status">
              {{ employee._07_nonWorkingDaysTS }}
            </td>
            <td v-if="columns.ownExpanse && !buttons.ownExpanse.status">
              {{ employee._11_ownExpenseDaysTS }}
            </td>
            <td v-if="columns.illness && !buttons.illness.status">
              {{ employee._10_illnessDaysTS }}
            </td>
            <td v-if="columns.absence && !buttons.absence.status">
              {{ employee._12_absenceDaysTS }}
            </td>
            <td v-if="columns.downtime && !buttons.downtime.status">
              {{ employee._13_downtimeHoursTS }}
            </td>
            <td v-if="columns.buisnessTrip && !buttons.buisnessTrip.status">
              {{ employee._14_businessTripDaysTS }}
            </td>
            <td v-if="columns.study && !buttons.study.status">
              {{ employee._15_studyDaysTS }}
            </td>
            <td v-if="!buttons.overjobHoursTS.status">
              {{ employee._18_overjobHoursTS }}
            </td>
            <td
              v-if="!buttons.hardWorking.status"
              :style="{
                color: employee._19_hardWorkingHoursSenesys.includes('-')
                  ? 'red'
                  : '#000',
              }"
            >
              {{ employee._19_hardWorkingHoursSenesys }}
            </td>
            <td v-if="!buttons.overJobHoursSenesys.status">
              {{ employee._20_overJobHoursSenesys }}
            </td>
            <td v-if="!buttons.dataDifference.status">
              {{ employee._21_dataDifference }}
            </td>
            <td v-if="columns.compensation && !buttons.compensation.status">
              {{ employee._22_compensation }}
            </td>
            <td v-if="columns.firingDate && !buttons.firingDate.status">
              {{ employee._23_firing }}
            </td>
            <td v-if="columns.comment && !buttons.comment.status">
              {{ employee._24_comment }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else-if="!this.gsDataIsLoaded">Loading...</div>
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
      buttons: {
        num: { name: "№", status: false },
        name: { name: "ФИО", status: false },
        position: { name: "Должность", status: false },
        department: { name: "Отдел", status: false },
        normaDays: { name: "Норма дней", status: false },
        normaHours: { name: "Норма часов", status: false },
        totalHours: { name: "Итого часов", status: false },
        totalDays: { name: "Итого дней", status: false },
        workFromHome: { name: "Работа на дому", status: false },
        officeDays: { name: "Отработано дней в офисе", status: false },
        vacation: { name: "Отпуск", status: false },
        nonWorking: { name: "Нерабочий день", status: false },
        ownExpanse: { name: "За свой счёт", status: false },
        illness: { name: "Больничный", status: false },
        absence: { name: "Прогулы (пр)", status: false },
        downtime: { name: "Простой (пс)", status: false },
        buisnessTrip: { name: "Командировка (к)", status: false },
        study: { name: "Учеба (у)", status: false },
        overjobHoursTS: { name: "Переработка по табелю", status: false },
        hardWorking: { name: "Часы УРВ (без обедов)", status: false },
        overJobHoursSenesys: { name: "Переработка по УРВ", status: false },
        dataDifference: { name: "Расхождение табель - УРВ", status: false },
        compensation: { name: "Компенсация", status: false },
        firingDate: { name: "Дата увольнения", status: false },
        comment: { name: "Примечание", status: false },
      },
      tableHeader: null,
      gsDataIsLoaded: false,
      gsData: [],
      names: [],
      url: {
        sheet: `https://docs.google.com/spreadsheets/d/1f8B0LlK0Sk1TdMYZO2a84fS9mUG-xzhmUfgWmVnMPls/edit#gid=1542361243`,
        macros: `https://script.google.com/macros/s/AKfycbwcZz54BuwQDZ04oimec-5jHFYFCM2R9Hu-RJCaLvchgsD92VFEdfTKaGTQIPjzNtJv/exec`,
      },
    };
  },
  computed: {
    sheets() {
      return {
        sheets: {
          name: "Сводка по УРВ",
          data: this.finalReport,
        },
      };
    },
    columns() {
      return {
        workFromHome: this.finalReport.filter(
          (r) => r._08_workFromHomeDaysTS != 0
        ).length,
        vacation: this.finalReport.filter((r) => r._09_vacationDaysTS != 0)
          .length,
        nonWorking: this.finalReport.filter((r) => r._07_nonWorkingDaysTS != 0)
          .length,
        ownExpanse: this.finalReport.filter((r) => r._11_ownExpenseDaysTS != 0)
          .length,
        illness: this.finalReport.filter((r) => r._11_ownExpenseDaysTS != 0)
          .length,
        absence: this.finalReport.filter((r) => r._12_absenceDaysTS != 0)
          .length,
        downtime: this.finalReport.filter((r) => r._13_downtimeHoursTS != 0)
          .length,
        buisnessTrip: this.finalReport.filter(
          (r) => r._14_businessTripDaysTS != 0
        ).length,
        study: this.finalReport.filter((r) => r._15_studyDaysTS != 0).length,
        compensation: this.finalReport.filter((r) => r._22_compensation != "")
          .length,
        firingDate: this.finalReport.filter((r) => r._23_firing != "").length,
        comment: this.finalReport.filter((r) => r._24_comment != "").length,
      };
    },
    senesys() {
      return this.$store.getters.getTimeTrackSenesys;
    },
    finalReport() {
      const final = [];
      this.gsData.forEach((d) => {
        d.employees.forEach((e) => {
          const final_employee = Object.assign(e);

          final_employee._19_hardWorkingHoursSenesys =
            this.senesys?.filter((s) => s.name.trim() === e._01_name.trim())[0]
              ?.timeTrackData || "нет отметок";

          const normaMinutes = final_employee._17_normaHoursTS * 60;

          const senesysWorkTimeMinutes =
            final_employee._19_hardWorkingHoursSenesys !== "нет отметок"
              ? !final_employee._19_hardWorkingHoursSenesys.includes("-")
                ? final_employee._19_hardWorkingHoursSenesys.split(":")
                    .length === 2
                  ? +final_employee._19_hardWorkingHoursSenesys.split(":")[0] *
                      60 +
                    +final_employee._19_hardWorkingHoursSenesys.split(":")[1]
                  : +final_employee._19_hardWorkingHoursSenesys.split(":")[0] *
                    60
                : final_employee._19_hardWorkingHoursSenesys.split(":")
                    .length === 2
                ? (+final_employee._19_hardWorkingHoursSenesys
                    .split("-")
                    .filter((f) => f != "")
                    .join("")
                    .split(":")[0] *
                    60 +
                    +final_employee._19_hardWorkingHoursSenesys.split(":")[1]) *
                  -1
                : +final_employee._19_hardWorkingHoursSenesys
                    .split("-")
                    .filter((f) => f != "")
                    .join("")
                    .split(":")[0] * -60
              : final_employee._19_hardWorkingHoursSenesys;

          const totalMinutesTS = final_employee._04_totalHoursTS * 60;
          const diff =
            typeof totalMinutesTS === "number" &&
            typeof senesysWorkTimeMinutes === "number"
              ? totalMinutesTS - senesysWorkTimeMinutes
              : "нет отметок";

          final_employee._21_dataDifference =
            typeof diff === "number"
              ? `${
                  diff > 0 ? Math.floor(diff / 60) : -Math.floor(-diff / 60)
                }:${
                  Math.abs(diff % 60) > 9
                    ? Math.abs(diff % 60)
                    : "0" + Math.abs(diff % 60)
                }`
              : "нет отметок";

          const overJobHoursSenesys =
            typeof senesysWorkTimeMinutes === "number"
              ? senesysWorkTimeMinutes - normaMinutes
              : senesysWorkTimeMinutes;

          final_employee._20_overJobHoursSenesys =
            typeof senesysWorkTimeMinutes === "number"
              ? overJobHoursSenesys > 0
                ? overJobHoursSenesys % 60
                  ? `${Math.floor(overJobHoursSenesys / 60)}:${
                      overJobHoursSenesys % 60 > 9
                        ? overJobHoursSenesys % 60
                        : "0" + (overJobHoursSenesys % 60)
                    }`
                  : overJobHoursSenesys / 60
                : overJobHoursSenesys % 60
                ? `${-Math.floor(-overJobHoursSenesys / 60)}:${
                    -overJobHoursSenesys % 60 > 9
                      ? -overJobHoursSenesys % 60
                      : "0" + (-overJobHoursSenesys % 60)
                  }`
                : overJobHoursSenesys / 60
              : senesysWorkTimeMinutes;

          final.push(final_employee);
        });
      });
      return final;
    },
  },
  methods: {
    showHide(event) {
      // const target = event.target;
      // const text = target.innerText;
      // const parent = target.parentElement;
      // const index = Array.from(parent.childNodes)
      //   .map((n) => n.innerText)
      //   .indexOf(text);
      // console.log(parent, index, text);
      for (let btn in this.buttons) {
        // console.log(btn, event.target.innerText)
        if (this.buttons[btn].name === event.target.innerText)
          this.buttons[btn].status = !this.buttons[btn].status;
      }
    },
  },
  mounted: function () {
    fetch(this.url.macros)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        this.gsDataIsLoaded = true;
        this.tableHeader = data.header;
        for (let i in data) {
          if (i.trim() && i != "header") {
            data[i].forEach((d) => this.names.push(d._01_name));
            this.gsData.push({ department: i.trim(), employees: data[i] });
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

thead {
  cursor: pointer;
  tr {
    th {
      position: sticky;
      -webkit-position: sticky;
      inset-block-start: 0;
      -webkit-inset-block-start: 0;
    }
  }
}

.service-block {
  padding: 15px;
  display: flex;
  justify-content: space-around;
  .btn-block {
    display: flex;
    gap: 15px;
  }
  .columns {
    display: flex;
    gap: 5px;
    button {
      width: 100px;
    }
  }
}
</style>
