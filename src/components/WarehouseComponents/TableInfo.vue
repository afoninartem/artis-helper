<template>
  <section class="table-info" v-if="tableInfo.title">
    <p>Отгрузка на {{ tableInfo.shipmentDate }}.</p>
    <p>Сборка {{ tableInfo.today }}.</p>
    <p>Начало работы: {{ tableInfo.start }}</p>
    <p style="font-weight: bold">{{ tableInfo.title }}</p>
    <p v-if="tableInfo.title.includes(`МСК`)">
      Заявок: {{ tableInfo.numberOfRegularOrders }}
    </p>
    <p v-if="tableInfo.title.includes(`МСК`)">
      Салонов: {{ tableInfo.numberOfRegularShops }}
    </p>
    <p v-if="tableInfo.title.includes(`САНКТ`)">
      Заявок: {{ tableInfo.numberOfSpbOrders }}
    </p>
    <p v-if="tableInfo.title.includes(`САНКТ`)">
      Салонов: {{ tableInfo.numberOfSpbShops }}
    </p>
    <p v-if="tableInfo.title.includes(`НИЖНИЙ`)">
      Заявок: {{ tableInfo.numberOfNnOrders }}
    </p>
    <p v-if="tableInfo.title.includes(`НИЖНИЙ`)">
      Салонов: {{ tableInfo.numberOfNnShops }}
    </p>
    <p v-if="tableInfo.title.includes(`СПБ + НН`)">
      Заявок: {{ tableInfo.numberOfSpbNnOrders }}
    </p>
    <p v-if="tableInfo.title.includes(`СПБ + НН`)">
      Салонов: {{ tableInfo.numberOfSpbNnShops }}
    </p>
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
      const infoShipmentTitle = {
        msc: "МСК + РЕГ, без СПБ и НН",
        spb: "САНКТ-ПЕТЕРБУРГ",
        nn: "НИЖНИЙ НОВГОРОД",
        spbnn: "СПБ + НН",
      };
      let infoTitle = null;
      if (infoShipmentTitle[activeRegion])
        infoTitle = infoShipmentTitle[activeRegion];
      const info = this.$store.getters.getTableInfo;
      info.title = infoTitle;
      return info;
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

