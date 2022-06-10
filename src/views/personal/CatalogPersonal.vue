<template>
  <div class="catalog__personal">
    <h1>Справочник отдела персонала</h1>
    <form action="">
      <label for="select">Выберите тип новой записи</label>
      <select name="select" id="select" v-model="select">
        <option v-for="(option, o) in optionsList" :key="o">
          {{ option }}
        </option>
      </select>
      <input
        type="text"
        name="name"
        id="name"
        v-if="select === `Руководитель`"
        placeholder="Введите ФИО руководителя"
        v-model="title"
      />
      <input
        type="text"
        name="department"
        id="department"
        v-if="select === `Подразделение`"
        placeholder="Введите название подразделения"
        v-model="title"
      />
      <button type="submit" @click.prevent="addItem" v-if="select">
        Добавить в справочник
      </button>
    </form>
    <div class="content">
      <div class="supervisors">
        <h3>Руководители</h3>
        <ul v-if="commonCatalogPersonal">
          <li v-for="(sup, s) in supervisorsList" :key="s">
            {{ sup.title }}
            <div
              class="remove-btn"
              @click.prevent="removeItem(sup.id.toString())"
            >
              <RemoveSupervisor />
            </div>
          </li>
        </ul>
      </div>
      <div class="departments">
        <h3>Подразделения</h3>
        <ul v-if="commonCatalogPersonal">
          <li v-for="(dept, d) in departmentsList" :key="d">
            {{ dept.title }}
                        <div
              class="remove-btn"
              @click.prevent="removeItem(dept.id.toString())"
            >
              <RemoveSupervisor />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import RemoveSupervisor from "@/components/PersonalComponents/vacancies/RemoveSupervisor";
export default {
  components: {
    RemoveSupervisor,
  },
  data() {
    return {
      optionsList: ["Руководитель", "Подразделение"],
      select: "",
      title: "",
    };
  },
  computed: {
    commonCatalogPersonal() {
      return this.$store.getters.getActualStates.catalogPersonal;
    },
    supervisorsList() {
      return this.commonCatalogPersonal.filter(
        (item) => item.type === "Руководитель"
      );
    },
    departmentsList() {
      return this.commonCatalogPersonal.filter(
        (item) => item.type === "Подразделение"
      );
    },
  },
  methods: {
    async addItem() {
      await this.$store.dispatch("addCatalogPersonalItem", {
        title: this.title,
        type: this.select,
        id: Date.now().toString(),
      });
      this.select = "";
      await this.$store.dispatch("updateActualCatalogPersonal");
      return await this.$store.dispatch("setActualCatalogPersonal");
    },
    async removeItem(id) {
      await this.$store.dispatch("removeCatalogPersonalItem", id);
      await this.$store.dispatch("updateActualCatalogPersonal");
      return await this.$store.dispatch("setActualCatalogPersonal");
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualCatalogPersonal");
  },
};
</script>

<style lang="scss" scoped>
.catalog__personal {
  form {
    width: 30%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    input,
    button {
      grid-column: span 2;
      &::placeholder {
        letter-spacing: 3px;
        text-align: center;
      }
    }
  }
  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  div {
    margin: 0 auto;
    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 15px;
      li {
        border: 1px solid #ccc;
        border-radius: 5px;
        // width: max-content;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        font-size: 24px;
        &:last-child {
          cursor: pointer;
        }
      }
    }
  }
}
</style>