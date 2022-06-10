<template>
  <thead>
    <tr class="stock-table__header">
      <th class="stock-table__header-item">№</th>
      <th class="stock-table__header-item">Салон</th>
      <th class="stock-table__header-item">Плакат</th>
      <th class="stock-table__header-item">VIP</th>
      <th class="stock-table__header-item">Пакет</th>
      <th class="stock-table__header-item">Кружка</th>
      <th class="stock-table__header-item">Упак.</th>
      <th class="stock-table__header-item">Вино</th>
      <th class="stock-table__header-item">Набор</th>
      <th class="stock-table__header-item">Развертка</th>
      <th class="stock-table__header-item">5гр</th>
      <th class="stock-table__header-item">Карамель</th>
      <th class="stock-table__header-item">Листовка</th>
      <th class="stock-table__header-item">Зеленый</th>
      <th class="stock-table__header-item">Серый</th>
      <th class="stock-table__header-item">Зажим</th>
      <th class="stock-table__header-item">Палочка</th>
      <th class="stock-table__header-item" v-if="extraColumns.adult">
        Взрослый
      </th>
      <th class="stock-table__header-item" v-if="extraColumns.male">
        Мужской
        </th>
      <th class="stock-table__header-item" v-if="extraColumns.female">
        Женский
      </th>
      <th class="stock-table__header-item" v-if="extraColumns.kids">Детский</th>
      <th class="stock-table__header-item" v-if="extraColumns.papers">
        Газета
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  computed: {
    extraColumns() {
      return this.$store.getters.getTableColumns.length
        ? {
            adult: this.$store.getters.getTableColumns.includes("generalAdult"),
            male:
              this.$store.getters.getTableColumns.includes("separateAdult") ||
              this.$store.getters.getTableColumns.includes("maleAdult"),
            female:
              this.$store.getters.getTableColumns.includes("separateAdult") ||
              this.$store.getters.getTableColumns.includes("femaleAdult"),
            kids: this.$store.getters.getTableColumns.includes("kidsGifts"),
            papers: this.$store.getters.getTableColumns.includes("papers"),
          }
        : false;
    },
  },
};
</script>

<style lang="scss" scoped>
// thead {
//   tr {
//     th {
//       border: 1px solid black !important;
//     }
//   }
// }
</style>