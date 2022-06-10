<template>
  <section class="table-info" v-if="tableInfo">
    <p>Отгрузка на {{ tableInfo.shipmentDate }}</p>
    <p>Сборка {{ tableInfo.todayDate }}</p>
    <p>Начало работы {{ tableInfo.timeStartWork }}</p>
    <p style="font-weight: bold">{{ tableInfo.actualTitle }}</p>
    <p>Заявок: {{tableInfo.actualOrders}}</p>
    <p>Салонов: {{tableInfo.actualShops}}</p>
  </section>
</template>

<script>
export default {
  computed: {
    tableInfo() {
      const activeRegion =
        this.$store.getters.getTableSwitcherState.filter((el) => el.active)
          .length > 0
          ? this.$store.getters.getTableSwitcherState.filter(
              (el) => el.active
            )[0].region
          : null;
      const tableInfo = this.$store.getters.getTableInfo;
      tableInfo.actualTitle = tableInfo[activeRegion].title;
      tableInfo.actualOrders = tableInfo[activeRegion].numberOfOrders;
      tableInfo.actualShops = tableInfo[activeRegion].numberOfShops;
      return tableInfo;
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  width: 90%;
  margin: 0 auto;
}
</style>

