<template>
  <div class="dinners">
    <h1>Учет обедов</h1>
    <div class="dinners__inputs">
      <AddEmployeeDetails v-if="!detailsIsLoaded" />
      <AddSenesysReport v-if="detailsIsLoaded && !senesysLoaded" />
    </div>
    <DinnersResult />
  </div>
</template>

<script>
import AddSenesysReport from "../../components/MaintenanceComponents/AddSenesysReport.vue";
import AddEmployeeDetails from "../../components/MaintenanceComponents/AddEmployeeDetails.vue";
import DinnersResult from "../../components/MaintenanceComponents/DinnersResult.vue";
export default {
  components: {
    AddSenesysReport,
    AddEmployeeDetails,
    DinnersResult,
  },
  computed: {
    detailsIsLoaded() {
      return this.$store.getters.getEmployeesDetails;
    },
    senesysLoaded() {
      return this.$store.getters.getHandledSenesys;
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualDinners");
  },
};
</script>