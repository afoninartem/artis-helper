<template>
  <div class="vacancies" v-if="vacancies">
    <h1>Вакансии</h1>
    <div class="vacancies__menu">
      <button @click.prevent="addNewVacancy">Новая вакансия</button>
    </div>
    <hr />
    <div
      class="vacancies__list"
      v-for="(status, s) in vacancies.sorted"
      :key="s"
    >
      <h3 v-if="status.length">
        {{
          status[0].status === "Открыта"
            ? `Открытые вакасии`
            : status[0].status === "Пауза"
            ? `Приостановленные вакансии`
            : `Закрытые вакансии`
        }}
      </h3>
      <ul>
        <li v-for="(vacancy, i) in status" :key="i">
          <div class="info-block">
            <p>
              Должность: <span>{{ vacancy.title }}</span>
            </p>
            <p>
              Подразделение (отдел): <span>{{ vacancy.department }}</span>
            </p>
            <p>
              Руководитель: <span>{{ vacancy.supervisor }}</span>
            </p>
            <p>
              Статус:
              <span
                >{{ vacancy.status }} c
                {{ new Date(+vacancy.id).toLocaleString("ru-Ru").substring(0, 17) }}</span
              >
            </p>
            <p>
              Осталось нанять: <span>{{ leftToHire(vacancy.id) }}</span>
            </p>
          </div>
          <div class="menu-block">
            <p>
              <a :href="vacancy.link" target="_blank"
                ><img
                  src="../../assets/personal/hh_logo.png"
                  height="35"
                  alt="hh.ru"
              /></a>
            </p>
            <p @click.prevent="addNewCandidate(vacancy.id)"><AddCandidate /></p>
          </div>
        </li>
      </ul>
    </div>
    <VacanciesPopUp />
    <CandidatePopUp />
  </div>
</template>

<script>
import VacanciesPopUp from "@/components/PersonalComponents/vacancies/VacanciesPopUp.vue";
import CandidatePopUp from "@/components/PersonalComponents/vacancies/CandidatePopUp.vue";
import AddCandidate from "@/components/PersonalComponents/vacancies/AddCandidate.vue";
export default {
  components: {
    VacanciesPopUp,
    CandidatePopUp,
    AddCandidate,
  },
  data() {
    return {};
  },
  methods: {
    async addNewVacancy() {
      await this.$store.dispatch("openAddVacancyPopup");
    },
    async addNewCandidate(id) {
      await this.$store.dispatch("openAddCandidatePopup", id);
    },
    leftToHire(vacancyID) {
      if (this.candidates) {
        const requiredQuantity = this.vacancies.all.filter(
          (v) => v.id === vacancyID
        )[0].quantity;
        const hiredQuantity = this.candidates.filter(
          (c) => c.vacancyID === vacancyID && c.status === "Оформление"
        ).length;
        return requiredQuantity - hiredQuantity;
      }
      return null;
    },
  },
  computed: {
    vacancies() {
      const vacancies = this.$store.getters.getActualStates.vacancies;
      if (vacancies) {
        return {
          sorted: {
            opened: Array.from(vacancies).filter((v) => v.status === "Открыта"),
            paused: Array.from(vacancies).filter((v) => v.status === "Пауза"),
            closed: Array.from(vacancies).filter((v) => v.status === "Закрыта"),
          },
          all: vacancies,
        };
      }
      return null;
    },
    candidates() {
      return this.$store.getters.getActualStates.candidates;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualVacancies");
    await this.$store.dispatch("setActualCandidates");
  },
};
</script>

<style lang="scss" >
.vacancies {
  hr {
    margin: 50px 0;
  }
  .vacancies__list {
    ul {
      padding: 1rem;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0 auto;
      li {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-block {
          display: flex;
          justify-content: space-between;
          p {
            width: 300px;
            text-align: left;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            span {
              font-weight: bold;
            }
          }
        }
        .menu-block {
          p {
            cursor: pointer;
          }
          p a {
            &:hover {
              background: none;
            }
          }
        }
        // p {
        //   width: 300px;
        //   text-align: left;
        //   &:nth-last-child(-n + 2) {
        //     width: 50px;
        //     justify-self: flex-end;
        //     cursor: pointer;
        //   // }
        //   a {
        //     text-decoration: none;
        //     &:hover {
        //       background: none;
        //     }
        //   }
        // }
      }
    }
  }
}
</style>