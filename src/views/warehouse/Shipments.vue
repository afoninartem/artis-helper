<template>
  <section class="shipments">
    <h1>Формирование отгрузочных листов</h1>
    <AddLeftovers v-if="!leftoversAreValid" />
    <AddShipments v-if="leftoversAreValid" />
    <div
      class="btn-block"
      v-if="
        (tableInfo.numberOfRegularShops > 0 ||
          tableInfo.numberOfSpbNnShops > 0) &&
        noInvalidQuans
      "
    >
      <button
        v-if="tableInfo.numberOfRegularShops > 0"
        @click="sortByTerms(`msc`)"
      >
        МСК + РЕГ, без СПБ и НН
      </button>
      <button v-if="tableInfo.numberOfSpbShops > 0" @click="sortByTerms(`spb`)">
        САНКТ-ПЕТЕРБУРГ
      </button>
      <button v-if="tableInfo.numberOfNnShops > 0" @click="sortByTerms(`nn`)">
        НИЖНИЙ НОВГОРОД
      </button>
      <button
        v-if="tableInfo.numberOfSpbShops > 0 && tableInfo.numberOfNnShops > 0"
        @click="sortByTerms(`spbnn`)"
      >
        СПБ + НН
      </button>
      <button @click="print">Print</button>
    </div>
    <div class="print-area">
      <!-- <div class="page" v-for="(page, i) in this.pages" :key="i">
        {{ page }}
      </div> -->
      <ShipmentTableHTMLTABLE />
    </div>
    <div class="warning-container">
      <LeftoversWarning />
      <OverrunWarning />
      <QuantityWarning />
    </div>
  </section>
</template>

<script>
import AddLeftovers from "@/components/WarehouseComponents/AddLeftovers";
import AddShipments from "@/components/WarehouseComponents/AddShipments";
import LeftoversWarning from "@/components/WarehouseComponents/LeftoversWarning";
import OverrunWarning from "@/components/WarehouseComponents/OverrunWarning";
import QuantityWarning from "@/components/WarehouseComponents/QuantityWarning";
import ShipmentTableHTMLTABLE from "@/components/WarehouseComponents/ShipmentTableHTMLTABLE";
// import ShipmentTable from "@/components/WarehouseComponents/ShipmentTable";

import { db } from "../../main";
import { mapGetters } from "vuex";
export default {
  components: {
    AddLeftovers,
    AddShipments,
    LeftoversWarning,
    OverrunWarning,
    QuantityWarning,
    ShipmentTableHTMLTABLE,
    // ShipmentTable,
  },
  data() {
    return {
      // pages: [this.blankPage],
      fullTableBody: ``,
      blankPage: `<div class="page"></div>`,
      tableHeader: ``,
    };
  },
  methods: {
    print() {
      return window.print();
    },
    async sortByTerms(payload) {
      await this.$store.dispatch("switchTable", payload);
      await this.$store.dispatch("createTable", payload);
      document.querySelector(".print-area").innerHTML = "";
      this.$nextTick(() => {
        this.lastComputedPage.innerHTML += this.tableHeaderFromVuex;
        console.log(this.lastComputedPage);
        this.tableBody.forEach((row) => {
          this.lastComputedPage.innerHTML += row;
          //check height
        });
      });
    },
    async handleShipments() {
      return await this.$store.dispatch("shipmentHandler");
    },
  },
  watch: {
    rawShipment: function (newRawShipment) {
      //delete arg?
      console.log(newRawShipment);
      this.handleShipments();
    },
  },
  computed: {
    pages() {
      const pages = document.querySelector(".print-area");

      return pages;
    },
    lastComputedPage() {
      const pages = document.querySelectorAll(".page");
      const lastPage = pages[pages.length - 1];
      return lastPage;
    },
    towels() {
      return this.$store.getters.getTowelsInfo;
    },
    gtc() {
      return this.towels ? 14 : 13;
    },
    leftoversAreValid() {
      return this.$store.getters.getLeftoversValidation;
    },
    ...mapGetters({
      rawShipment: "getRawShipment",
    }),
    tableInfo() {
      return this.$store.getters.getTableInfo;
    },
    noInvalidQuans() {
      return this.$store.getters.getInvalidQuans.length === 0;
    },
    // shipment() {
    //   const allShipments = this.$store.getters.getTableSwitcherState;
    //   const activeRegion =
    //     allShipments.filter((el) => el.active).length === 1
    //       ? allShipments.filter((el) => el.active)[0].region
    //       : null;
    //   const shipment = this.$store.getters.getSortedShipment;
    //   return shipment[activeRegion];
    // },
    // tableHeaderFromVuex() {
    //   return this.$store.getters.getTableHeader;
    // },
    // tableBody() {
    //   return this.$store.getters.getTableBody;
    // },
  },
  created: async function () {
    const date = new Date();
    const month =
      date.getMonth() + 1 > 9
        ? +date.getMonth() + 1
        : "0" + (date.getMonth() + 1);

    const today = `${
      date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    }.${month}.${date.getFullYear()}`;

    const time = `${
      date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
    }:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

    this.$store.commit("setTableInfoDataIntoState", { today, time });

    //get shops info from DB
    let shops = [];
    let shopsLastUpdateDB;
    await db
      .collection("dbUpdates")
      .doc("shops")
      .get()
      .then((querySnapshot) => {
        shopsLastUpdateDB = querySnapshot.data().lastUpdate;
      });

    const shopsLastUpdateLS = localStorage.getItem("shopsLastUpdateLS")
      ? JSON.parse(localStorage.getItem("shopsLastUpdateLS"))
      : 0;

    if (shopsLastUpdateDB > shopsLastUpdateLS) {
      localStorage.setItem(
        "shopsLastUpdateLS",
        JSON.stringify(shopsLastUpdateDB)
      );
      await db
        .collection("shops")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            shops.push(doc.data());
          });
        });
      localStorage.setItem("actualShops", JSON.stringify(shops));
      // console.log("ДАННЫЕ ВЗЯТЫ ИЗ БД И ЗАПИСАНЫ В ХРАНИЛИЩЕ");
    } else {
      shops = localStorage.getItem("actualShops")
        ? JSON.parse(localStorage.getItem("actualShops"))
        : [];
      // console.log("ДАННЫЕ ВЗЯТЫ ИЗ ХРАНИЛИЩА");
    }
    //get colors from DB
    const colors = [];
    await db
      .collection("warehouse/shipment/carsColors")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          colors.push(doc.data());
        });
      });
    this.$store.commit("setShopsAndColors", { shops, colors });
    //get packages from DB
    const rawCurrentPackages = await db
      .collection("warehouse/shipment/packages")
      .get();
    const currenPackages = rawCurrentPackages.docs.map((doc) => doc.data());
    await this.$store.dispatch("setPackages", currenPackages);
    //get room storage
    const room = await db.collection("warehouse/storage/roomStorage").get();
    const roomArr = room.docs.map((doc) => doc.data().name);
    this.$store.dispatch("setStorage", roomArr);
  },
};
</script>

<style lang="scss" scoped>
.page {
  border: 1px solid black;
  display: grid;
}
</style>