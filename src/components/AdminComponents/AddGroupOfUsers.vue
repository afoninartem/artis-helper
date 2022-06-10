<template>
  <section class="add-group-of-users">
    <form class="add-group-of-users__form">
      <h2>Добавить группу пользователей</h2>
      <input type="file" @change="onChange" />
      <xlsx-read :file="file">
        <xlsx-json>
          <template #default="{ collection }">
            <div style="display: none">
              {{ setGroupOfUsers(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </form>
    <button @click.prevent="createRetail">Создать юзеров для розницы</button>
    <button @click.prevent="checkUniq">Check uniquity</button>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download>
        <button @click.prevent="addSheets">Получить детализацию в xlsx</button>
      </xlsx-download>
    </xlsx-workbook>
  </section>
</template>

<script>
import {
  XlsxRead,
  XlsxJson,
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx/dist/vue-xlsx.es";

import password from "../../store/passGen";
export default {
  components: {
    XlsxRead,
    XlsxJson,
    XlsxDownload,
    XlsxSheet,
    XlsxWorkbook,
  },
  data() {
    return {
      file: null,
      shops: [],
      passwords: [],
      sheets: [],
    };
  },
  created: async function () {
    await this.$store.dispatch("setActualShops");
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    addSheets() {
      if (this.shops.length) {
        this.sheets.push({
          name: "Пароли для ФС",
          data: this.shops,
        });
      }
    },
    checkUniq() {
      const set = new Set(this.passwords);
      console.log(set);
      return set.length === this.passwords.length;
    },
    createRetail() {
      const shops = this.$store.getters.getActualStates.shops;
      shops.forEach((shop) => {
        shop.password = password();
        // console.log(shop, shop.password);
        this.shops.push(shop);
        this.passwords.push(shop.password);
      });
    },
    setGroupOfUsers(data) {
      console.log("method setGroupOfUsers is running ");
      if (data) {
        //format to standart form and add to firestore users collection
        Array.from(data).forEach((user) => {
          const newShop = {
            email: user.email,
            password: user.password,
            group: "retail",
          };
          try {
            this.$store.dispatch("createUser", newShop);
          } catch (error) {
            console.log(error.message);
          }
        });
      }
    },
  },
};
</script>