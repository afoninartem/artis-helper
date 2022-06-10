<template>
  <section class="stock-table" v-if="showTable || showExtraTable">
    <table>
      <StockTableHeader />
      <tr v-for="(shop, i) in stockShipmentMSC" :key="i">
        <td>{{ i + 1 }}</td>
        <td class="shop-name">{{ shop.shop }}</td>
        <td>{{ shop.shipment.poster }}</td>
        <td>{{ shop.shipment.vip }}</td>
        <td>{{ shop.shipment.vipPack }}</td>
        <td>{{ shop.shipment.cup }}</td>
        <td>{{ shop.shipment.cupPack }}</td>
        <td>{{ shop.shipment.vine }}</td>
        <td>{{ shop.shipment.chocoSet }}</td>
        <td>{{ shop.shipment.chest }}</td>
        <td>{{ shop.shipment.choco5 }}</td>
        <td>{{ shop.shipment.candy }}</td>
        <td>{{ shop.shipment.leaflet }}</td>
        <td>{{ shop.shipment.greenBaloon }}</td>
        <td>{{ shop.shipment.grayBaloon }}</td>
        <td>{{ shop.shipment.clamp }}</td>
        <td>{{ shop.shipment.stick }}</td>
        <td v-if="extraColumns.adult">
          {{ shop.shipment.allAdultGifts }}
        </td>
        <td v-if="extraColumns.male">
          {{ shop.shipment.maleGifts }}
        </td>
        <td v-if="extraColumns.female">
          {{ shop.shipment.femaleGifts }}
        </td>
        <td v-if="extraColumns.kids">
          {{ shop.shipment.kidsGifts }}
        </td>
        <td v-if="extraColumns.papers">
          {{ shop.shipment.papers }}
        </td>
      </tr>
      <tr>
        <td></td>
        <td>ИТОГО</td>
        <td>{{ summary.moscow.poster }}</td>
        <td>{{ summary.moscow.vip }}</td>
        <td>{{ summary.moscow.vipPack }}</td>
        <td>{{ summary.moscow.cup }}</td>
        <td>{{ summary.moscow.cupPack }}</td>
        <td>{{ summary.moscow.vine }}</td>
        <td>{{ summary.moscow.chocoSet }}</td>
        <td>{{ summary.moscow.chest }}</td>
        <td>{{ summary.moscow.choco5 }}</td>
        <td>{{ summary.moscow.candy }}</td>
        <td>{{ summary.moscow.leaflet }}</td>
        <td>{{ summary.moscow.greenBaloon }}</td>
        <td>{{ summary.moscow.grayBaloon }}</td>
        <td>{{ summary.moscow.clamp }}</td>
        <td>{{ summary.moscow.stick }}</td>
        <td v-if="extraColumns.adult">{{ extraSummary.moscow.allAdultGifts }}</td>
        <td v-if="extraColumns.male">{{ extraSummary.moscow.maleGifts }}</td>
        <td v-if="extraColumns.female">{{ extraSummary.moscow.femaleGifts }}</td>
        <td v-if="extraColumns.kids">{{ extraSummary.moscow.kidsGifts }}</td>
        <td v-if="extraColumns.papers">{{ extraSummary.moscow.papers }}</td>
      </tr>
      <StockTableHeader />
      <tr v-for="(shop, i) in stockShipmentOther" :key="'other' + i">
        <td>{{ i + 1 }}</td>
        <td class="shop-name">{{ shop.shop }}</td>
        <td>{{ shop.shipment.poster }}</td>
        <td>{{ shop.shipment.vip }}</td>
        <td>{{ shop.shipment.vipPack }}</td>
        <td>{{ shop.shipment.cup }}</td>
        <td>{{ shop.shipment.cupPack }}</td>
        <td>{{ shop.shipment.vine }}</td>
        <td>{{ shop.shipment.chocoSet }}</td>
        <td>{{ shop.shipment.chest }}</td>
        <td>{{ shop.shipment.choco5 }}</td>
        <td>{{ shop.shipment.candy }}</td>
        <td>{{ shop.shipment.leaflet }}</td>
        <td>{{ shop.shipment.greenBaloon }}</td>
        <td>{{ shop.shipment.grayBaloon }}</td>
        <td>{{ shop.shipment.clamp }}</td>
        <td>{{ shop.shipment.stick }}</td>
        <td v-if="extraColumns.adult">
          {{ shop.shipment.allAdultGifts }}
        </td>
        <td v-if="extraColumns.male">
          {{ shop.shipment.maleGifts }}
        </td>
        <td v-if="extraColumns.female">
          {{ shop.shipment.femaleGifts }}
        </td>
        <td v-if="extraColumns.kids">
          {{ shop.shipment.kidsGifts }}
        </td>
        <td v-if="extraColumns.papers">
          {{ shop.shipment.papers }}
        </td>
      </tr>
      <tr>
        <td></td>
        <td>ИТОГО</td>
        <td>{{ summary.other.poster }}</td>
        <td>{{ summary.other.vip }}</td>
        <td>{{ summary.other.vipPack }}</td>
        <td>{{ summary.other.cup }}</td>
        <td>{{ summary.other.cupPack }}</td>
        <td>{{ summary.other.vine }}</td>
        <td>{{ summary.other.chocoSet }}</td>
        <td>{{ summary.other.chest }}</td>
        <td>{{ summary.other.choco5 }}</td>
        <td>{{ summary.other.candy }}</td>
        <td>{{ summary.other.leaflet }}</td>
        <td>{{ summary.other.greenBaloon }}</td>
        <td>{{ summary.other.grayBaloon }}</td>
        <td>{{ summary.other.clamp }}</td>
        <td>{{ summary.other.stick }}</td>
        <td v-if="extraColumns.adult">{{ extraSummary.other.allAdultGifts }}</td>
        <td v-if="extraColumns.male">{{ extraSummary.other.maleGifts }}</td>
        <td v-if="extraColumns.female">{{ extraSummary.other.femaleGifts }}</td>
        <td v-if="extraColumns.kids">{{ extraSummary.other.kidsGifts }}</td>
        <td v-if="extraColumns.papers">{{ extraSummary.other.papers }}</td>
      </tr>
      <tr>
        <td></td>
        <td>ИТОГО ВСЕГО</td>
        <td>{{ summary.other.poster + summary.moscow.poster }}</td>
        <td>{{ summary.other.vip + summary.moscow.vip }}</td>
        <td>{{ summary.other.vipPack + summary.moscow.vipPack }}</td>
        <td>{{ summary.other.cup + summary.moscow.cup }}</td>
        <td>{{ summary.other.cupPack + summary.moscow.cupPack }}</td>
        <td>{{ summary.other.vine + summary.moscow.vine }}</td>
        <td>{{ summary.other.chocoSet + summary.moscow.chocoSet }}</td>
        <td>{{ summary.other.chest + summary.moscow.chest }}</td>
        <td>{{ summary.other.choco5 + summary.moscow.choco5 }}</td>
        <td>{{ summary.other.candy + summary.moscow.candy }}</td>
        <td>{{ summary.other.leaflet + summary.moscow.leaflet }}</td>
        <td>{{ summary.other.greenBaloon + summary.moscow.greenBaloon }}</td>
        <td>{{ summary.other.grayBaloon + summary.moscow.grayBaloon }}</td>
        <td>{{ summary.other.clamp + summary.moscow.clamp }}</td>
        <td>{{ summary.other.stick + summary.moscow.stick }}</td>
        <td v-if="extraColumns.adult">
          {{ extraSummary.other.allAdultGifts + extraSummary.moscow.allAdultGifts }}
        </td>
        <td v-if="extraColumns.male">
          {{ extraSummary.other.maleGifts + extraSummary.moscow.maleGifts }}
        </td>
        <td v-if="extraColumns.female">
          {{ extraSummary.other.femaleGifts + extraSummary.moscow.femaleGifts }}
        </td>
        <td v-if="extraColumns.kids">
          {{ extraSummary.other.kidsGifts + extraSummary.moscow.kidsGifts }}
        </td>
        <td v-if="extraColumns.papers">
          {{ extraSummary.other.papers + extraSummary.moscow.papers }}
        </td>
      </tr>
    </table>
  </section>
