<template>
  <section class="urgent-to-order" v-if="this.urgent.length">
    <h1>СРОЧНО ЗАКАЗАТЬ:</h1>
    <ul>
      <li v-for="(mat, i) in this.urgent" :key="i">
        <p>
          <span class="name">{{ mat.name }}</span
          >, остаток: <span class="left">{{ mat.left }}</span>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    urgent() {
      return this.$store.getters.getUrgentOrders;
    },
  },
};
</script>

<style lang="scss" scoped>
.urgent-to-order {
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
      p {
        margin: 0;
        .name {
          font-weight: bold;
        }
        .left {
          font-weight: bold;
          color: red;
        }
      }
    }
  }
}
</style>