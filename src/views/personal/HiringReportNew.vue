<template>
  <div class="hiring-report" v-if="candidates">
    <h1>Сводка по кандидатам</h1>
    <div class="options">
      <form class="options__item calendar">
        <input type="date" name="start" id="start" v-model="dates.minDate" />
        <input type="date" name="end" id="end" v-model="dates.maxDate" />
        <button @click.prevent="defaultDates">Сбросить</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="(head, h) in header" :key="h">
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(candidate, c) in datesFilter()" :key="c">
          <td>{{ c + 1 }}</td>
          <td>{{ datetimeConverter(candidate.datetime) }}</td>
          <!-- <td>
            <input
              type="datetime-local"
              name="datetime"
              id="datetime"
              :value="candidate.datetime"
              @change.prevent="changeDate(candidate.candidateID)"
            />
          </td> -->
          <td>{{ candidate.title }}</td>
          <td>{{ candidate.supervisor }}</td>
          <td>{{ candidate.name }}</td>
          <td
            @click.prevent="
              openStatusPopup(
                candidate.candidateID,
                candidateStatusList.filter(
                  (s) => s.status === candidate.status
                )[0].bgColor
              )
            "
            class="status"
            :style="{
              background: candidateStatusList.filter(
                (s) => s.status === candidate.status
              )[0].bgColor,
            }"
          >
            {{ candidate.status }}
          </td>
          <td @click.prevent="changeComment(candidate.candidateID)">
            {{ candidate.comment }}
          </td>
        </tr>
      </tbody>
    </table>
    <CommentPopUp />
    <StatusesPopUp />
  </div>
  <div v-else>Идёт загрузка</div>
</template>

<script>
// import ClickOutside from "vue-click-outside";
import CommentPopUp from "@/components/PersonalComponents/vacancies/CommentPopUp";
import StatusesPopUp from "@/components/PersonalComponents/vacancies/StatusesPopUp";
export default {
  components: {
    CommentPopUp,
    StatusesPopUp,
  },
  // directives: {
  //   ClickOutside,
  // },
  data() {
    return {
      dates: {
        allDates: [],
        defaultMinDate: null,
        defaultMaxDate: null,
        minDate: new Date(),
        maxDate: new Date(),
      },
      header: [
        "#",
        "Дата и время",
        "Должность",
        "Руководитель",
        "ФИО",
        "Статус",
        "Комментарий",
      ],
      candidateStatusList: [
        {
          status: "Самоотказ до собеседования",
          bgColor: "pink",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Самоотказ после собеседования",
          bgColor: "pink",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Отказ до собеседования",
          bgColor: "pink",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Отказ после собеседования",
          bgColor: "pink",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Собеседование",
          bgColor: "rgb(154, 106, 187)",
          updateDate: 1,
          datetime: null,
        },
        {
          status: "2-й этап собеседования",
          bgColor: "rgba(76, 20, 114)",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Пробный день",
          bgColor: "rgb(84, 143, 219)",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Внесён в 1С",
          bgColor: "rgb(122, 212, 122)",
          updateDate: 0,
          datetime: null,
        },
        {
          status: "Оформление",
          bgColor: "rgb(209, 211, 113)",
          updateDate: 0,
          datetime: null,
        },
      ],
      currentCommentText: null,
      newCommentText: null,
    };
  },
  methods: {
    datetimeConverter(str) {
      const converter = require("../../store/dateHandler");
      return converter.dateTime(str);
    },
    async changeDate(id) {
      await this.$store.dispatch("changeCandidateDate", {
        id,
        value: event.target.value,
      });
      await this.$store.dispatch("updateVacanciesDate");
      await this.$store.dispatch("setActualVacancies");
      await this.$store.dispatch("updateCandidatesDate");
      await this.$store.dispatch("setActualCandidates");
      if (this.candidates) {
        this.dates.allDates = [];
        this.candidates.forEach((candidate) => {
          this.setMinMaxDate(candidate.datetime);
          this.$forceUpdate();
        });
      }
    },
    async openStatusPopup(id, bg) {
      return await this.$store.dispatch("openStatusPopup", {
        candidateID: id,
        bgColor: bg,
      });
    },
    async changeComment(id) {
      return await this.$store.dispatch("openChangeCommentPopupVisibility", {
        id,
        type: "candidate",
      });
    },

    defaultDates() {
      this.dates.minDate = this.dates.defaultMinDate;
      this.dates.maxDate = this.dates.defaultMaxDate;
    },
    setMinMaxDate(date) {
      const candidateDatetime = new Date(date).toISOString().substring(0, 10);
      this.dates.allDates.includes(candidateDatetime)
        ? null
        : this.dates.allDates.push(candidateDatetime);
      this.dates.allDates.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      this.dates.minDate = this.dates.allDates[0];
      this.dates.maxDate = this.dates.allDates[this.dates.allDates.length - 1];
      this.dates.defaultMinDate = this.dates.minDate;
      this.dates.defaultMaxDate = this.dates.maxDate;
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
  },
  computed: {
    candidates() {
      return this.$store.getters.getActualStates.candidates
        ? Array.from(this.$store.getters.getActualStates.candidates)
            .map((candidate) => {
              if (
                candidate.status === "2-й этап собеседования" &&
                candidate.statuslist.some(
                  (s) => s.status === "Собеседование" && s.updateDate > 0
                ) &&
                candidate.statuslist.some(
                  (s) =>
                    s.status === "2-й этап собеседования" && s.updateDate > 0
                )
              ) {
                const candidate1 = Object.assign({}, candidate);
                const candidate2 = Object.assign({}, candidate);
                candidate1.statuslist = Array.from(candidate.statuslist).filter(
                  (s) => s.status !== "2-й этап собеседования"
                );
                candidate2.statuslist = Array.from(candidate.statuslist).filter(
                  (s) => s.status !== "Собеседование"
                );
                candidate1.name = candidate.name + " (1)";
                candidate2.name = candidate.name + " (2)";
                candidate1.datetime = Array.from(candidate.statuslist).filter(
                  (s) => s.status === "Собеседование"
                )[0].datetime;
                candidate1.status = Array.from(candidate.statuslist).filter(
                  (s) => s.status === "Собеседование"
                )[0].status;
                // console.log(candidate1, candidate2)
                return [candidate1, candidate2];
              }
              return candidate;
            })
            .flat()
            .sort(
              (a, b) =>
                new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
            )
        : null;
    },
  },

  beforeMount: async function () {
    await this.$store.dispatch("setActualCandidates");
    await this.$store.dispatch("setActualVacancies");
    const candidates = this.$store.getters.getActualStates.candidates;
    if (candidates) {
      this.dates.allDates = [];
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
.status {
  cursor: pointer;
}
.options {
  padding: 0 0 20px;
}
select {
  font-size: 16px;
}
.orange {
  background: rgb(209, 211, 113);
}
.purple {
  background: rgb(154, 106, 187);
}
.green {
  background: rgb(122, 212, 122);
}
.blue {
  background: rgba(84, 143, 219, 0.726);
}
</style>