<template>
  <div class="bg-markers">
    <h1>Маркировка отгружаемых позиций цветом</h1>
    <div class="bg-markers__content">
      <form action="">
        <input
          type="text"
          name="material"
          id="material"
          placeholder="Копия из 1С"
          v-model="marker.material"
        />
        <input type="color" name="color" id="color" v-model="marker.color" />
        <button @click.prevent="setMarker">Добавить маркировку</button>
      </form>
    </div>
    <div class="bg-markers__example">
      <h3>ОБРАЗЕЦ:</h3>
      <table>
        <TableHeader />
        <tbody>
          <tr v-for="(shop, i) in shipment" :key="i">
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              {{ i + 1 }}
            </td>
            <td
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
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">
                {{ shop.thickCatalog ? shop.thickCatalog : null }}
              </span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
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
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.notebook }}</span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.cup }}</span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.pack }}</span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.folder }}</span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.towel }}</span>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <span class="yellow tablepart">{{ shop.vine }}</span>
            </td>

            <td
              class="other-mats"
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <p
                :style="{
                  color: mat.quan ? `#000` : `red`,
                  fontWeight: mat.quan ? `normal` : `bold`,
                }"
                v-for="(mat, i) in shop.otherMats"
                :key="i"
              >
                {{ mat.quan ? `${mat.name} - ${mat.quan}` : `${mat.name}` }}
              </p>
              <p
                v-if="marker.material.length > 0"
                :style="{ background: marker.color }"
              >
                {{ marker.material }} - 1
              </p>
              <p v-for="(sample, i) in shop.samples" :key="'sample-' + i">
                {{ `${sample.name} - ${sample.quan}` }}
              </p>
            </td>
            <td
              class="boxes"
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
              }"
            >
              <p
                class="user-boxes"
                style="font-size: 16px; font-weight: bold"
              ></p>
            </td>
            <td
              :style="{
                background: shop.name.includes('РЕКЛАМАЦИИ')
                  ? shop.shopBG
                  : '#fff',
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
        </tbody>
      </table>
    </div>
    <div class="markers-list" v-if="markers">
      <h3>Действующие маркировки</h3>
      <div class="markers-list__item" v-for="(marker, m) in markers" :key="m">
        <p :style="{ background: marker.color }">
          {{ marker.material }} - {{ marker.color }}
        </p>
        <button @click.prevent="deleteMarker(marker.id)">Удалить</button>
      </div>
    </div>
    <p v-if="!markers">Действующих маркировок нет</p>
  </div>
</template>

<script>
import TableHeader from "@/components/WarehouseComponents/TableHeader";
export default {
  components: {
    TableHeader,
  },
  data() {
    return {
      marker: {
        material: "",
        color: "",
      },
      example: {
        name: "Сергиев Град (г.Сергиев Посад)",
        materials: [
          { name: "Шоколад с логотипом 5 гр.", numQuan: 250 },
          { name: "Кофе Jacobs Monarch 150гр. ( Растворимый )", numQuan: 2 },
          { name: "Чай Гринфилд черный ( 100шт. в уп. )", numQuan: 1 },
          // { name: "Чай Гринфилд зелёный ( 100шт. в уп. )", numQuan: 1 },
        ],
        orders: [{ name: "Рекламация Р-00437 (11.08.2022)", comment: null }],
        region: "_0_moscow",
        otherMats: [
          { name: "Шоколад с логотипом 5 гр.", quan: 250 },
          { name: "Кофе Jacobs Monarch 150гр. ( Растворимый )", quan: 2 },
          { name: "Чай Гринфилд черный ( 100шт. в уп. )", quan: 1 },
          // { name: "Чай Гринфилд зелёный ( 100шт. в уп. )", quan: 1 },
        ],
        car: "543",
        carBG: "#FFFFFF",
        textColor: "#000000",
        shipmentTerms: "regular",
        shopBG: "#ffffff",
      },
    };
  },
  methods: {
    async setMarker() {
      const newMarker = {
        material: this.marker.material,
        color: this.marker.color,
        id: Date.now().toString(),
      };
      if (this.markers.map((m) => m.material).includes(newMarker.material)) {
        const actualColor = this.markers.filter(
          (m) => m.material === newMarker.material
        )[0].color;
        return alert(
          `Материал ${newMarker.material} уже промаркирован цветом ${actualColor}. Чтобы заменить цвет на ${newMarker.color} удалите маркировку этого материала и создайте заново.`
        );
      }
      await this.$store.dispatch("setMarker", newMarker);
      await this.$store.dispatch("updateMarkersDate");
      return await this.$store.dispatch("setActualMarkers");
    },
    async deleteMarker(id) {
      await this.$store.dispatch("deleteMarker", id);
      await this.$store.dispatch("updateMarkersDate");
      return await this.$store.dispatch("setActualMarkers");
    },
  },
  computed: {
    shipment() {
      return [this.example];
    },
    markers() {
      return this.$store.getters.getActualStates.markers;
    },
  },
  mounted: async function () {
    await this.$store.dispatch("setActualMarkers");
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/shipmentTable.scss";
@include shipment-table;
.bg-markers {
  .bg-markers__content {
    width: 50%;
    margin: 0 auto;
    form {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      input[type="text"] {
        width: 500px;
      }
    }
  }
  .bg-markers__example {
    margin-top: 50px;
  }
  .markers-list {
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    h3 {
      grid-column: 1/4;
    }
    .markers-list__item {
      border: 1px solid black;
      display: flex;
      flex-direction: column;
      &:hover {
        transform: scale(1.01);
      }
      p {
        margin: 0;
        padding: 5px;
      }
      button {
        appearance: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        font-size: 16px;
        &:hover {
          background: rgb(240, 136, 136);
        }
      }
    }
  }
}
</style>

