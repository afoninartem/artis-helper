<template>
  <div class="drivers-filter">
    <router-link
      class="backlink"
      to="/drivers-timetracking"
    >Назад</router-link>
    <div class="forms">
      <form
        action=""
        class="position-filter"
      >
        <h3>Должность</h3>
        <p>Копируйте должность из 1С, чтобы избежать опечаток</p>
        <input type="text">
        <button @click.prevent="addPosition">Добавить должность</button>
      </form>
      <form
        action=""
        class="name-filter"
      >
        <h3>ФИО</h3>
        <p>Копируйте ФИО из 1С, чтобы избежать опечаток</p>
        <input type="text">
        <button @click.prevent="addName">Добавить сотрудника</button>
      </form>
    </div>
    <div class="filtered-lists">
      <div class="position-list">
        <h3>Игнорируются должности:</h3>
        <ul>
          <li>list item</li>
        </ul>
      </div>
      <div class="name-list">
        <h3>Игнорируются ФИО:</h3>
        <ul>
          <li>list item</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      positionInput: "",
      nameInput: "",
    };
  },
  methods: {
    addPosition() {
      if (!this.positionInput.length) return;
      if (this.exceptPositions.includes(this.positionInput)) {
        alert("Эта должность уже есть в списке исключений");
        return;
      }
      return this.$store.dispatch("addPosition", this.positionInput);
    },
    addName() {
      if (!this.nameInput.length) return;
      if (this.exceptNames.includes(this.nameInput)) {
        alert("Этот сотрудник уже есть в списке исключений");
        return;
      }
      return this.$store.dispatch("addName", this.nameInput);
    },
  },
  computed: {
    exceptPositions() {
      return this.$store.getters.getExeptPositions;
    },
    exceptNames() {
      return this.$store.getters.getExeptNames;
    },
  },
};
</script>

<style lang="scss" scoped>
.drivers-filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  .backlink {
    align-self: flex-start;
  }
  .forms {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .filtered-lists {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>