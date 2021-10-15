<template>
  <section class="shipment-table" v-if="shipment">
    <TableInfo />
    <table>
      <TableHeader />
      <tr v-for="(shop, i) in shipment" :key="i">
        <td>
          {{ i + 1 }}
        </td>
        <td
          @click="changeColor"
          class="car"
          :style="{
            background: shop.carBG,
            color: shop.textColor,
            'font-weight': 800,
          }"
        >
          {{ shop.car ? shop.car : "Не указана" }}
        </td>
        <td style="font-weight: bold">{{ shop.shortName }}</td>
        <td>
          <span class="yellow">
            {{
              shop.thickCatalog
                ? shop.thickCatalog.quan + "\n" + shop.thickCatalog.region
                : null
            }}
          </span>
        </td>
        <td>
          <span class="yellow">
            {{
              shop.thinCatalog
                ? shop.thinCatalog.quan + "\n" + shop.thinCatalog.region
                : null
            }}</span
          >
        </td>
        <td>
          <span class="yellow">{{ shop.notebook }}</span>
        </td>
        <td>
          <span class="yellow">{{ shop.cup }}</span>
        </td>
        <td>
          <span class="yellow">{{ shop.pack }}</span>
        </td>
        <td>
          <span class="yellow">{{ shop.folder }}</span>
        </td>
        <td>
          <span class="yellow">{{ shop.vine }}</span>
        </td>
        <td v-if="towels">
          <span class="yellow">{{ shop.towels }}</span>
        </td>
        <td class="other-mats">
          <p
            v-for="(mat, i) in shop.otherMats"
            :key="i"
            :class="{ yellow: !roomMaterials.includes(mat.name) }"
          >
            {{ `${mat.name} - ${mat.quan}` }}
          </p>
        </td>
        <td>{{ "boxes" }}</td>
        <td>
          <div v-for="order in shop.orders" :key="order.name">
            <p
              v-if="order.comment && order.picked"
              :style="{ background: `#53DF00` }"
            >
              {{ `Р-${order.name.match(/\d+/)[0]}` }}
            </p>
            <p v-else>
              {{ `Р-${order.name.match(/\d+/)[0]}` }}
            </p>
          </div>
        </td>
      </tr>
    </table>
  </section>
</template>

<script>
import TableHeader from "@/components/WarehouseComponents/TableHeader";
import TableInfo from "@/components/WarehouseComponents/TableInfo";
export default {
  components: {
    TableHeader,
    TableInfo,
  },
  methods: {
    changeColor(event) {
      const target = event.target;
      const targetCar = target.firstChild.textContent;
      const allCars = document.querySelectorAll(`.car`);
      const colorArea = [];
      allCars.forEach((car) =>
        car.firstChild.textContent === targetCar ? colorArea.push(car) : null
      );
      const inputColor = document.createElement(`input`);
      inputColor.type = `color`;
      inputColor.classList.add(`input-color`);
      inputColor.value = target.dataset.backColor;
      inputColor.addEventListener(`input`, (event) => {
        const currentColor = event.target.value;
        colorArea.forEach((item) => {
          item.style.backgroundColor = currentColor;
        });
      });
      inputColor.click();
    },
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
    noInvalidQuans() {
      return this.$store.getters.getInvalidQuans.length === 0;
    },
    towels() {
      return this.$store.getters.getTowelsInfo;
    },
    roomMaterials() {
      return this.$store.getters.getRoomMaterials;
    },
    templateColumns() {
      return this.$store.getters.getTowelsInfo
        ? "gridTemplateColumns: repeat(14, 1fr)"
        : "gridTemplateColumns: repeat(13, 1fr)";
    },
  },
};
</script>


<style lang="scss" >
.yellow {
  background: yellow;
}

.cell {
  border: 1px solid black;
}

.input-color {
  position: relative;
  width: 100%;
  height: 100%;
  opacity: 0;
  display: none;
}
.other-mats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  white-space: nowrap;

  p {
    margin: 5px;
    text-align: left;
  }
}

// .table {
//   display: grid;
// }

table {
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

@media print {
  body {
    line-height: 1.2;
    visibility: hidden;
    font-size: 20pt;
  }
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .other {
    font-size: 20pt;
  }
  .table-info {
    font-size: 20pt;
  }
  .print-area,
  .print-area * {
    visibility: visible;
  }
  .print-area {
    position: absolute;
    top: 50px;
  }
  html,
  body,
  // .wrapper,
  // .table-block,
  .print-area {
    float: none;
    display: block;
    page-break-inside: avoid;
    // page-break-before: always;
    table {
      page-break-after  : always ;
    }
  }
}
</style>