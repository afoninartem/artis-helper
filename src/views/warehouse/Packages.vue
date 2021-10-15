<template>
  <section class="packages">
    <h1>Количество материалов в упаковке</h1>
    <form action="">
      <div class="packages__item" v-for="pack in this.packages" :key="pack.id">
        <label class="label" :for="pack.id">{{ pack.name }}</label>
        <input
          type="number"
          :name="pack.id"
          :id="pack.id"
          v-model="pack.quan"
          @change="update"
        />
      </div>
    </form>
  </section>
</template>

<script>
import { db } from "../../main";
export default {
  data() {
    return {
      packages: null,
    };
  },
  methods: {
    async update(event) {
      this.packages.forEach((el) => {
        if (el.id === event.target.id) {
          el.quan = event.target.value;
          db.collection("warehouse/shipment/packages")
            .doc(el.name)
            .update({ quan: +el.quan });
        }
      });
    },
  },
  created: async function () {
    const rawPack = await db.collection("warehouse/shipment/packages").get();
    this.packages = rawPack.docs.map((doc) => doc.data());
  },
};
</script>

<style lang="scss" scoped>
form {
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: max-content;
  margin: 0 auto;
  .packages__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: max-content;
    margin: 0 auto;
    label {
      text-align: right;
    }
    input {
      width: 50px;
      text-align: center;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>


      <!-- <label for="thickCatMsc">Каталог АРТИС 80 полос (48 часов)</label>
      <input type="number" name="thickCatMsc" id="thickCatMsc" v-model="this.packages.thickCatMsc.quan"/>
      <label for="thickCatReg">Каталог АРТИС 80 полос (Регионы)</label>
      <input type="number" name="thickCatReg" id="thickCatReg" />
      <label for="thinCatMsc">Каталог АРТИС 20 полос (48 часов) ТОНКИЙ</label>
      <input type="number" name="thinCatMsc" id="thinCatMsc" />
      <label for="thinCatReg">Каталог АРТИС 20 полос (Регионы) ТОНКИЙ</label>
      <input type="number" name="thinCatReg" id="thinCatReg" />
      <label for="notebook">Блокнот Корпоративный А5</label>
      <input type="number" name="notebook" id="notebook" />
      <label for="folder">Папка картонная А4 для клиентов</label>
      <input type="number" name="folder" id="folder" />
      <label for="pen">Ручка шариковая с логотипом</label>
      <input type="number" name="pen" id="pen" />
      <label for="choco5">Шоколад с логотипом 5 гр.</label>
      <input type="number" name="choco5" id="choco5" />
      <label for="discountCards">Дисконтные карты</label>
      <input type="number" name="discountCards" id="discountCards" />
      <label for="50x50">Образцы 50х50</label>
      <input type="number" name="50x50" id="50x50" /> -->