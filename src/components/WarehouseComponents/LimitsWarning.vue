<template>
  <div class="warning limits-warning" v-if="outOfLimits.length">
    <h1>Превышены лимиты на отгрузку</h1>
    <ul>
      <li v-for="(item, i) in outOfLimits" :key="i">
        <p>
          <span class="shop">{{ item.shop }}</span>
          <span class="material">{{ item.name }}</span>
          <span class="quan">{{ item.quan }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    outOfLimits() {
      return this.$store.getters.getOutOfLimits;
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
  padding: 15px 15px;
  // h1 {
  //   // padding-top: 20px;
  // }
  ul {
    list-style: none;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    li {
      padding: 5px;
      display: flex;
      border: 1px solid #000;
      p {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 16px;
        .shop {
          font-weight: bold;
        }
        .quan {
          color: red;
          font-weight: bold;
        }
      }
    }
  }
}
</style>