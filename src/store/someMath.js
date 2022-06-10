const deltaABS = (sum1, sum2) => {
  if (!sum1) sum1 = 0;
  if (!sum2) sum2 = 0;
	return Math.abs(sum1) > Math.abs(sum2)
		? Math.abs(sum1) - Math.abs(sum2)
		: Math.abs(sum2) - Math.abs(sum1);
};

module.exports = { deltaABS };
