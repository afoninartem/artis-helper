<template>
  <div class="shop-popup" v-if="show">
    <div class="shop-popup__background">
      <div class="shop-popup__content">
        <ul>
          <li v-for="(param, p) in params" :key="`param-${p}`">
            <label :for="param">{{ param }}</label>
            <input type="text" :placeholder="shop[param]"  />
          </li>
        </ul>
        <div class="btn-block">
          <button>Save</button>
          <button @click.prevent="closeShopPopup">Exit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentShopData: null
    }
  },
  methods: {
    async closeShopPopup() {
      return await this.$store.dispatch("closeShopPopup");
    },
  },
  computed: {
    show() {
      return this.$store.getters.getShopPopupVisibility;
    },
    params() {
      return this.$store.getters.getTableOrder;
    },
    shop() {
      const shop = this.$store.getters.getCurrentShop;
      const shops = this.$store.getters.getActualStates.shops;
      return shop && shops ? shops.filter((s) => s.name === shop)[0] : null;
    },
  },
  mounted: async function() {
    this.currentShopData = this.shop
  }
};
</script>


<style lang="scss">
.shop-popup {
  .shop-popup__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    background: rgb(71, 135, 151);
    .shop-popup__content {
      transform: scale(1.5);
      width: 65%;
      ul {
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;

        li {
          // padding: 10px;
          display: grid;
          // grid-template-columns: 1fr 1.5fr;
          align-items: center;
          gap: 2px;
          border: 1px solid #ccc;
          border-radius: 5px;

          label {
            padding: 2px;
            text-align: left;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>