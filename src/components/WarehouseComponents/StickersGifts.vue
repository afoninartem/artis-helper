<template>
  <section>
    <button @click.prevent="print" class="print">
      Печатать списки подарков
    </button>
    <div class="print-area">
      <div class="gift-sticker" v-for="(sticker, i) in giftsStickers" :key="i">
        <h2>{{ sticker.shop }}</h2>
        <ul type="1">
          <li v-for="(employee, i) in sticker.employees" :key="'employee-' + i">
            <p>{{ i + 1 }}</p>
            <p class="name">{{ employee.name }}</p>
            <p class="kids">Дети до 14 лет: {{ employee.kids }}</p>
          </li>
        </ul>
        <div class="gift-sticker__info">
          <p>
            Если некорректно указано количество детей, необходимо предоставить в
            отдел кадров свидетельство о рождении ребёнка.
          </p>
          <p>
            Если в списке некорректно указаны сотрудники салона, значит после
            формирования списка произошли перестановки.
          </p>
          <p>
            Обо всех неточностях просьба сообщать на почту Артему Афонину -
            afonin.a@artis21.ru
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  methods: {
    print() {
      window.print();
    },
  },
  computed: {
    giftsStickers() {
      return this.$store.getters.getReportsData.length
        ? this.$store.getters.getReportsData.map((el) => {
            return { shop: el.shop, employees: el.employeeList };
          })
        : [{ name: "Нет информации", kids: 0 }];
    },
  },
};
</script>

<style lang="scss" scoped>
.print-area {
  max-width: 2450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: none;
  .gift-sticker {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ul {
      li {
        width: 80%;
        display: grid;
        grid-template-columns: 20px 1fr 1fr;
        gap: 30px;
        p {
          width: max-content;
        }
        .name {
          justify-self: left;
        }
        .kids {
          justify-self: right;
        }
      }
    }
    .gift-sticker__info {
      justify-self: flex-end;
    }
  }
}

// .sticker-body {
//   width: 210mm;
//   height: 297mm;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin: 0 auto;
//   border: 1px solid #000;
// }
@media print {
  @page {
    // width: 21cm;
    // height: 29.7cm;
    // margin: 0;
    // page-break-after: always;
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
    display: block;
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
    .gift-sticker {
      page-break-after: always;
    }
  }
}
</style>