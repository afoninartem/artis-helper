<template>
  <section class="stocks">
    <h1>Обработка отчета по акции</h1>
    <AddStockReport v-if="!getTableData.length && !getShowTerms" />
    <p v-else>Отчет по акции загружен</p>
    <div class="additional-stock-shipment">
      <div class="additional-stock-shipment__check" v-if="!getShowTerms">
        <div class="check-question" v-if="getTableData.length">
          <h3>Добавить в отгрузку подарки или газеты?</h3>
          <div class="additional-stock-shipment__buttons">
            <button @click.prevent="additionalMaterials(true)" class="submit">
              ДА
            </button>
            <button @click.prevent="showTable" class="submit">НЕТ</button>
          </div>
        </div>
        <div class="additional-stock-shipment__items" v-if="this.addMats">
          <input
            type="checkbox"
            name="papers"
            id="papers"
            value="papers"
            v-model="checkAdds"
          />
          <label for="papers">Газеты</label>
          <input
            type="checkbox"
            name="adultGifts"
            id="adultGifts"
            value="adultGifts"
            v-model="checkAdds"
          />
          <label for="adultGifts">Взрослые подарки</label>
          <input
            type="checkbox"
            name="kidsGifts"
            id="kidsGifts"
            value="kidsGifts"
            v-model="checkAdds"
          />
          <label for="kidsGifts">Детские подарки</label>
          <div
            class="gifts__details"
            v-if="this.checkAdds.includes('adultGifts')"
          >
            <select
              name="giftsClassification"
              id="giftsClassification"
              v-model="giftsClassify"
            >
              <option value="generalAdult">Вместе мужские и женские</option>
              <option value="separateAdult">Отдельно мужские и женские</option>
              <option value="maleAdult">Только мужские</option>
              <option value="femaleAdult">Только женские</option>
            </select>
          </div>
        </div>
      </div>
      <AddEmployeesReport
        v-if="
          ((this.checkAdds.includes('adultGifts') && giftsClassify) ||
            this.checkAdds.includes('papers') ||
            this.checkAdds.includes('kidsGifts')) &&
          !getShowTerms
        "
      />
    </div>
    <button @click.prevent="printTable">Распечатать таблицу</button>
    <div class="print-area">
      <StockTable />
    </div>
  </section>
</template>

<script>
import StockTable from "@/components/WarehouseComponents/StockTable";
import AddStockReport from "@/components/WarehouseComponents/AddStockReport";
import AddEmployeesReport from "@/components/WarehouseComponents/AddEmployeesReport";
// import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    AddStockReport,
    AddEmployeesReport,
    StockTable,
    // VueHtml2pdf,
  },
  data() {
    return {
      checkAdds: [],
      giftsClassify: null,
      addMats: false,
    };
  },
  methods: {
    printTable() {
      window.print();
    },
    additionalMaterials(data) {
      this.addMats = data ? true : false;
    },
    showTable() {
      return this.$store.dispatch("showTable");
    },
  },
  created: async function () {
    await this.$store.dispatch("setActualShops");
  },
  computed: {
    getTableData() {
      return this.$store.getters.getReportsData;
    },
    getShowTerms() {
      return (
        this.$store.getters.getShowExtraTable ||
        this.$store.getters.getShowTable
      );
    },
  },
  watch: {
    checkAdds: function (arr) {
      this.$store.dispatch("setInfoToVuex", arr);
    },
    giftsClassify: function (data) {
      const arr = Array.from(this.checkAdds);
      arr.push(data);
      this.$store.dispatch("setInfoToVuex", arr);
    },
  },
};
</script>

<style lang="scss" scoped>
.stocks {
  * {
    margin: 0;
  }
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
  // .wrapper,
  // .table-block,
  .print-area {
    float: none;
    display: block;
    page-break-inside: avoid;
    // page-break-before: always;
    // tr {
    // page-break-after: always;
    // }
  }
}
</style>