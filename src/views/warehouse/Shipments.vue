<template>
  <section class="shipments">
    <h1>Отгрузочная таблица</h1>
    <AddLeftovers v-if="invalidLeftovers.length || !handledLeftovers.length" />
    <AddShipments v-if="!invalidLeftovers.length && handledLeftovers.length" />
    <div
      class="btn-block"
      v-if="
        (tableInfo.msc.numberOfShops > 0 ||
          tableInfo.spbnn.numberOfShops > 0) &&
        noInvalidQuans &&
        noStoppedMaterials
      "
    >
      <button
        class="btn-block__item"
        v-for="(btn, i) in buttons"
        :key="i"
        :class="{ active: btn.terms === activeRegion }"
        @click="sortByTerms(btn.terms)"
      >
        {{ btn.terms === "msc" ? "МСК + РЕГ" : btn.title }}
      </button>
    </div>
    <!-- <ul>
      <li v-for="left, l in handledLeftovers" :key="l">
        {{left.name}}
      </li>
    </ul> -->
    <div class="print-area">
      <ShipmentTableHTMLTABLE />
      <div class="reminder-block" v-if="shipment">
        <p v-if="activeRegion === 'msc'">
          Суммарная отгрузка бумаги А4 в
          <span style="font-weight: bold">МОСКВУ И РЕГИОНЫ</span> за сегодня:
          {{ papers.regular }}
        </p>
        <p v-else-if="activeRegion === 'spb' || 'nn' || 'spbnn'">
          Суммарная отгрузка бумаги А4 в
          <span style="font-weight: bold">ПИТЕР И НИЖНИЙ</span> за сегодня:
          {{ papers.spbnn }}
        </p>
        <p class="reminder" v-if="activeRegion === 'msc'">
          Проверить подарки клиентам в 18:00! Отчёт "Анализ рекламационных
          наборов"
        </p>
        <p
          class="reminder"
          v-else-if="activeRegion === 'spb' || 'nn' || 'spbnn'"
        >
          Проверить подарки клиентам <b>СПБ и НН</b> в 12:00! Отчёт "Анализ
          рекламационных наборов"
        </p>
      </div>
    </div>
    <button class="btn-print" v-if="activeRegion" @click="print">Печать</button>
    <div class="warning-container" style="width: 80%">
      <LimitsWarning />
      <LeftoversWarning />
      <StopListWarning />
      <OverrunWarning />
      <QuantityWarning />
      <UrgentOrderWarning />
    </div>
  </section>
</template>

<script>
import AddLeftovers from "@/components/WarehouseComponents/AddLeftovers";
import AddShipments from "@/components/WarehouseComponents/AddShipments";
import LeftoversWarning from "@/components/WarehouseComponents/LeftoversWarning";
import OverrunWarning from "@/components/WarehouseComponents/OverrunWarning";
import QuantityWarning from "@/components/WarehouseComponents/QuantityWarning";
import UrgentOrderWarning from "@/components/WarehouseComponents/UrgentOrderWarning";
import StopListWarning from "@/components/WarehouseComponents/StopListWarning";
import LimitsWarning from "@/components/WarehouseComponents/LimitsWarning";
import ShipmentTableHTMLTABLE from "@/components/WarehouseComponents/ShipmentTableHTMLTABLE";
import { mapGetters } from "vuex";
export default {
  components: {
    AddLeftovers,
    AddShipments,
    LeftoversWarning,
    OverrunWarning,
    QuantityWarning,
    ShipmentTableHTMLTABLE,
    UrgentOrderWarning,
    StopListWarning,
    LimitsWarning,
  },
  methods: {
    print() {
      return window.print();
    },
    async sortByTerms(payload) {
      await this.$store.dispatch("switchTable", payload);
    },
    async handleShipments() {
      return await this.$store.dispatch("shipmentHandler");
    },
  },
  watch: {
    rawShipment: function (newRawShipment) {
      //delete arg (newRawShipment)?
      console.log("log newRawShipment for watch function: " + newRawShipment);
      this.handleShipments();
    },
  },
  computed: {
    shipment() {
      const shipment = this.$store.getters.getSortedShipment;
      return shipment[this.activeRegion];
    },
    shipmentSuccessfullyLoaded() {
      return this.$store.getters.getShipment;
    },
    activeRegion() {
      const allShipments = this.$store.getters.getTableSwitcherState;
      const activeRegion =
        allShipments.filter((el) => el.active).length === 1
          ? allShipments.filter((el) => el.active)[0].region
          : null;
      return activeRegion;
    },
    stickers() {
      return this.$store.getters.getStickers;
    },
    towels() {
      return this.$store.getters.getTowelsInfo;
    },
    invalidLeftovers() {
      return this.$store.getters.getInvalidLeftovers;
    },
    handledLeftovers() {
      return this.$store.getters.getLeftovers;
    },
    ...mapGetters({
      rawShipment: "getRawShipment",
    }),
    tableInfo() {
      return this.$store.getters.getTableInfo;
    },
    buttons() {
      const info = this.$store.getters.getTableInfo;
      const buttons = [];
      for (let i in info) {
        if (typeof info[i] === "object" && info[i] !== null) {
          if (info[i].numberOfShops > 0) {
            buttons.push({
              title: info[i].title,
              terms: i,
            });
          }
        }
      }
      return buttons;
    },
    noInvalidQuans() {
      return this.$store.getters.getInvalidQuans.length === 0;
    },
    noStoppedMaterials() {
      return this.$store.getters.getCurrentStoppedMaterials.length === 0;
    },
    papers() {
      return this.$store.getters.getPaperShipment;
    },
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

    await this.$store.dispatch("setActualShops");
    await this.$store.dispatch("setActualColors");
    await this.$store.dispatch("setActualStorage");
    await this.$store.dispatch("setActualLimits");
    await this.$store.dispatch("setActualPackages");
    await this.$store.dispatch("setActualStopList");
    await this.$store.dispatch("setActualLeftovers");
  },
};
</script>

<style lang="scss" scoped>
// ul li {
//   padding: 5px;
//   font-size: 20px;
//   text-align: left;
// }

.shipments {
  display: flex;
  flex-direction: column;
  align-items: center;
  .btn-block {
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    gap: 30px;
    .btn-block__item {
      width: 200px;
      border: none;
      font-size: 14px;
      padding: 5px 10px;
      background: -webkit-gradient(
        linear,
        0% 0%,
        0% 20%,
        from(#ededed),
        to(#e8eaeb)
      );
      font-weight: bold;
      &:hover {
        cursor: pointer;
        background: #f5df4d;
        transform: scale(1.1);
      }
    }
    .active {
      background: #f5df4d;
      transform: scale(1.1);
      border: 2px solid black;
    }
  }
  .btn-print {
    border: 1px solid #f5df4d;
    background: #f5df4d;
    padding: 16px 32px;
    font-size: 20px;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
    &:active {
      transform: scale(1);
    }
  }
}

.reminder {
  font-size: 24px;
}
</style>