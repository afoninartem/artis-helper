<template>
  <div class="print-form">
    <!-- <button @click.prevent="print">Печать</button> -->
    <PrintShedule />
  </div>
</template>

<script>
import PrintShedule from "@/components/ServiceComponents/PrintShedule";
export default {
  components: {
    PrintShedule,
  },
  methods: {
    // print() {
    //   return window.print();
    // },
  },
};
</script>

<style lang="scss" scoped>
.print-form {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-content: center;
  width: max-content;
  margin: 0 auto;
}
</style>