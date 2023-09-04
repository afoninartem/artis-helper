<template>
  <div class="dinners__result">
    <!-- <button class="big-btn" @click.prevent="saveByDate">Скачать итого по датам</button> -->
    <xlsx-workbook
      class="download"
      v-if="byDates"
    >
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in dateSheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download :filename="`Обеды по датам.xls`">
        <button @click.prevent="addSheets">Скачать итого по датам</button>
      </xlsx-download>
    </xlsx-workbook>
    <div class="btn-block companies">
      <button
        v-for="(company, i) in dinners"
        :key="i"
        @click.prevent="getCompanyData(company.name)"
      >
        {{ company.name }}
      </button>
    </div>
    <div
      class="btn-block service-btn"
      v-if="currentCompanyDinners"
    >
      <xlsx-workbook class="download">
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download :filename="`${currentCompanyDinners.name}.xls`">
          <button>Скачать</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
    <div class="output-block">
      <h3>{{ activeCompany }} <span v-if="activeCompany === 'Артис'">({{currentCompanyDinners.departments.reduce((a, b) => a + b.total, 0)}})</span> <span v-if="activeCompany != 'Артис' && currentCompanyDinners">({{currentCompanyDinners.employees.reduce((a,b) => a + b.markList.length, 0)}})</span> </h3>
      <ul v-if="activeCompany === 'Артис'">
        <li
          v-for="(department, i) in currentCompanyDinners.departments"
          :key="`department-${i}`"
        >
          <details>
            <summary>
              <div class="department-name">
                {{ department.name }}
              </div>
              <div class="department-dinners to-right-border">
                {{ department.total }}
              </div>
            </summary>
            <ul>
              <li
                v-for="(employee, i) in department.employees"
                :key="`employee-${i}`"
              >
                <details>
                  <summary>
                    <div class="employee-name">
                      {{ employee.name }}
                    </div>
                    <div class="employee-dinners to-right-border">
                      {{ employee.markList.length }}
                    </div>
                  </summary>
                  <ul>
                    <li
                      v-for="(mark, i) in employee.markList"
                      :key="`mark-${i}`"
                      style="padding: 3px"
                    >
                      {{ mark }}
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>
      </ul>
      <ul v-else-if="activeCompany !== null">
        <li
          v-for="(employee, i) in currentCompanyDinners.employees"
          :key="`other-employee-${i}`"
        >
          <details>
            <summary>
              <div class="employee-name">
                {{ employee.name }}
              </div>
              <div class="employee-dinners to-right-border">
                {{ employee.markList.length }}
              </div>
            </summary>
            <ul>
              <li
                v-for="(mark, i) in employee.markList"
                :key="`mark-${i}`"
                style="padding: 3px"
              >
                {{ mark }}
              </li>
            </ul>
          </details>
        </li>
      </ul>
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
      activeCompany: null,
      dateSheets: [],
    };
  },
  computed: {
    dinners() {
      return this.$store.getters.getHandledSenesys;
    },
    currentCompanyDinners() {
      return this.dinners?.filter((c) => c.name === this.activeCompany)[0];
    },
    handledDownloadingData() {
      const handledResult = [];
      if (this.currentCompanyDinners.departments) {
        this.currentCompanyDinners.departments.forEach((d) => {
          d.employees.forEach((e) => {
            handledResult.push({
              "Код сотрудника": e.code,
              Подразделение: d.name,
              Сотрудник: e.name,
              "Количество обедов": e.markList.length,
            });
          });
        });
      } else {
        this.currentCompanyDinners.employees.forEach((e) => {
          handledResult.push({ employee: e.name, total: e.markList.length });
        });
      }
      return handledResult;
    },
    sheets() {
      return {
        sheets: {
          name: this.currentCompanyDinners.name,
          data: this.handledDownloadingData,
        },
      };
    },
    byDates() {
      return this.$store.getters.getTotalByDate;
    },
    dateSheetsData() {
      return this.$store.getters.getDateSheets;
    }
  },
  methods: {
    getCompanyData(company) {
      this.activeCompany = company;
    },
    addSheets() {
      this.dateSheets.push({
        name: `${this.byDates[0]["Дата"]} - ${this.byDates[this.byDates.length - 2]["Дата"]}`,
        data: this.byDates,
      });
      this.dateSheetsData.forEach(d => {
        this.dateSheets.push({
          name: d.sheetName,
          data: d.sheetHandledData
        })
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.download {
  padding: 20px;
}
.dinners__result {
  .output-block {
    display: grid;
    ul {
      list-style: none;
      margin: 0 auto;
      li {
        details {
          display: block;
          margin-bottom: 0.5rem;
        }
        summary::-webkit-details-marker {
          display: none;
        }
        summary::-moz-list-bullet {
          list-style-type: none;
        }
        summary::marker {
          display: none;
        }
        summary {
          display: flex;
          padding: 0.3em 0.5em 0.3em 0.4em;
          font-size: 1.1em;
          gap: 30px;
          cursor: pointer;
        }
        .to-right-border {
          margin-left: auto;
          margin-right: 0em;
        }
        summary:before {
          content: "+";
          margin-right: 0.3em;
        }
        details[open] > summary:before {
          content: "–";
        }
        details[open] > summary {
          transform: scale(1.1);
          color: orangered;
        }
        summary ~ * {
          padding: 0 1em 0 1em;
        }
        summary:focus {
          outline: 0;
          box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.3),
            inset 0 0 2px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
</style>