</template>

<script>
import StockTableHeader from "@/components/WarehouseComponents/StockTableHeader";
export default {
  components: {
    StockTableHeader,
  },
  computed: {
    stockShipmentMSC() {
      return this.$store.getters.getReportsData.filter(
        (el) => el.region === "moscow"
      );
    },
    stockShipmentOther() {
      return this.$store.getters.getReportsData.filter(
        (el) => el.region === "other"
      );
    },
    summary() {
      return this.$store.getters.getSummaryShipment;
    },
    extraSummary() {
      return this.$store.getters.getExtraSummary;
    },
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
    showTable() {
      return this.$store.getters.getShowTable;
    },
    showExtraTable() {
      return this.$store.getters.getShowExtraTable;
    }
  },
};
</script>

<style lang="scss" scoped>
.shop-name {
  width: max-content;
}

table {
  position: relative;
  font-size: 14px;
  overflow: hidden;
  border: 1px solid #d3d3d3;
  background: #fefefe;
  width: 70%;
  margin: 5% auto 0;
  margin-top: 0;
  -moz-border-radius: 5px; /* FF1+ */
  -webkit-border-radius: 5px; /* Saf3-4 */
  border-radius: 5px;
  // -moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  // -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

th,
td {
  // padding: 18px 28px 18px;
  text-align: center;
}

th {
  padding: 5px;
  text-shadow: 1px 1px 1px #fff;
  background: #e8eaeb;
}

td {
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  // border: 1px solid black;
}

tr.odd-row td {
  background: #f6f6f6;
}

td.first,
th.first {
  text-align: left;
}

td.last {
  border-right: none;
}

td {
  background: -moz-linear-gradient(100% 25% 90deg, #fefefe, #f9f9f9);
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 25%,
    from(#f9f9f9),
    to(#fefefe)
  );
}

tr.odd-row td {
  background: -moz-linear-gradient(100% 25% 90deg, #f6f6f6, #f1f1f1);
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 25%,
    from(#f1f1f1),
    to(#f6f6f6)
  );
}

th {
  background: -moz-linear-gradient(100% 20% 90deg, #e8eaeb, #ededed);
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 20%,
    from(#ededed),
    to(#e8eaeb)
  );
}

tr:first-child th.first {
  -moz-border-radius-topleft: 5px;
  // -webkit-border-top-left-radius:5px; /* Saf3-4 */
}

tr:first-child th.last {
  -moz-border-radius-topright: 5px;
  // -webkit-border-top-right-radius:5px; /* Saf3-4 */
}

tr:last-child td.first {
  -moz-border-radius-bottomleft: 5px;
  // -webkit-border-bottom-left-radius:5px; /* Saf3-4 */
}

tr:last-child td.last {
  -moz-border-radius-bottomright: 5px;
  // -webkit-border-bottom-right-radius:5px; /* Saf3-4 */
}
</style>