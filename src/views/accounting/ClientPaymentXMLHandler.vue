<template>
  <div class="client-payments">
    <label for="input">Клиенты</label>
    <input
      type="file"
      name="inputClients"
      id="inputClients"
      @change="loadClients"
      multiple
    />
    <label for="input">Оплата</label>
    <input
      type="file"
      name="inputPayments"
      id="inputPayments"
      @change="loadPayments"
      multiple
    />
    <div class="info">
      <p class="info__payments" v-if="paymentFiles > 0">
        Обработано {{ payments.length.toLocaleString() }} записей из
        {{ paymentFiles }} {{ casesHandler(paymentFiles, "файл") }} по плетажам
      </p>
      <p class="info__payments" v-if="clientFiles > 0">
        Обработано файлов по клиентам: {{ clients.length.toLocaleString() }}
      </p>
    </div>
    <button @click.prevent="setClientsToLocalStorage">
      Записать клиентов в localStorage
    </button>
    <button @click.prevent="setPaymentsToLocalStorage">
      Записать платежи в localStorage
    </button>
    <button @click.prevent="setCompositeDateToLocalStorage">
      Записать платежи в localStorage
    </button>
    <xlsx-workbook>
      <xlsx-sheet
        :collection="sheet.data"
        v-for="sheet in sheets"
        :key="sheet.name"
        :sheet-name="sheet.name"
      />
      <xlsx-download filename="Итог по фискальному регистру из 1С.xlsx">
        <button @click.prevent="addSheets">Получить детализацию в xlsx</button>
      </xlsx-download>
    </xlsx-workbook>
  </div>
</template>

<script>
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
      sheets: [],
      paymentFiles: 0,
      clientFiles: 0,
      loadedClientFiles: null,
      clientsData: null,
      paymentData: null,
      clientsDataMapped: null,
    };
  },
  watch: {
    paymentData() {
      const clientsData = this.clientsData;
      // const clientsDataMapped = clientsData.map(c => c[UID_Заявки]);

      const paymentData = this.paymentData;
      paymentData.forEach((p) => {
        if (this.clientsDataMapped.includes(p["UID_Заявки"])) {
          const clients = clientsData.filter(
            (c) => c["UID_Заявки"] === p["UID_Заявки"]
          );
          clients.map((client) => Object.assign(client, p));
        }
      });
      localStorage.setItem("XMLClients", JSON.stringify(this.clientsData));
    },
  },
  methods: {
    addSheets() {
      this.sheets.push({
        name: "Клиенты",
        data: this.clientsData
      });
    },
    async setPaymentData(data) {
      this.paymentData = data;
    },
    async setClientsToLocalStorage() {
      // return await this.$store.dispatch("setClientsInDB");
      console.log(
        this.clientsData.every((obj) => Object.keys(obj).length) === 12
      );
    },
    async setPaymentsToLocalStorage() {
      return await this.$store.dispatch("setPaymentsInDB");
    },
    async loadPayments() {
      const element = this;
      event.preventDefault();
      Array.from(document.getElementById("inputPayments").files).forEach(
        (selectedFile) => {
          var reader = new FileReader();
          reader.onload = function (e) {
            const temp = e.target.result;
            element.$store.dispatch("setPaymentXMLData", temp);
            element.paymentFiles += 1;
          };
          reader.readAsText(selectedFile, `windows-1251`);
        }
      );
    },
    async loadClients() {
      const element = this;
      event.preventDefault();
      element.loadedClientFiles = Array.from(
        document.getElementById("inputClients").files
      ).length;
      Array.from(document.getElementById("inputClients").files).forEach(
        (selectedFile) => {
          var reader = new FileReader();
          reader.onload = function (e) {
            const temp = e.target.result;
            element.$store.dispatch("setClientsXMLData", temp);
            element.clientFiles += 1;
          };
          reader.readAsText(selectedFile, `windows-1251`);
        }
      );
    },
    casesHandler(num, word) {
      const ch = require("../../store/casesHandler");
      return ch(num, word);
    },
  },
  computed: {
    payments() {
      this.setPaymentData(this.$store.getters.getPaymentData);
      return this.$store.getters.getPaymentData;
    },
    clients() {
      return this.$store.getters.getClientsData;
    },
  },
  mounted: async function () {
    // const data = JSON.parse(localStorage.getItem("XMLClients"));
    // data.forEach((d) => this.$store.commit("setClientsXMLData", d));
    this.clientsData = JSON.parse(localStorage.getItem("XMLClients"));
    this.clientsDataMapped = this.clientsData.map((c) => c["UID_Заявки"]);
    console.log(this.clientsData.map((c) => Object.keys(c).length));
  },
};
</script>