<template>
  <div class="calendar">
    <!-- {{ this.date }}
    {{this.daySpec(this.date.monthNumber, this.date.year)}} -->
    <table>
      <thead>
        <tr>
          <th v-for="weekday, w in this.daySpec(this.date.monthNumber, this.date.year)" :key="w">
           {{weekday.weekday}}
          </th>
        </tr>
        <tr>
          <th v-for="monthday, m in this.daySpec(this.date.monthNumber, this.date.year)" :key="m">
            {{monthday.dayOfMonth}}
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: {
        dayOfMonth: null,
        dayOfWeek: null,
        monthNumber: null,
        monthTitle: null,
        year: null,
      },
    };
  },
  methods: {
    numberOfDays(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },
    daySpec(month, year) {
      const lastDay = this.numberOfDays(month, year);
      // console.log(lastDay)
      const result = [];
      for (let day = 1; day <= lastDay; day += 1) {
        result.push({
          weekday: new Date(year, month, day).toLocaleString("default", {
            weekday: "short",
          }),
          dayOfMonth: new Date(year, month, day).getDate()
        });
      }
      return result
    },
  },
  computed: {

  },
  mounted: async function () {
    this.date.dayOfMonth = new Date().getDate();
    this.date.dayOfWeek = new Date().toLocaleString("default", {
      weekday: "short",
    });
    this.date.monthNumber = new Date().getMonth();
    this.date.monthTitle = new Date()
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    this.date.year = new Date().getFullYear();
  },
};
</script>

<style lang="scss">
@import "@/scss/personalTable.scss";
@include personal-table;
</style>