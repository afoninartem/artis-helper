import { db } from "../main";
export default () => {
  const colors = [];
  const colorNN = `rgba(0, 128, 0, 0.4)`;
  const colorSPB = `rgba(245, 161, 15, 0.4)`;

  db.collection("warehouse/shipment/carsColors")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        colors.push({ color: doc.data().color, dark: doc.data().dark });
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return { colorsMain: colors, colorNN, colorSPB };
};
