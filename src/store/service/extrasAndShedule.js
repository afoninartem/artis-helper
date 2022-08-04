import sheduleCounter from "./sheduleCounter";
export default (
	sheduleStart,
	sheduleType,
	sheduleShift,
	currDate,
	extras,
	currCarID
) => {
	const filterdExtras = extras
		? extras.filter((e) => {
				if (e.cut === `Р` && e.carID !== currCarID) return false;
				return true;
		  })
		: null;
	return filterdExtras
		? filterdExtras.filter((e) => e.day == new Date(currDate).toISOString())
				.length
			? filterdExtras.filter(
					(e) => e.day == new Date(currDate).toISOString()
			  )[0].cut
			: sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate)
		: sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate);
};
