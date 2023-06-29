const nameCutter = (fullName) => {
	const nameArr = fullName.split(" ");
	const surname = nameArr[0][0].toUpperCase() + nameArr[0].slice(1);
	const firstLetter = nameArr[1][0].toUpperCase() + ".";
	const secondLetter = nameArr[2][0].toUpperCase() + ".";
	return [surname, firstLetter, secondLetter].join(" ");
};

const capitalizeName = (name) => {
	return name
		.split(" ")
		.map((item) => {
			return item.charAt(0).toUpperCase() + item.slice(1);
		})
		.join(" ");
};

module.exports = {
	nameCutter,
	capitalizeName,
};
