<template>
  <thead>
    <tr class="table__header">
      <th class="table__header-item">№</th>
      <th class="table__header-item">Машина</th>
      <th class="table__header-item">Салон</th>
      <!-- <th class="table__header-item">Кат. 56</th> -->
      <th class="table__header-item">Кат. 20</th>
      <th class="table__header-item">Блок.</th>
      <th class="table__header-item">Кружки</th>
      <th class="table__header-item">Упак.</th>
      <th class="table__header-item">Папки</th>
      <th class="table__header-item towels" v-if="towels">Полот</th>
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
  },
};
</script>

<style lang="scss" scoped>
 thead th {
  position: sticky;
  -webkit-position: sticky;
  inset-block-start: 0;
  -webkit-inset-block-start: 0;
}
</style>