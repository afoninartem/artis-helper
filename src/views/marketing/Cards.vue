<template>
  <section class="cards">
    <table v-if="checkOrders">
      <tr>
        <th>ФС</th>
        <th>email</th>
        <th>Изменения</th>
        <th>Визитки</th>
        <th>Наклейки</th>
      </tr>
      <tr v-for="order in getShopsInfo" :key="order.email">
        <td>{{ order.name }}</td>
        <td>{{ order.email }}</td>
        <td>{{ order.change ? order.change : "-" }}</td>
        <td>{{ order.cards }}</td>
        <td>{{ order.stickers }}</td>
      </tr>
    </table>
    <DownloadXLSX />
  </section>
</template>

<script>
import DownloadXLSX from "@/components/DownloadXLSX.vue"
export default {
  components: {
    DownloadXLSX
  },
  data() {
    return {};
  },
  methods: {
    download() {},
  },
  computed: {
    checkOrders() {
      return localStorage.getItem("cards");
    },
    getShopsInfo() {
      return this.$store.getters.getShopsInfo;
    },
  },
  mounted: function () {
    const orders = JSON.parse(localStorage.getItem("cards"));
    for (let order in orders) {
      const email = orders[order].email;
      const change = orders[order].change;
      const cards = orders[order].cards;
      const stickers = orders[order].stickers;

      this.$store.dispatch("getShopDataFromDB", {
        email,
        change,
        cards,
        stickers,
      });
    }
  },
  created: function () {
    (function () {
      const url =
        "https://script.google.com/macros/s/AKfycbx170WoVVdPQ462Jy4BHGb4QXZXS5SQp-CO-M57_2Mm45RhKfU_ucPtMn8ieicOAmVO/exec";

      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
          try {
            localStorage.setItem("cards", xhr.responseText);
          } catch (e) {
            console.log("Не удалось загрузить данные из GD");
          }
        }
      };
      xhr.send();
    })();
  },
  destroyed: function() {
    this.$store.commit("cleanShopInfo")
  }
};
</script>

<style lang="scss" scoped>
table {
  overflow: hidden;
  border: 1px solid #d3d3d3;
  background: #fefefe;
  width: 70%;
  margin: 5% auto 0;
  -moz-border-radius: 5px; /* FF1+ */
  -webkit-border-radius: 5px; /* Saf3-4 */
  border-radius: 5px;
  // -moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  // -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

th,
td {
  padding: 18px 28px 18px;
  text-align: center;
}

th {
  padding-top: 22px;
  text-shadow: 1px 1px 1px #fff;
  background: #e8eaeb;
}

td {
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
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