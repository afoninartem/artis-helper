<template>
  <div class="cards-and-stickers">
    <h1>Визитки и наклейки</h1>
    <xlsx-workbook v-if="table">
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Визитки и наклейки.xlsx">
        <button>Скачать</button>
      </xlsx-download>
    </xlsx-workbook>
    <table v-if="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Салон</th>
          <th>Email</th>
          <th>Визитки</th>
          <th>Наклейки</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(shop, i) in table.data"
          :key="i"
        >
          <td>{{ i + 1 }}</td>
          <td>{{ shop.name }}</td>
          <td>{{ shop.email }}</td>
          <td>{{ shop.cards }}</td>
          <td>{{ shop.stickers }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td>ИТОГО</td>
          <td></td>
          <td>{{ table.totalCards }}</td>
          <td>{{ table.totalStickers }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { db } from "../../main";
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      shopsInfo: [],
      tableData: null,
      url: {
        sheet:
          "https://docs.google.com/spreadsheets/d/1g7KnCSLXkzBJbAwDC9bs9Ea5IsfoYL5nBV2OC-lWLtQ/edit#gid=0",
        macros:
          "https://script.google.com/macros/s/AKfycbxaExGPg3oWpQm49Y08nzWNxU8Qp0-jgQkCbtZ6ckuUMl4d39BNhWg5j6iOrFAjV11SUQ/exec",
      },
    };
  },
  computed: {
    sheets() {
      if (this.table) {
        const tablePrint = Array.from(this.table.data);
        tablePrint.push({
          name: "ИТОГО",
          cards: this.table.totalCards,
          stickers: this.table.totalStickers,
        });
        return {
          sheets: {
            name: "Визитки и наклейки",
            data: tablePrint.map((shop, i) => {
              return {
                "#": shop.name === "ИТОГО" ? "" : i + 1,
                Салон: shop.name,
                Email: shop.email,
                Визитки: shop.cards,
                Наклейки: shop.stickers,
              };
            }),
          },
        };
      } else {
        return null;
      }
    },
    table() {
      if (this.shopsInfo.length && this.tableData) {
        const result = [];
        let totalCards = 0,
          totalStickers = 0;
        this.tableData.forEach((td) => {
          td.email = td.email.split("/").join("."); //из-за дебилов, которые пишут @artis21/ru
          if (this.shopsInfo.some((shop) => shop.email === td.email)) {
            td.name = this.shopsInfo.filter(
              (shop) => shop.email === td.email
            )[0].name;
            result.push(td);
            totalCards += Number(td.cards);
            totalStickers += Number(td.stickers);
          } else {
            alert("В справочнике салонов нет салона с email " + td.email);
          }
        });
        result.sort((a, b) => a.name.localeCompare(b.name));
        return {
          data: result,
          totalCards,
          totalStickers,
        };
      } else {
        return null;
      }
    },
  },
  mounted: async function () {
    //get shops data from firebase
    await db
      .collection("shops")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.shopsInfo.push({
            name: doc.data().name,
            email: doc.data().email,
          });
        });
      });
    //get orders data from gs
    fetch(this.url.macros)
      .then((res) => res.json())
      .then((data) => {
        data.shift();
        this.tableData = data
          .filter((el) => !el.every((item) => item === ""))
          .map((item) => {
            return {
              email: item[0],
              cards: item[1] === "" ? 0 : item[1],
              stickers: item[2] === "" ? 0 : item[2],
            };
          });
      });
  },
};
</script>

<style lang="scss" >
@import "@/scss/personalTable.scss";
@include personal-table;
tfoot {
  font-weight: bold;
}
</style>