<template>
  <div class="shipment-table" v-if="shipment">
    <div class="page">
      <TableInfo />
      <TableHeader />
      {{ checkHeight }}
    </div>
  </div>
</template>

<script>
import TableInfo from "@/components/WarehouseComponents/TableInfo";
import TableHeader from "@/components/WarehouseComponents/TableHeader";
export default {
  components: {
    TableInfo,
    TableHeader,
  },
  data() {
    return {
      maxHeight: 1000,
      // page: `<div class="page"><TableInfo/>
      // <TableHeader/></div>`,
      // firstPage: null,
      // container: null,
    };
  },
  created: function () {
    this.$nextTick(() => {
      const container = document.querySelector(".shipment-table");
      console.log(container);
      // console.log(this.shipment);
      // console.log(this.TableInfo);
      if (this.shipment) {
        this.shipment.forEach((el, i) => console.log(el, i));
      }
    });
  },
  computed: {
    shipment() {
      const allShipments = this.$store.getters.getTableSwitcherState;
      const activeRegion =
        allShipments.filter((el) => el.active).length === 1
          ? allShipments.filter((el) => el.active)[0].region
          : null;
      const shipment = this.$store.getters.getSortedShipment;
      return shipment[activeRegion];
    },
    checkHeight() {
      let result = null;
      this.$nextTick(() => {
        const printTable = document.querySelector(".shipment-table");
        result = printTable ? printTable.offsetHeight : 0;
      });
      return result;
    },
    // fillTable() {
    //   console.log(this.container);
    //   return null;
    // },
  },
};
</script>