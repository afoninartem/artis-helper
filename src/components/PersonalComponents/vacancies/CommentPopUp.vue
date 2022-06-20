<template>
  <div class="comment-popup" v-if="show">
    <div class="comment-popup__background">
      <div class="comment-popup__content" v-if="object">
        <h2 v-if="object.comment">Старый комментарий:</h2>
        <h2 v-if="!object.comment">Комментарий отсутствует</h2>
        <p v-if="object.comment">{{ object.comment }}</p>
        <h2>Новый комментарий:</h2>
        <textarea
          name="new"
          id="new"
          cols="50"
          rows="10"
          v-model="newComment"
        ></textarea>
        <div class="btn-block">
          <button @click.prevent="updateComment">Сохранить комментарий</button>
          <button @click.prevent="close">Отмена</button>
          <button @click.prevent="deleteObject" v-if="showDeleteBtn">
            Удалить кандидата
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newComment: null,
      commentType: null,
      // object: null,

      // candidateID: false,
      // vacancyID: false
    };
  },
  computed: {
    show() {
      return this.$store.getters.getChangeCommentPopupVisibility;
    },
    showDeleteBtn() {
      return this.newComment?.toLowerCase() === `удалить`;
    },
    candidate() {
      const id = this.$store.getters.getCurrentCandidateID;
      const candidates = this.$store.getters.getActualStates.candidates;
      return candidates.filter((candidate) => candidate.candidateID === id)[0];
    },
    vacancy() {
      const id = this.$store.getters.getCurrentVacancyID;
      const vacancies = this.$store.getters.getActualStates.vacancies;
      return vacancies.filter((vacancy) => vacancy.id === id)[0];
    },
    object() {
      const commentType = this.$store.getters.getCommentType;
      this.setCommentType(commentType);
      return commentType === `candidate`
        ? this.candidate
        : commentType === `vacancy`
        ? this.vacancy
        : null;
    },
  },
  methods: {
    setCommentType(str) {
      this.commentType = str;
    },
    async close() {
      this.newComment = null;
      return await this.$store.dispatch("closeChangeCommentPopupVisibility");
    },
    async updateComment() {
      const id = this.$store.getters.getCurrentCandidateID;
      await this.$store.dispatch("changeCandidateComment", {
        id,
        comment: this.newComment,
      });
      // await this.$store.dispatch("updateVacanciesDate");
      // await this.$store.dispatch("setActualVacancies");
      await this.$store.dispatch("updateCandidatesDate");
      await this.$store.dispatch("setActualCandidates");
      return await this.$store.dispatch("closeChangeCommentPopupVisibility");
    },
    async deleteObject() {
      const id = this.$store.getters.getCurrentCandidateID;
      await this.$store.dispatch("closeChangeCommentPopupVisibility");
      await this.$store.dispatch("deleteCandidate", id);
      await this.$store.dispatch("updateCandidatesDate");
      await this.$store.dispatch("setActualCandidates");
    },
  },
};
</script>


<style lang="scss">
.comment-popup {
  .comment-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(71, 135, 151);
    .comment-popup__content {
      transform: scale(1.2);
      p {
        padding: 10px;
        text-align: center;
        background: #fff;
      }
    }
  }
}
</style>