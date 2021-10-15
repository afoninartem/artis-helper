<template>
  <div class="table-row" v-if="shop">
    <div class="table-row__car">{{shop.car}}</div>
    <div class="table-row__shop">{{shop.shop}}</div>
    
  </div>
</template>

<script>
export default {
  computed: {
    shop() {
      console.log(this.$store.getters.getcurrentTableRowToRender)
      return this.$store.getters.getcurrentTableRowToRender
    }
  }
}
</script>