<template>
  <div class="candidate-popup" v-if="show">
    <div class="candidate-popup__background">
      <div class="candidate-popup__content">
        <form action="" class="candidate__addition-form">
          <label for="name">ФИО:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="ФИО"
            v-model.trim="newCandidate.name"
            required
          />
          <label for="datetime">Дата и время:</label>
          <input
            type="datetime-local"
            name="datetime"
            id="datetime"
            v-model.trim="newCandidate.datetime"
            required
          />
          <label for="comment">Комментарий:</label>
          <textarea
            rows="5"
            cols="33"
            name="comment"
            id="comment"
            placeholder="Тут можно оставить содержательный комментарий по поводу кандидата"
            v-model.trim="newCandidate.comment"
          />
        </form>
        <div class="buttons">
          <button @click.prevent="addCandidate">Добавить кандидата</button>
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
      newCandidate: {
        name: "",
        datetime: "",
        comment: "",
        status: "Собеседование",
      },
    };
  },
  computed: {
    show() {
      return this.$store.getters.getAddCandidatePopupVisibility;
    },
  },
  methods: {
    async addCandidate() {
      await this.$store.dispatch("addCandidate", this.newCandidate);
      await this.$store.dispatch("updateCandidatesDate");
      await this.$store.dispatch("setActualCandidates");
      // await this.$store.dispatch("updateVacanciesDate");
      // await this.$store.dispatch("setActualVacancies");
      return await this.$store.dispatch("closeAddCandidatePopup");
    },
    async closePopup() {
      await this.$store.dispatch("closeAddCandidatePopup");
    },
  },
};
</script>

<style lang="scss">
.candidate-popup {
  .candidate-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(71, 135, 151);
    .candidate-popup__content {
      transform: scale(2);
      .candidate__addition-form {
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
    }
  }
}
</style>