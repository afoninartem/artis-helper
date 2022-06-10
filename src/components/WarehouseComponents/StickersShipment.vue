<template>
  <section class="stickers">
    <!-- <h1 v-if="Object.keys(stickers).length">Распечатать стикеры</h1> -->
    <!-- <h1 v-else>Нет заполненных стикеров, вернитесь к отгрузочной таблице</h1> -->
    <h1>Распечатать стикеры</h1>
    <div class="btn-block">
      <button
        class="btn-block__item"
        v-for="(btn, i) in stickers"
        :key="i"
        @click.prevent="showStickersByTerms(i)"
      >
        {{ terms[i] }}
      </button>
    </div>
    <div class="stickers__preview">
      <ul>
        <li v-for="(sticker, i) in this.activeStickers" :key="i">
          <p class="shop">{{ sticker.shop }}</p>
          <p class="stickers-quan">{{ sticker.stickers }}</p>
          <div class="current-print">
            <img
              src="../../assets/printer.png"
              alt="Распечатать стикеры на этот салон"
              @click.prevent="printThisShop(sticker.shop)"
            />
          </div>
        </li>
      </ul>
    </div>
    <div>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1400"
        filename="Стикеры"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <div
            class="sticker-to-print"
            v-for="(copy, i) in this.shopToPrint"
            :key="i"
          >
            <div class="sticker-body">
              <p class="shop">{{ copy.shop }}</p>
              <p class="car">{{ copy.car }}</p>
            </div>
          </div>
        </section>
      </vue-html2pdf>
    </div>
  </section>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  components: {
    VueHtml2pdf,
  },
  data() {
    return {
      terms: {
        msc: "МСК + РЕГ",
        spb: "САНКТ-ПЕТЕРБУРГ",
        nn: "НИЖНИЙ НОВГОРОД",
        spbnn: "СПБ + НН",
      },
      activeStickers: null,
      shopToPrint: [],
    };
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    showStickersByTerms(i) {
      this.activeStickers = this.stickers[i];
    },
    async printThisShop(payload) {
      const stickerList = this.stickers[this.activeRegion];
      this.shopToPrint = [];
      for (let i = 0; i < stickerList[payload].stickers; i += 1) {
        await this.shopToPrint.push(stickerList[payload]);
      }
      this.generateReport();
    },
  },
  computed: {
    stickers() {
      const raw = this.$store.getters.getStickers;
      const res = {};
      for (let i in raw) {
        if (Object.keys(raw[i]).length > 0) res[i] = raw[i];
      }
      return res;
    },
    activeRegion() {
      const allShipments = this.$store.getters.getTableSwitcherState;
      const activeRegion =
        allShipments.filter((el) => el.active).length === 1
          ? allShipments.filter((el) => el.active)[0].region
          : null;
      return activeRegion;
    },
  },
};
</script>

<style lang="scss" scoped>
.stickers__preview {
  width: 50%;
  margin: 0 auto;
  ul {
    list-style: none;
    li {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
      .shop,
      .stickers-quan {
        font-weight: bold;
      }
      .current-print {
        cursor: pointer;
      }
    }
  }
}
// .print-area {
// display: none;
// visibility: hidden;
.sticker-body {
  width: 210mm;
  height: 148mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  // border: 1px solid #fff;
  .shop,
  .car {
    text-align: center;
    font-size: 30pt;
    padding: 30px 0;
  }
  .shop {
    font-size: 36pt;
  }
}
// }
@media print {
  @page {
    width: 21cm;
    height: 29.7cm;
    margin: 0;
    page-break-after: always;
  }
  body {
    // line-height: 1.2;
    visibility: hidden;
    // font-size: 20pt;
    background: #fff;
    margin: 0 auto;
  }
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .print-area,
  .print-area * {
    // display: block;
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
    page-break-inside: avoid;
    .sticker-to-print {
      .sticker-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          text-align: center;
        }
      }
    }
  }
}
</style>