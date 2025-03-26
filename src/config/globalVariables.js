export const dayOptions = Array.from(
	{ length: 31 },
	(_, index) => index + 1
).reduce((acc, num) => {
	acc[num] = num;
	return acc;
}, {});

export const monthOptions = Array.from(
	{ length: 12 },
	(_, index) => index + 1
).reduce((acc, num) => {
	acc[num] = num;
	return acc;
}, {});

export const yearOptions = Array.from(
	{ length: new Date().getFullYear() - 19 - 1940 + 1 },
	(_, index) => 1940 + index
).reduce((acc, num) => {
	acc[num] = num;
	return acc;
}, {});
