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
    // console.log(test) 
    if (currCarID === "1654776335071") {
      const test = filterdExtras.filter((e) => new Date(e.day).toLocaleDateString() === new Date(currDate).toLocaleDateString())
      // Array.from(filterdExtras).forEach(e => console.log(new Date(e.day).toLocaleDateString(), new Date(currDate).toLocaleDateString()))
      console.log(test)
    }
	return filterdExtras
		? filterdExtras.filter((e) => new Date(e.day).toLocaleDateString() === new Date(currDate).toLocaleDateString())
				.length
			? filterdExtras.filter(
					(e) => new Date(e.day).toLocaleDateString() === new Date(currDate).toLocaleDateString()
			  )[0].cut
			: sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate)
		: sheduleCounter(sheduleStart, sheduleType, sheduleShift, currDate);
};
