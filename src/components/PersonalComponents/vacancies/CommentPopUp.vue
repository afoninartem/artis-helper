<template>
  <div class="comment-popup" v-if="show">
    <div class="comment-popup__background">
      <div class="comment-popup__content">
        <h2 v-if="candidate.comment">Старый комментарий:</h2>
        <h2 v-if="!candidate.comment">Комментарий отсутствует</h2>
        <p v-if="candidate.comment">{{ candidate.comment }}</p>
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
          <button @click.prevent="deleteCandidate" v-if="showDeleteBtn">
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
      candidateID: false,
      vacancyID: false
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
  },
  methods: {
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
    async deleteCandidate() {
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