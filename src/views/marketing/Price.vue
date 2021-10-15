<template>
  <section class="price">
    <AddPriceItemsFromXLS />
    <AddDetailsByName />
  </section>
</template>

<script>
import AddDetailsByName from "@/components/MarketingComponents/price/AddDetailsByName";
import AddPriceItemsFromXLS from "@/components/MarketingComponents/price/AddPriceItemsFromXLS";
export default {
  components: {
    AddDetailsByName,
    AddPriceItemsFromXLS,
  },
};
</script>

<style lang="scss" scoped>
</style>