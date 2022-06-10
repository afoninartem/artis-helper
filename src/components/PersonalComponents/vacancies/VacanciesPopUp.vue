<template>
  <div class="vacancies-popup" v-if="show">
    <div class="vacancies-popup__background">
      <div class="vacancies-popup__content">
        <form action="" class="vacancies__addition-form">
          <label for="title">Должность:</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Должность"
            v-model.trim="newVacancy.title"
            required
          />

          <label for="department">Подразделение (отдел):</label>
          <!-- <input
            type="text"
            name="department"
            id="department"
            placeholder="Подразделение (отдел)"
            v-model.trim="newVacancy.department"
            required
          /> -->
          <select
            name="department"
            id="department"
            v-model="newVacancy.department"
          >
            <option v-for="(dept, d) in departmentsList" :key="d">
              {{ dept.title }}
            </option>
          </select>

          <label for="supervisor">Руководитель:</label>
          <!-- <input
            type="text"
            name="supervisor"
            id="supervisor"
            placeholder="Руководитель"
            v-model.trim="newVacancy.supervisor"
            required
          /> -->
          <select
            name="supervisor"
            id="supervisor"
            v-model="newVacancy.supervisor"
          >
            <option v-for="(sup, s) in supervisorsList" :key="s">
              {{ sup.title }}
            </option>
          </select>

          <label for="status">Статус:</label>
          <select
            name="status"
            id="status"
            v-model.trim="newVacancy.status"
            required
          >
            <option selected="selected">Открыта</option>
            <option>Пауза</option>
            <option>Закрыта</option>
          </select>

          <label for="quantity">Количество мест:</label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            placeholder="Количество ваканстных мест"
            v-model.trim="newVacancy.quantity"
            required
          />

          <label for="link">Ссылка на hh.ru:</label>
          <input
            type="text"
            name="link"
            id="link"
            placeholder="Ссылка на вакансию"
            v-model.trim="newVacancy.link"
            required
          />
        </form>
        <div class="buttons">
          <button @click.prevent="addVacancy">Открыть вакансию</button>
          <button @click.prevent="closePopup">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newVacancy: {
        title: "",
        status: "Открыта",
        quantity: 1,
        supervisor: "",
        link: "",
      },
    };
  },
  methods: {
    async addVacancy() {
      await this.$store.dispatch("addVacancy", this.newVacancy);
      await this.$store.dispatch("updateVacanciesDate");
      await this.$store.dispatch("setActualVacancies");
      return await this.$store.dispatch("closeAddVacancyPopup");
    },
    async closePopup() {
      return await this.$store.dispatch("closeAddVacancyPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getAddVacancyPopupVisibility;
    },
    supervisorsList() {
      return this.$store.getters.getActualStates.catalogPersonal
        ? this.$store.getters.getActualStates.catalogPersonal.filter(
            (s) => s.type === "Руководитель"
          )
        : null;
    },
    departmentsList() {
      return this.$store.getters.getActualStates.catalogPersonal
        ? this.$store.getters.getActualStates.catalogPersonal.filter(
            (s) => s.type === "Подразделение"
          )
        : null;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualCatalogPersonal");
  },
};
</script>

<style lang="scss" >
.vacancies-popup {
  .vacancies-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(74, 135, 192);
    .vacancies-popup__content {
      transform: scale(2);
      .vacancies__addition-form {
        display: grid;
        padding: 20px;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: max-content;
        margin: 0 auto;

        label {
          text-align: right;
          // vertical-align: middle;
          // display: grid;
          // place-content: center;
        }
        input {
          // width: max-content;
          text-align: center;
          width: 200px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none; // не работает в FF почему-то
          margin: 0;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        // grid-column: 1/3;
        button {
          padding: 5px;
          width: 30%;
        }
      }
    }
  }
  option {
    font-size: 26px;
  }
}
</style>