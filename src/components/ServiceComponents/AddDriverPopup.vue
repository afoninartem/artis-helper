<template>
  <div class="add-driver-popup">
    <div class="add-driver-popup__background">
      <div class="add-driver-popup__content">
        <h1>Добавить нового сотрудника</h1>
        <p>Желательно скопировать ФИО из 1С, чтобы избежать ошибок.</p>
        <form action="">
          <input type="text" name="name" id="name" v-model="newDriver.name" />
            <select name="" id=""></select>
          <button @click.prevent="add">Добавить сотрудника</button>
          <button @click.prevent="close">Закрыть</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newDriver: {
        name: "",
        position: "",
      },
    };
  },
  methods: {
    async add() {
      if (!this.name.trim() || !this.position.trim()) return;
      return await this.$store.dispatch("addDriverToCatalog", {
        name: this.name,
        position: this.position,
      });
    },
    async close() {
      return await this.$store.dispatch("closeAddDriverPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getAddDriverPopupVisibility;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-driver-popup {
  user-select: none;
  .add-driver-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(63, 145, 97);
    .add-driver-popup__content {
      // transform: scale(1.2);
      display: grid;
      .actual-crew {
        ul {
          li {
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .add-driver__form__form {
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
      .close-btn {
        width: 20%;
        margin: 0 auto;
      }
      ul {
        list-style: none;
        // margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
        li {
          padding: 2px;
        }
        .tip {
          border: 1px solid #000;
          transform: scale(0.7);
          cursor: pointer;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        // grid-column: 1/3;
        button {
          padding: 5px;
          width: 15%;
        }
      }
    }
  }
}
</style>