<template>
  <div class="edit-form">
    <h1>Редактировать:</h1>
    <form action="" class="add-request">
      <label for="name">Материал:</label>
      <input
        type="text"
        name="name"
        id="name"
        :value="requestToEdit.name"
        ref="name"
      />
      <label for="quantity">Количество:</label>
      <input
        type="text"
        name="quantity"
        id="quantity"
        :value="this.requestToEdit.quantity"
        ref="quantity"
      />
      <label for="reserve">Запас до:</label>
      <input
        type="date"
        name="reserve"
        id="reserve"
        :value="this.requestToEdit.reserve"
        ref="reserve"
      />
      <label for="urgent">Срочно?</label>
      <input
        type="checkbox"
        name="urgent"
        id="urgent"
        :value="this.requestToEdit.urgent"
        ref="urgent"
      />
      <div class="buttons">
        <button @click.prevent="editRequest">Сохранить изменения</button>
        <button @click.prevent="close">Отменить изменения</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestToEdit: null,
    };
  },
  beforeMount: function () {
    this.requestToEdit = this.$store.getters.getPopUp.data;
  },
  methods: {
    async editRequest() {
      const editedData = {
        id: this.requestToEdit.id.toString(),
        name: this.$refs.name.value,
        quantity: this.$refs.quantity.value,
        reserve: this.$refs.reserve.value,
        urgent: this.$refs.urgent.value,
      };
      await this.$store.dispatch("editRequest", editedData);
      await this.$store.dispatch("updateNeedsDate");
      await this.$store.dispatch("setActualNeeds");
      return await this.$store.dispatch("closePopUp");
    },
    async close() {
      return await this.$store.dispatch("closePopUp");
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-form {
  transform: scale(2);
  .add-request {
    display: grid;
    padding: 20px;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: max-content;
    margin: 0 auto;

    label {
      text-align: right;
    }
    input {
      text-align: center;
      width: 150px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none; // не работает в FF почему-то
      margin: 0;
    }

    .buttons {
      grid-column: 1/3;
      display: flex;
      justify-content: space-between;
      button {
        width: 100%;
        padding: 5px;
        border: none;
        transition: width 0.5s ease-in-out 100ms,
          background 0.5s ease-in-out 100ms;
        font-weight: bold;
        cursor: pointer;
        &:first-child {
          &:hover {
            width: 105%;
            background: rgba(50, 112, 194, 0.5);
          }
        }
        &:last-child {
          &:hover {
            width: 105%;
            background: rgba(165, 72, 77, 0.5);
          }
        }
      }
    }
  }
}
</style>