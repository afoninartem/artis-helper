<template>
  <div class="client-payments">
    <input type="file" name="input" id="input" @change="loadXML" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      xmlData: null,
    };
  },
  methods: {
    loadXML() {
      const convert = require("xml-js");
      event.preventDefault();
      var selectedFile = document.getElementById("input").files[0];
      // console.log(selectedFile);
      var reader = new FileReader();
      reader.onload = function (e) {
        const temp = e.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(temp, "application/xml");
        console.log(doc);
        const result = convert.xml2json(temp, { compact: true, spaces: 2 });
        // localStorage.setItem("XMLtest", result)
        const parsed = JSON.parse(result);

        const formatted = parsed.Export.Docs.Doc.map((o) => ({
          Дата: o.Data._text,
          "Номер документа": o.Number._text,
          "Статус документа": o.StatusDoc._text,
          "Тип документа": o.DocType._text,
          Сумма: o.Summ._text,
          "Дата заявки": o.ZayavkaDate._text,
          "Номер заявки": o.ZayavkaNumber._text,
          "ID заявки": o.ZayavkaUID._text,
        }));
        localStorage.setItem("XMLtest", JSON.stringify(formatted))
      };
      reader.readAsText(selectedFile, `windows-1251`);
    },
  },
};
</script>