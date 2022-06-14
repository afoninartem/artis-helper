<template>
  <section class="shipment-table" v-if="shipment">
    <TableInfo />
    <table>
      <TableHeader />
      <tr v-for="(shop, i) in shipment" :key="i">
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          {{ i + 1 }}
        </td>
        <td
          @click="changeColor"
          class="car"
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ')
              ? shop.shopBG
              : shop.carBG,
            color: shop.textColor,
            'font-weight': 800,
          }"
        >
          {{ shop.car ? shop.car : "Не указана" }}
        </td>
        <td :style="{ fontWeight: 'bold', background: shop.shopBG }">
          {{ shop.name }}
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">
            {{ shop.thickCatalog ? shop.thickCatalog : null }}
          </span>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">
            {{
              shop.thinCatalog
                ? shop.thinCatalog.quan + "\n" + shop.thinCatalog.region
                : null
            }}</span
          >
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.notebook }}</span>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.cup }}</span>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.pack }}</span>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.folder }}</span>
        </td>
        <td
          v-if="towels"
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.towel }}</span>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.vine }}</span>
        </td>

        <td
          class="other-mats"
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <p
            :style="{
              color: mat.quan ? `#000` : `red`,
              fontWeight: mat.quan ? `normal` : `bold`,
            }"
            v-for="(mat, i) in shop.otherMats"
            :key="i"
            :class="{ yellow: !roomMaterials.includes(mat.name) }"
          >
            {{ mat.quan ? `${mat.name} - ${mat.quan}` : `${mat.name}` }}
          </p>
          <p
            v-for="(sample, i) in shop.samples"
            :key="'sample-' + i"
            :class="{ yellow: !roomMaterials.includes(sample.name) }"
          >
            {{ `${sample.name} - ${sample.quan}` }}
          </p>
          <p v-if="shop.otherMats || shop.samples" style="font-weight: bold">
            Всего материалов в разделе Другое:
            {{ shop.otherMats ? shop.otherMats.length : 0 + shop.samples ? shop.samples.length : 0 }}
          </p>
        </td>
        <td
          @click.prevent="changeBoxes"
          class="boxes"
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <input
            type="number"
            name="boxesNumber"
            class="boxes__input"
            :id="`boxes-${i + 1}`"
          />
          <p
            @click.prevent="redirectClick"
            class="user-boxes"
            style="font-size: 16px; font-weight: bold"
          >
            {{
              stickers[activeRegion][shop.name]
                ? stickers[activeRegion][shop.name].stickers
                : ""
            }}
          </p>
        </td>
        <td
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
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
    async redirectClick(event) {
      event.target.parentElement.click();
    },
    async changeBoxes(event) {
      const target = await event.target;
      const thisInput = await target.firstChild;
      // console.log(thisInput);
      if (thisInput) {
        thisInput.value = "";
        thisInput.style.display = "block";
        thisInput.focus();
        thisInput.addEventListener("focusout", async () => {
          const currentSticker = {
            shop: thisInput.parentElement.parentElement.children[2].textContent.trim(),
            car: thisInput.parentElement.parentElement.children[1].textContent.trim(),
            stickers: thisInput.value,
            region: this.activeRegion,
          };
          if (currentSticker.stickers !== "") {
            thisInput.style.display = "none";
            await this.$store.dispatch("addSticker", currentSticker);
            await this.$forceUpdate();
          } else {
            thisInput.style.display = "none";
            await this.$store.dispatch("deleteSticker", currentSticker);
            await this.$forceUpdate();
          }
        });
      }
    },
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
      // inputColor.value = target.dataset.backColor; //idk why it's here xD
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
      const shipment = this.$store.getters.getSortedShipment;
      return shipment[this.activeRegion];
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
      // console.log(this.$store.getters.getStickers);
      return this.$store.getters.getStickers;
    },
    noInvalidQuans() {
      return this.$store.getters.getInvalidQuans.length === 0;
    },
    towels() {
      return this.$store.getters.getTowelsInfo;
    },
    roomMaterials() {
      return this.$store.getters.getActualStates.storage.map((mat) =>
        mat.name.split("  ").join(" ")
      );
    },
  },
};
</script>


<style lang="scss" >
.yellow {
  background: yellow;
}

.towels {
  background: yellow;
  border: 2px solid black;
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

.boxes {
  min-width: 50px;
  cursor: pointer;
  &__input {
    display: none;
    max-width: 50px;
  }
}

.tablepart {
  font-size: 24px;
  // font-weight: bold;
}

.other-mats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  white-space: nowrap;
  min-height: 35px;
  p {
    margin: 5px;
    text-align: left;
  }
}

table {
  position: relative;
  font-size: 14px;
  overflow: hidden;
  border: 1px solid #d3d3d3;
  background: #fefefe;
  margin: 5% auto 0;
  margin-top: 0;
  max-width: 100vw;
  // transform: scale(0.88);
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
    background: #fff;
  }
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
    -moz-color-adjust: exact;
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
  .print-area {
    float: none;
    display: block;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    page-break-inside: avoid;
    max-width: 3500px;
    width: 100%;
    padding: 20px;
    tr {
      page-break-inside: avoid;
    }
  }
}
</style>