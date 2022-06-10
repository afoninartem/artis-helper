<template>
  <section class="orders">
    <h1>Проверка добавленных и отменённых заявок</h1>
    <div class="orders-changes" :style="gridTemplateColumns.gtc">
      <div class="msc-add" v-if="changes.regular.added.length">
        <h3>На МСК + РЕГ добавили:</h3>
        <ul>
          <li
            v-for="(add, i) in changes.regular.added"
            :key="i"
            style="color: green"
          >
            {{ add }}
          </li>
        </ul>
      </div>
      <div class="msc-del" v-if="changes.regular.deleted.length">
        <h3>Из МСК + РЕГ удалили:</h3>
        <ul>
          <li
            style="color: red"
            v-for="(del, i) in changes.regular.deleted"
            :key="i"
          >
            {{ del }}
          </li>
        </ul>
      </div>
      <div class="spbnn-add" v-if="changes.spbnn.added.length">
        <h3>На СПБ + НН добавили:</h3>
        <ul>
          <li
            v-for="(add, i) in changes.spbnn.added"
            :key="i"
            style="color: green"
          >
            {{ add }}
          </li>
        </ul>
      </div>
      <div class="spbnn-del" v-if="changes.spbnn.deleted.length">
        <h3>Из СПБ + НН удалили:</h3>
        <ul>
          <li
            style="color: red"
            v-for="(del, i) in changes.spbnn.deleted"
            :key="i"
          >
            {{ del }}
          </li>
        </ul>
      </div>
      <p v-if="gridTemplateColumns.columns === 1">Список заявок без изменений</p>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    changes() {
      return this.$store.getters.getChanges;
    },
    gridTemplateColumns() {
      let columns = 1;
      this.changes.regular.added.length
        ? (columns += 1)
        : this.changes.regular.deleted.length
        ? (columns += 1)
        : this.changes.spbnn.added.length
        ? (columns += 1)
        : this.changes.spbnn.deleted.length
        ? (columns += 1)
        : null;
      console.log(columns);
      return { gtc: `gridTemplateColumns: repeat(${columns}, 1fr)`, columns };
    },
  },
};
</script>

<style lang="scss" scoped>
.orders {
  .orders-changes {
    display: grid;
    // grid-template-columns: repeat(4, 1fr);
    // align-items: center;
    ul {
      list-style: none;
      li {
        padding: 3px;
      }
    }
  }
}
</style>