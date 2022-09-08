<template>
  <div class="stocks">
    <h1>Отгрузка к акции</h1>
    <div class="settings-block">
      <AddEmployeesReport />
      <a :href="this.url.gs" target="_blank">Таблица Google Disc</a>
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename="Акция.xlsx">
          <button @click.prevent="addSheets">Скачать XLSX</button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
    <table v-if="shipment">
      <thead>
        <tr>
          <th>#</th>
          <th>Салон</th>
          <th>Плакат</th>
          <th>VIP</th>
          <th>Пакет</th>
          <th>Кружка</th>
          <th>Упак.</th>
          <th>Вино</th>
          <th>Набор</th>
          <th>Развертка</th>
          <th>5гр</th>
          <th>Карамель</th>
          <th>Листовка</th>
          <th>Зеленый</th>
          <th>Серый</th>
          <th>Зажим</th>
          <th>Палочка</th>
          <th v-if="shipment.extra">Взрослый</th>
          <th v-if="shipment.extra">Мужской</th>
          <th v-if="shipment.extra">Женский</th>
          <th v-if="shipment.extra">Детский</th>
          <th v-if="shipment.extra">Газета</th>
        </tr>
      </thead>
      <tbody v-for="(region, i) in shipment.data" :key="`region-${i}`">
        <tr v-for="(ship, j) in region" :key="`shop-${j}`">
          <td>
            <span v-if="!ship.shop.includes(`ИТОГО`)">{{ j + 1 }}</span>
          </td>
          <td>{{ ship.shop }}</td>
          <td>{{ ship.shipment.poster }}</td>
          <td>{{ ship.shipment.vip }}</td>
          <td>{{ ship.shipment.vipPack }}</td>
          <td>{{ ship.shipment.cup || 0 }}</td>
          <td>{{ ship.shipment.cupPack || 0 }}</td>
          <td>{{ ship.shipment.vine }}</td>
          <td>{{ ship.shipment.chocoSet }}</td>
          <td>{{ ship.shipment.chest }}</td>
          <td>{{ ship.shipment.choco5 }}</td>
          <td>{{ ship.shipment.candy.toFixed(1) }}</td>
          <td>{{ ship.shipment.leaflet }}</td>
          <td>{{ ship.shipment.greenBaloon }}</td>
          <td>{{ ship.shipment.grayBaloon }}</td>
          <td>{{ ship.shipment.clamp }}</td>
          <td>{{ ship.shipment.stick }}</td>
          <td v-if="shipment.extra">{{ ship.shipment.allAdultGifts }}</td>
          <td v-if="shipment.extra">{{ ship.shipment.maleGifts }}</td>
          <td v-if="shipment.extra">{{ ship.shipment.femaleGifts }}</td>
          <td v-if="shipment.extra">{{ ship.shipment.kidsGifts }}</td>
          <td v-if="shipment.extra">{{ ship.shipment.papers }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AddEmployeesReport from "@/components/WarehouseComponents/AddEmployeesReport";
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    AddEmployeesReport,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      // shipment: null,
      sheets: [],
      url: {
        gs: "https://docs.google.com/spreadsheets/d/1lA0qg3ZEXmDn6EOGtcoiJHuFRPDCTdUzvuyBGdgvJxs/edit#gid=681451715",
        macros:
          "https://script.google.com/macros/s/AKfycbwi5aDlB3TcwWZNLqkD4v1lBXBppreLV8Hkviq9pSJdgxgPlbcIWI3UduDqtv1V1aGf/exec",
      },
      error: {
        shoplist: {
          state: false,
          text: "Необходимо проверить список салонов и соответствие таблицы",
        },
      },
    };
  },
  methods: {
    addSheets() {
      this.sheets.push({
        name: "Отгрузка к акции",
        data: this.shipmentXLSX,
      });
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualShops");
    fetch(this.url.macros)
      .then((res) => res.json())
      .then((data) => {
        const title = data[0];
        data.shift();
        const report = Array.from(data)
          .filter((item) => item[0].trim() != "")
          .map((item) => {
            const obj = {};
            Array.from(item).forEach((cell, i) => (obj[title[i]] = cell));
            return obj;
          });
        //check new or closed shops
        report.some((el) => el.checkReportMatch === false)
          ? (this.error.shoplist.state = true)
          : null;
        this.$store.dispatch("setShipment", report);
      });
  },
  computed: {
    shipmentXLSX() {
      if (!this.shipment) return;
      const result = [];
      for (let region in this.shipment.data) {
        this.shipment.data[region].forEach((shop) => {
          this.shipment.extra
            ? this.shipment.extra[shop.shop]
              ? result.push(
                  Object.assign(
                    { name: shop.shop },
                    shop.shipment,
                    this.shipment.extra[shop.shop]
                  )
                )
              : result.push(Object.assign({ name: shop.shop }, shop.shipment))
            : result.push(Object.assign({ name: shop.shop }, shop.shipment));
        });
      }
      return result.map((o, i) => ({
        "#": i + 1,
        ФС: o.name,
        Плакат: o.poster,
        ВИП: o.vip,
        Пакет: o.vipPack,
        Кружка: o.cup,
        Упак: o.cupPack,
        Вино: o.vine,
        "Шок. набор": o.chocoSet,
        Развертка: o.chest,
        "5гр": o.choco5,
        Карамель: o.candy,
        Листовка: o.leaflet,
        Зеленый: o.greenBaloon,
        Серый: o.grayBaloon,
        Зажим: o.clamp,
        Палочка: o.stick,
        Взрослый: o.allAdultGifts,
        Муж: o.maleGifts,
        Жен: o.femaleGifts,
        Дет: o.kidsGifts,
        Газета: o.papers,
      }));
    },
    shipment() {
      const obj = this.$store.getters.getStockShipment;
      const extra = this.$store.getters.getExtraStockShipment;
      if (obj) {
        const result = Object.keys(obj)
          .sort()
          .reduce((r, k) => ((r[k] = obj[k]), r), {});
        const finalSummary = { shop: "ИТОГО ВСЕГО:", shipment: {} };
        const finSumm = finalSummary.shipment;
        for (let region in result) {
          if (result[region].some((shop) => shop.shop === "ИТОГО:"))
            result[region] = result[region].filter((el) => el.shop != "ИТОГО:");
          const summary = { shop: "ИТОГО:", shipment: {} };
          const summ = summary.shipment;
          result[region].forEach((shop) => {
            if (extra) {
              if (extra[shop.shop]) {
                shop.shipment = Object.assign(shop.shipment, extra[shop.shop]);
              }
            }
            for (let ship in shop.shipment) {
              summ[ship]
                ? (summ[ship] += Number(shop.shipment[ship]))
                : (summ[ship] = Number(shop.shipment[ship]));
              finSumm[ship]
                ? (finSumm[ship] += Number(shop.shipment[ship]))
                : (finSumm[ship] = Number(shop.shipment[ship]));
            }
          });
          result[region].push(summary);
        }
        if (
          result[Object.keys(result)[Object.keys(result).length - 1]].some(
            (shop) => shop.shop === "ИТОГО ВСЕГО:"
          )
        )
          result[Object.keys(result)[Object.keys(result).length - 1]] = result[
            Object.keys(result)[Object.keys(result).length - 1]
          ].filter((el) => el.shop != "ИТОГО ВСЕГО:");
        result[Object.keys(result)[Object.keys(result).length - 1]].push(
          finalSummary
        );
        this.$forceUpdate();
        return { data: result, extra: extra };
      }
      return null;
    },
    // extras() {
    //   return this.$store.getters.getExtraStockShipment;
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/personalTable.scss";
@include personal-table;
.stocks {
  overflow: auto;
  thead th {
    position: sticky;
    top: 0;
  }
}
</style>