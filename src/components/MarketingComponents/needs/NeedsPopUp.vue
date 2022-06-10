<template>
  <div class="needs-popup" v-if="popup">
    <div
      class="needs-popup__background"
      :style="{ background: popup.background }"
    >
      <div class="need-popup__edit" v-if="popup.context === `edit`">
        <EditForm />
      </div>
      <div class="needs-popup__content">
        <h1 v-if="popup.context === `createOrder`">
          Вы точно заказали {{ popup.data.name }}?
        </h1>
        <h1 v-if="popup.context === `denyRequest`">
          Вы точно отказываетесь заказывать {{ popup.data.name }}?
        </h1>
        <h1 v-if="popup.context === `gotOrder`">
          Вы точно получили на склад {{ popup.data.name }}?
        </h1>
        <h1 v-if="popup.context === `backToRequest`">
          Вы точно хотите вернуть {{ popup.data.name }} из заказов в заявки?
        </h1>
        <div class="buttons">
          <button
            v-if="popup.context === `createOrder`"
            @click.prevent="createOrder(popup.data.id)"
          >
            Да, заказ сформирован
          </button>
          <button
            v-if="popup.context === `denyRequest`"
            @click.prevent="denyRequest(popup.data.id)"
          >
            Да, убрать из списка
          </button>
          <button
            v-if="popup.context === `backToRequest`"
            @click.prevent="backToRequest(popup.data.id)"
          >
            Да, вернуть в заявки
          </button>
          <button
            v-if="popup.context === `gotOrder`"
            @click.prevent="denyRequest(popup.data.id)"
          >
            Да, спасибо
          </button>
          <button v-if="popup.context !== `edit`" @click.prevent="close">
            Нет, это ошибка
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditForm from "./EditForm.vue";
export default {
  components: {
    EditForm,
  },
  computed: {
    popup() {
      return this.$store.getters.getPopUp;
    },
  },
  methods: {
    async createOrder(id) {
      await this.$store.dispatch("createOrder", id.toString());
      await this.$store.dispatch("updateNeedsDate");
      await this.$store.dispatch("setActualNeeds");
      await this.$store.dispatch("closePopUp");
    },
    async denyRequest(id) {
      await this.$store.dispatch("deleteRequest", id.toString());
      await this.$store.dispatch("updateNeedsDate");
      await this.$store.dispatch("setActualNeeds");
      await this.$store.dispatch("closePopUp");
    },
    async backToRequest(id) {
      await this.$store.dispatch("backToRequest", id.toString());
      await this.$store.dispatch("updateNeedsDate");
      await this.$store.dispatch("setActualNeeds");
      await this.$store.dispatch("closePopUp");
    },
    async close() {
      await this.$store.dispatch("closePopUp");
    },
  },
};
</script>

<style lang="scss" scoped>

.needs-popup {
  .needs-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    .needs-popup__content {
      display: flex;
      flex-direction: column;
      gap: 50px;
      .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        button {
          padding: 20px;
          font-size: 24px;
          letter-spacing: 2px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>