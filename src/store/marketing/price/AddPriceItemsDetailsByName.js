export default {
  actions: {
    addPriceItemsDetailsByName(context, data) {
      // console.log(data);
      const seriesAbbrs = {
        // ам: "амелия",
        бг: "берген",
        бр: "барселона",
        гр: "гранада",
        ел: "елизавета",
        ив: "ивиса",
        лз: "лозанна",
        мр: "марбелья",
        тл: "толедо",
        нр: "норден",
        рв: "равенна",
        ч0: "челси",
        эл: "элика",
        эы: "елизавета",
        виспер: "матрасы, наматрасники",
        монтис: "матрасы, наматрасники",
        андер: "матрасы, наматрасники",
        боненти: "матрасы, наматрасники",
        манс: "матрасы, наматрасники",
        скай: "матрасы, наматрасники",
        франк: "матрасы, наматрасники",
      };
      const series = [
        // "Амелия",
        "Барселона",
        "Берген",
        "Гранада",
        "Хелин",
        "Луара",
        "Елизавета 5",
        "Елизавета 7",
        "Рейн",
        "Рона",
        "Кади",
        "Верде",
        "Ивиса",
        "Ивиса 2",
        "Лозанна",
        "Лозанна 2",
        "Марбелья",
        "Норден",
        "Равенна",
        "Челси",
        "Толедо",
        "Элика 02",
      ];
      const colors = [
        "американский орех",
        "бьянко",
        "венге",
        "графит",
        "дуб",
        "дуб белый",
        "кашемир",
        "лино",
        "лиственница",
        "дуб сонома",
        "тауп",
        "ясень",
      ];
      const types = [
        "Шкаф",
        "Дверь",
        "Фасад",
        "Пуф",
        "Тумба",
        "Диван",
        "Кровать",
        "Стол",
        "Зеркало",
        "Основание",
        "Крышка",
        "Полка",
        "Комод",
        "Панель",
        // "Комплект фасадов",
        // "К-т фасадов",
        "Фасад",
        "Комплект дверей",
        "К-т дверей",
        "Стеллаж",
        "Витрина",
        "Матрас",
        "Чехол",
        "Каркас",
        "Антресоль",
      ];
      // const glass = ["Риф", "Тон", "Спарк"];
      const price = JSON.parse(localStorage.getItem("price"));
      const furnitureDetailsFromDB = [];
      let currentSeries = null;
      Array.from(data).forEach((detail) => {
        if (series.includes(detail.detail)) {
          currentSeries = detail.detail.toLowerCase();
        }
        if (detail.code) {
          //colors
          const thisColors = [];
          colors.forEach((color) => {
            if (detail.detail.toLowerCase().includes(color.toLowerCase())) {
              thisColors.push(color);
            }
          });
          if (
            thisColors.includes("дуб") &&
            (thisColors.includes("дуб белый") ||
              thisColors.includes("дуб сонома"))
          ) {
            const oakIndex = thisColors.indexOf("дуб");
            thisColors.splice(oakIndex, 1);
          }
          //furniture type
          let thisType = null;
          types.forEach((type) => {
            if (detail.detail.toLowerCase().includes(type.toLowerCase())) {
              thisType = type;
            }
          });
          //nums
          const nums = detail.detail
            .toLowerCase()
            .split(" ")[1]
            .split("-" || ",");
          furnitureDetailsFromDB.push({
            name: detail.detail,
            code: detail.code,
            price: detail.price,
            colors: thisColors,
            type: thisType,
            series: currentSeries,
            nums: nums,
          });
        }
      });
      //sorting options by series and types
      furnitureDetailsFromDB
        .filter((el) => el.series === "Дополнительные опции")
        .forEach((opt) => {
          if (opt.name.match(/\(?Ел.?5/)) {
            opt.series = "Елизавета 5, Дополнительные опции";
          }
          if (opt.name.match(/\(?Ел.?7/)) {
            opt.series = "Елизавета 7, Дополнительные опции";
          }
          if (opt.name.match(/\(?Гр/)) {
            opt.series = "Гранада, Дополнительные опции";
          }
          if (opt.name.match(/\(?Ив.?1/)) {
            opt.series = "Ивиса, Дополнительные опции";
          }
          if (opt.name.match(/\(?Ив.?2/)) {
            opt.series = "Ивиса 2, Дополнительные опции";
          }
          if (opt.name.match(/\(?Ч0/i)) {
            opt.series = "Челси, Дополнительные опции";
          }
          if (opt.name.match(/\(?Лз.?2/)) {
            opt.series = "Лозанна 2, Дополнительные опции";
          }
          if (opt.name.match(/\(?Эл.?02/)) {
            opt.series = "Элика 02, Дополнительные опции";
          }
          if (opt.name.includes("атрас")) {
            opt.series = "Матрасы, Дополнительные опции";
            opt.type = "Матрасы, наматрасники";
          }
        });

      const bergen = furnitureDetailsFromDB.filter((el) =>
        el.series.toLowerCase().includes("берген")
      );
      // const barselona = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("барселона")
      // );
      // const granada = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("гранада")
      // );
      // const elisaveta = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("елизавета")
      // );
      // const ivisa = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("ивиса")
      // );
      // const losanna = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("лозанна")
      // );
      // const marbella = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("марбелья")
      // );
      // const toledo = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("толедо")
      // );
      // const norden = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("норден")
      // );
      // const ravenna = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("равенна")
      // );
      // const chelsea = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("челси")
      // );
      // const elica = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("элика")
      // );
      // const mattress = furnitureDetailsFromDB.filter((el) =>
      //   el.series.toLowerCase().includes("матрас")
      // );

      const strangeNames = [];
      const normNames = [];
      [...new Set(price)].forEach((item) => {
        if (item.name.toLowerCase().match(/[а-я]+\d/g)) {
          //get standart name with dot ↓
          let cutSeries = item.name.toLowerCase().match(/[а-я]+/)[0];
          if (cutSeries === "ч") cutSeries = item.name.toLowerCase();
          const cutNums = item.name.toLowerCase().split(cutSeries)[1];
          const dotName = `${cutSeries}.${cutNums}`;
          //get series ↓
          let series = item.name.toLowerCase().match(/[а-я]+/)[0];
          if (series === "ч") series += "0";
          if (seriesAbbrs[series]) {
            series = seriesAbbrs[series];
            // const nums = item.name.match(/\d+|\d[а-я]+/g);
            const nums = cutNums.toLowerCase().split("-" || ",");
            normNames.push({
              name: dotName,
              series: series,
              nums: nums,
              details: [],
            });
          }
        } else {
          strangeNames.push(item.name);
        }
      });
      // console.log(normNames);
      // console.log(strangeNames);
      // console.log(seriesAbbrs);

      //bergen
      normNames
        .filter((s) => s.series === "берген")
        .forEach((item) => {
          if (item.nums) {
            bergen.forEach((detail) => {
              detail.nums
                .filter((n) => n != "1")
                .forEach((num) => {
                  if (
                    item.nums.includes(num) &&
                    !item.details.includes(detail)
                  ) {
                    item.details.push(detail);
                  }
                });
            });
          } else console.log(item);
        });
      console.log(normNames);
      console.log(furnitureDetailsFromDB);
      // normNames.filter(item => item.details).forEach(item => {
      //   // const regTypes = [];
      //   // item.details.forEach(detail => {

      //   // })
      // })
    },
  },
};
