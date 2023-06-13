<template>
  <section
    class="shipment-table"
    v-if="shipment"
  >
    <TableInfo />
    <table>
      <TableHeader />
      <tr
        v-for="(shop, i) in shipment"
        :key="i"
      >
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
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
        <!-- <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">
            {{ shop.thickCatalog ? shop.thickCatalog : null }}
          </span>
        </td> -->
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">
            {{
              shop.thinCatalog
                ? shop.thinCatalog.quan + `\n` + shop.thinCatalog.region
                : null
            }}</span>
        </td>
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">{{ shop.notebook }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.notebook"
          >блокноты</span>
        </td>
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">{{ shop.cup }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.cup"
          >кружки</span>
        </td>
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">{{ shop.pack }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.pack"
          >упак.</span>
        </td>
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">{{ shop.folder }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.folder"
          >папки</span>
        </td>
        <td
          v-if="towels"
          :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }"
        >
          <span class="yellow tablepart">{{ shop.towel }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.towel"
          >полотенца</span>
        </td>
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <span class="yellow tablepart">{{ shop.vine }}</span>
          <br>
          <span
            class="yellow tablepart"
            style="font-size: 12px"
            v-if="shop.vine"
          >шампанское</span>
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
              background: markers.map((m) => m.material).includes(mat.name)
                ? markers.filter((m) => m.material === mat.name)[0].color
                : null,
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
        <td :style="{
            background: shop.name.includes('РЕКЛАМАЦИИ') ? shop.shopBG : '#fff',
          }">
          <div
            v-for="order in shop.orders"
            :key="order.name"
          >
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
            this.$forceUpdate();
          } else {
            thisInput.style.display = "none";
            await this.$store.dispatch("deleteSticker", currentSticker);
            this.$forceUpdate();
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
    markers() {
      return this.$store.getters.getActualStates.markers;
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
@import "@/scss/shipmentTable.scss";
@include shipment-table;

@media print {
  body {
    line-height: 1.2;
    visibility: hidden;
    font-size: 20pt;
    background: #fff;
  }
  * {
    color-adjust: exact;
    print-color-adjust: exact;
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