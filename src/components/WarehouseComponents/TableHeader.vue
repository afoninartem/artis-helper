<template>
  <!-- <div class="table__header">
    <div class="table__header-item">№</div>
    <div class="table__header-item">Машина</div>
    <div class="table__header-item">Салон</div>
    <div class="table__header-item">Кат. 80</div>
    <div class="table__header-item">Кат. 20</div>
    <div class="table__header-item">Блок.</div>
    <div class="table__header-item">Кружки</div>
    <div class="table__header-item">Упак.</div>
    <div class="table__header-item">Папки</div>
    <div class="table__header-item" v-if="towels">Полот</div>
    <div class="table__header-item">Шамп.</div>
    <div class="table__header-item">Другое</div>
    <div class="table__header-item">П/П</div>
    <div class="table__header-item">Заявка</div>
  </div> -->
  <thead>
    <tr class="table__header">
      <th class="table__header-item">№</th>
      <th class="table__header-item">Машина</th>
      <th class="table__header-item">Салон</th>
      <th class="table__header-item">Кат. 80</th>
      <th class="table__header-item">Кат. 20</th>
      <th class="table__header-item">Блок.</th>
      <th class="table__header-item">Кружки</th>
      <th class="table__header-item">Упак.</th>
      <th class="table__header-item">Папки</th>
      <th class="table__header-item" v-if="towels">Полот</th>
      <th class="table__header-item">Шамп.</th>
      <th class="table__header-item">Другое</th>
      <th class="table__header-item">П/П</th>
      <th class="table__header-item">Заявка</th>
    </tr>
  </thead>
</template>

<script>
export default {
  computed: {
    towels() {
      return this.$store.getters.getTowelsInfo;
    },
    templateColumns() {
      return this.$store.getters.getTowelsInfo
        ? "gridTemplateColumns: repeat(14, 1fr)"
        : "gridTemplateColumns: repeat(13, 1fr)";
    },
  },
};
</script>

<style lang="scss" scoped>
// .table__header {
//   display: grid;
//   width: max-content;
//   .table__header-item {
//     border: 1px solid black;
//   }
// }
</style>