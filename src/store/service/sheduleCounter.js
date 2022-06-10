export default function workDayOrNot(
	sheduleStart,
	sheduleType,
	sheduleShift,
	currDate
) {
	// console.log("sheduleStart:", sheduleStart, "sheduleType:", sheduleType, "sheduleShift:", sheduleShift, "currDate:", currDate);
  const conditionalStartDate = "2022-04-01T00:00"
	// if (sheduleStart && sheduleType && currDate) {
	if ((sheduleType, currDate)) {
		const currYear = new Date(currDate).getFullYear().toString();

		const currMonth =
			Number(new Date(currDate).getMonth()) + 1 < 10
				? `0${Number(new Date(currDate).getMonth()) + 1}`
				: Number(new Date(currDate).getMonth()) + 1;

		const currDayOfMonth =
			new Date(currDate).getDate().toString().length == 1
				? `0${new Date(currDate).getDate().toString()}`
				: new Date(currDate).getDate().toString();

		const formattedCurrDate = `${currYear}-${currMonth}-${currDayOfMonth}T00:00`;
		const day = 24 * 60 * 60 * 1000;

		if (
			sheduleStart &&
			sheduleType === "3/3" &&
			formattedCurrDate >= sheduleStart
		) {
			const start = `${sheduleStart}T00:00`;
			const daysGone33 = (new Date(formattedCurrDate) - new Date(start)) / day;
			return daysGone33 % 6 < 3 ? "X" : null;
		}

		if (sheduleType === "2/2/3" && sheduleShift) {
      // console.log("formattedCurrDate", formattedCurrDate)
      // console.log("conditionalStartDate", conditionalStartDate)
			const daysGone223 =
				(new Date(formattedCurrDate) - new Date(conditionalStartDate)) /
				day;
        // console.log(`DAYS_GONE_223: ${daysGone223}`)
        // console.log(daysGone223 % 14)
			return [0, 1, 2, 5, 6, 10, 11].includes(Number(daysGone223 % 14))
				? sheduleShift === "1"
					? "X"
					: null
				: sheduleShift === "2"
				? "X"
				: null;
		}
	}
}
