<template>
  <section class="warning" v-if="showWarning.show">
    <h1>ИСПРАВИТЬ ОСТАТКИ:</h1>
    <ul>
      <li v-for="mat in showWarning.array" :key="mat.name">
        <b>{{ mat.name }}</b
        >, остаток: <b style="color: red">{{ mat.left }}</b>
      </li>
    </ul>
  </section>
</template>

<script>

export default {
  computed: {
    showWarning() {
      const invalidLeftovers = this.$store.state.leftoversHandler.invalidLeftovers;
      return {
        show: invalidLeftovers.length > 0,
        array: invalidLeftovers,
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
      padding: 5px
    }
  }
}
</style>