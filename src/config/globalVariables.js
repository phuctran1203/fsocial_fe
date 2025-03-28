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

export const allCountries = {
	VN: "Việt Nam",
};

export const allProvinces = {
	VN: {
		"VN-01": "Hà Nội",
		"VN-02": "Hồ Chí Minh",
		"VN-03": "Hải Phòng",
		"VN-04": "Đà Nẵng",
		"VN-05": "Cần Thơ",
		"VN-06": "An Giang",
		"VN-07": "Bà Rịa - Vũng Tàu",
		"VN-08": "Bắc Giang",
		"VN-09": "Bắc Kạn",
		"VN-10": "Bạc Liêu",
		"VN-11": "Bắc Ninh",
		"VN-12": "Bến Tre",
		"VN-13": "Bình Định",
		"VN-14": "Bình Dương",
		"VN-15": "Bình Phước",
		"VN-16": "Bình Thuận",
		"VN-17": "Cà Mau",
		"VN-18": "Cao Bằng",
		"VN-19": "Đắk Lắk",
		"VN-20": "Đắk Nông",
		"VN-21": "Điện Biên",
		"VN-22": "Đồng Nai",
		"VN-23": "Đồng Tháp",
		"VN-24": "Gia Lai",
		"VN-25": "Hà Giang",
		"VN-26": "Hà Nam",
		"VN-27": "Hà Tĩnh",
		"VN-28": "Hải Dương",
		"VN-29": "Hậu Giang",
		"VN-30": "Hòa Bình",
		"VN-31": "Hưng Yên",
		"VN-32": "Khánh Hòa",
		"VN-33": "Kiên Giang",
		"VN-34": "Kon Tum",
		"VN-35": "Lai Châu",
		"VN-36": "Lâm Đồng",
		"VN-37": "Lạng Sơn",
		"VN-38": "Lào Cai",
		"VN-39": "Long An",
		"VN-40": "Nam Định",
		"VN-41": "Nghệ An",
		"VN-42": "Ninh Bình",
		"VN-43": "Ninh Thuận",
		"VN-44": "Phú Thọ",
		"VN-45": "Phú Yên",
		"VN-46": "Quảng Bình",
		"VN-47": "Quảng Nam",
		"VN-48": "Quảng Ngãi",
		"VN-49": "Quảng Ninh",
		"VN-50": "Quảng Trị",
		"VN-51": "Sóc Trăng",
		"VN-52": "Sơn La",
		"VN-53": "Tây Ninh",
		"VN-54": "Thái Bình",
		"VN-55": "Thái Nguyên",
		"VN-56": "Thanh Hóa",
		"VN-57": "Thừa Thiên Huế",
		"VN-58": "Tiền Giang",
		"VN-59": "Trà Vinh",
		"VN-60": "Tuyên Quang",
		"VN-61": "Vĩnh Long",
		"VN-62": "Vĩnh Phúc",
		"VN-63": "Yên Bái",
	},
};
