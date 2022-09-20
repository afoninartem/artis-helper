<template>
  <div class="print-form">
    <PrintShedule />
  </div>
</template>

<script>
import PrintShedule from "@/components/ServiceComponents/PrintShedule";
export default {
  components: {
    PrintShedule,
  },
};
</script>

<style lang="scss" scoped>
.print-form {
  display: flex;
  justify-content: center;
}
</style>