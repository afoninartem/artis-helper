<template>
  <section class="warning" v-if="showWarning.show">
    <h1>ИСПРАВИТЬ КОЛИЧЕСТВО:</h1>
    <ul>
      <li v-for="mat in showWarning.array" :key="mat.name">
        <b>{{ mat.name }}</b
        >, количество: <b style="color: red">{{ mat.quan }}</b
        >, салон: <b>{{ mat.shopName }}</b>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    showWarning() {
      const invalidQuans = this.$store.state.shipmentsHandler.invalidQuans;
      return {
        show: invalidQuans.length > 0,
        array: invalidQuans,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.warning {
  // position: absolute;
  width: 80%;
  top: 0;
  left: 0;
  background: #97999b;
  padding-bottom: 20px;
  margin: 0 auto;
  h1 {
    padding-top: 20px;
  }
  ul {
    list-style: none;
    li {
      padding: 5px;
    }
  }
}
</style>