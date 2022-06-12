<template>
  <div class="shops">
    <h1>Список ФС</h1>
    <table v-if="tableOrder && shops">
      <thead>
        <tr>
          <th v-for="(head, h) in tableOrder" :key="`head-${h}`">
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(shop, s) in shops"
          :key="`shop-${s}`"
          @mouseover="setSelectedStyle"
          @mouseout="unsetSelectedStyle"
          @click.prevent="openShopPopup"
        >
          <td v-for="(data, d) in tableOrder" :key="`shop-data-${d}`">
            {{ shop[data] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!tableOrder || !shops">Загружаем контент</div>
    <ShopPopup />
  </div>
</template>

<script>
import ShopPopup from "@/components/AdminComponents/ShopPopup";
export default {
  components: { ShopPopup },
  methods: {
    setSelectedStyle(event) {
      const shop = event.target.parentElement;
      shop.childNodes.forEach((c) => {
        c.classList.add("selected-td");
      });
    },
    unsetSelectedStyle(event) {
      const shop = event.target.parentElement;
      shop.childNodes.forEach((c) => {
        c.classList.remove("selected-td");
      });
    },
    async openShopPopup(event) {
      const shopName = event.target.parentElement.firstChild.innerText;
      return await this.$store.dispatch("openShopPopup", shopName);
    },
  },
  computed: {
    shops() {
      return this.$store.getters.getActualStates.shops;
    },
    tableOrder() {
      return this.$store.getters.getTableOrder;
    },
  },
  mounted: async function () {
    this.$store.dispatch("setActualShops");
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.selected-td {
  background: rgba(118, 239, 164, 0.612);
  color: rgb(96, 92, 92);
  cursor: pointer;
}
</style>