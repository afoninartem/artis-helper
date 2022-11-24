<template>
  <form class="xml-sales-report">
    <label for="xml-sales-report">Загрузить xml</label>
    <input
      type="file"
      name="xml-sales-report"
      id="xml-sales-report"
      @change="onChangeXmlSalesReport"
    >
  </form>
</template>

<script>
export default {
  methods: {
    onChangeXmlSalesReport(e) {
      const element = this;
      var files = e.target.files;
      var reader = new FileReader();
      reader.onload = function () {
        var parsed = new DOMParser().parseFromString(this.result, "text/xml");
        element.$store.dispatch("setSellingData", parsed);
      };
      reader.readAsText(files[0], `windows-1251`);
    },
  },
};
</script>