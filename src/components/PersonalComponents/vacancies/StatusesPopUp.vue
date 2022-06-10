<template>
  <div class="statuses-popup" v-if="show">
    <div class="statuses-popup__background" :style="{ background: bg }">
      <div class="statuses-popup__content">
        <h1>{{ candidate.name }}</h1>
        <ul>
          <li v-for="(status, s) in candidateStatusList" :key="s">
            <div class="status">
              <p @click.prevent="addDateTime(status.status)">
                {{ status.status }}
              </p>
              <input
                type="datetime-local"
                name="status-datetime"
                :id="s"
                v-if="status.datetime"
                v-model="status.datetime"
                @change="setUpdateDate(status.status)"
              />
              <button
                @click.prevent="removeStatus(status.status)"
                v-if="status.datetime"
              >
                Отмена действия
              </button>
            </div>
          </li>
        </ul>
        <div class="btn-block">
          <button @click.prevent="setNewDates">Сохранить изменения</button>
          <button @click.prevent="close">Закрыть без сохранения</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      candidateStatusList: [
        {
          status: "Самоотказ до собеседования",
          bgColor: "pink",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Самоотказ после собеседования",
          bgColor: "pink",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Отказ до собеседования",
          bgColor: "pink",
          datetime: null,
          //  updateDate: 0,
        },
        {
          status: "Отказ после собеседования",
          bgColor: "pink",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Собеседование",
          bgColor: "rgb(154, 106, 187)",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "2-й этап собеседования",
          bgColor: "rgba(76, 20, 114)",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Пробный день",
          bgColor: "rgb(84, 143, 219)",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Внесён в 1С",
          bgColor: "rgb(122, 212, 122)",
          datetime: null,
          // updateDate: 0,
        },
        {
          status: "Оформление",
          bgColor: "rgb(209, 211, 113)",
          datetime: null,
          // updateDate: 0,
        },
      ],
    };
  },

  methods: {
    async setNewDates() {
      await this.$store.dispatch("setNewDates", {
        statuslist: this.candidateStatusList,
        candidateID: this.candidate.candidateID,
      });
      await this.$store.dispatch("updateVacanciesDate");
      await this.$store.dispatch("setActualVacancies");
      await this.$store.dispatch("updateCandidatesDate");
      await this.$store.dispatch("setActualCandidates");
      return await this.$store.dispatch("closeStatusPopup");
    },
    setUpdateDate(status) {
      this.candidateStatusList.filter(s => s.status === status)[0].updateDate = Date.now()
    },
    setData(statuslist) {
      statuslist.forEach((status) => {
        Object.assign(this.candidateStatusList.filter(s => s.status === status.status)[0], status)
      });
    },
    removeStatus(status) {
      const currStatus = this.candidateStatusList.filter((s) => s.status === status)[0]
      currStatus.datetime = null;
      currStatus.updateDate = 0;
    },
    async close() {
      return await this.$store.dispatch("closeStatusPopup");
    },
    async addDateTime(status) {
      this.candidateStatusList.filter((s) => s.status === status)[0].datetime =
        new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000)
          .toISOString()
          .substring(0, 16);
      this.candidateStatusList.filter(
        (s) => s.status === status
      )[0].updateDate = Date.now();
    },
  },
  computed: {
    show() {
      return this.$store.getters.getStatusesPopupVisibility;
    },
    bg() {
      return this.$store.getters.getStatusesPopupBgColor;
    },
    candidate() {
      const candidateID = this.$store.getters.getCurrentCandidateID;
      const candidates = this.$store.getters.getActualStates.candidates;
      if (candidateID && candidates) {
        this.setData(
          candidates.filter((c) => c.candidateID === candidateID)[0].statuslist
        );
        return candidates.filter((c) => c.candidateID === candidateID)[0];
      }
      return null;
    },
  },
  // beforeMount() {
  //   this.candidateStatusList.forEach((c) => (c.datetime = null));
  // },
};
</script>


<style lang="scss">
.statuses-popup {
  .statuses-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(71, 151, 124);
    .statuses-popup__content {
      transform: scale(1.5);
      ul {
        list-style: none;
        li {
          .status {
            // padding: 10px;
            display: grid;
            grid-template-columns: 1fr 0.6fr 0.5fr;
            align-items: center;
            gap: 33px;
            p {
              padding: 10px;
              text-align: left;
              margin: 0;
              cursor: pointer;
              transition: all 1s;
              &:hover {
                // border-bottom: 1px solid black;
                transform: translateX(15%);
                // text-align: right;
                transition: all 1s;
              }
            }
          }
        }
      }
    }
  }
}
</style>