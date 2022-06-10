<template>
  <section class="warning stop-list-warning" v-if="stoplist.length">
    <h1>Удалить из заявок материалы (согласно стоп-листу):</h1>
    <ul>
      <li class="item-container" v-for="(stop, i) in stoplist" :key="i">
        <div class="stop-list__item">
          <p>{{ stop.shop }}</p>
          <p>{{ stop.material }}</p>
          <div class="orders-list">
            <ul>
              <li v-for="(order, j) in stop.orders" :key="j">
                {{ order }}
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    stoplist() {
      return this.$store.getters.getCurrentStoppedMaterials;
    },
  },
};
</script>

<style lang="scss" scoped>
.warning {
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
    li.item-container {
      &:not(:last-child) {
        border-bottom: 1px solid #000;
      }
      .stop-list__item {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        padding: 5px;

        .orders-list {
          li {
            padding: 3px;
          }
        }
      }
    }
  }
}
</style>