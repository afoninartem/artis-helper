//COMMON CONVERTATIONS ↓
const getFullDate = (date) => {
	const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	const month =
		date.getMonth() + 1 < 10
			? "0" + (date.getMonth() + 1)
			: date.getMonth() + 1;
	const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
//COMMON CONVERTATIONS ↑

const convertFiscalDate = (val) => {
	return val.split(" ")[0];
};

const convertOnlineDate = (val) => {
	const convertedDateTime = new Date(val);
  return getFullDate(convertedDateTime)
};

const convertPaylinksDate = (val) => {
	return val
		.split(" ")[0]
		.split(".")
		.reverse()
		.join(".");
};

// const convertTaxcomDate = (val) => {
// 	const convertedDateTime = new Date(Math.round((val - 25569) * 86400 * 1000));
// 	const day =
// 		convertedDateTime.getDate() < 10
// 			? "0" + convertedDateTime.getDate()
// 			: convertedDateTime.getDate();
// 	const month =
// 		convertedDateTime.getMonth() + 1 < 10
// 			? "0" + (convertedDateTime.getMonth() + 1)
// 			: convertedDateTime.getMonth() + 1;
// 	const year = convertedDateTime.getFullYear();
// 	return `${day}.${month}.${year}`;
// };

const excelDateToJSDate = (serial) => {
	const utc_days = Math.floor(serial - 25569);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);
  // console.log(date_info)
  // console.log(getFullDate(date_info))
	// const fractional_day = serial - Math.floor(serial) + 0.0000001;

	// let total_seconds = Math.floor(86400 * fractional_day);

	// const seconds = total_seconds % 60;

	// total_seconds -= seconds;

	// const hours = Math.floor(total_seconds / (60 * 60));
	// const minutes = Math.floor(total_seconds / 60) % 60;
  // console.log({h: hours, m: minutes, s: seconds})
  return getFullDate(date_info)
};

const dateTime = (str) => {
  if (!str) return null
	const time = str.split("T")[1];
	const date = new Date(str);
	return `${getFullDate(date)} ${time}`;
};

const localeStringToReadableFormat = (str) => {
  const arr = str.split(" ");
  const date = new Date(arr[0]).toLocaleDateString();
  const time = arr[1].substring(0, 5)
  return `${date} ${time}`
}

module.exports = {
	convertFiscalDate,
	// convertTaxcomDate,
	convertPaylinksDate,
	convertOnlineDate,
	excelDateToJSDate,
	dateTime,
  getFullDate,
  localeStringToReadableFormat // `2022-8-29 17:48:21` into `29.08.2022 17:48`
};
