
export default function (date, extras = [], currCarID) {
	//styles will be store in other place

	const weekendStyle = "background: rgba(225, 100, 100, 0.3)";
	const todayStyle = "border: 2px solid blue";
	// if (extras) console.log(extras);
	// const selectedStyle = "background: rgba(0, 0, 255, 0.1)";
	// ↑
	const stylesArray = [];
	const styleDivider = "; ";
	//define terms data ↓
	const today = new Date().getDate();
	const cellday = new Date(date).getDate();
	const weekday = date.toLocaleString("default", { weekday: "short" });
	//define terms itself
	if (today === cellday) stylesArray.push(todayStyle);
	if (weekday === "сб" || weekday === "вс") stylesArray.push(weekendStyle);
	Array.from(extras).filter(e => {
    if (e.cut === `Р` && e.carID !== currCarID) return false;
    return true
  }).forEach((extra) => {
		if (new Date(date).toLocaleDateString() == extra.day) {
			stylesArray.push(`background: ${extra.bgColor}`);
		}
	});
  console.log(stylesArray)
	return stylesArray.join(styleDivider);
}
