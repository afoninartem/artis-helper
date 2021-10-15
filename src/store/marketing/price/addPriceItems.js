// import { db } from "../../../main";
export default {
  actions: {
    addPriceItems(context, data) {
      // Array.from(data).forEach((furniture) => {
      //   const name = furniture.item;
      //   db.collection("marketing/price/priceItems")
      //     .doc(name.split("/").join(' '))
      //     .set({ name: name, detais: [] });
      // });
      const price = [];
      Array.from(data).forEach(furniture => {
        const name = furniture.item;
        const nums = furniture.item.match(/\d+/g)
        price.push({name: name, nums: nums, details: [], fullprice: []})
      })
      localStorage.setItem("price", JSON.stringify(price))
    },
  },
};
