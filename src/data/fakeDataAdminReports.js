const fakeChartDataPosts = [
	{ label: "00:00", value: 150 }, // Khuya giảm
	{ label: "01:00", value: 140 },
	{ label: "02:00", value: 130 }, // Thấp điểm nhất
	{ label: "03:00", value: 135 },
	{ label: "04:00", value: 145 },
	{ label: "05:00", value: 180 }, // Bắt đầu tăng
	{ label: "06:00", value: 230 }, // Sáng cao điểm
	{ label: "07:00", value: 280 },
	{ label: "08:00", value: 310 }, // Đỉnh buổi sáng
	{ label: "09:00", value: 290 },
	{ label: "10:00", value: 260 },
	{ label: "11:00", value: 240 }, // Giảm nhẹ vào trưa
	{ label: "12:00", value: 220 }, // Thấp điểm trưa
	{ label: "13:00", value: 230 },
	{ label: "14:00", value: 250 }, // Bắt đầu phục hồi
	{ label: "15:00", value: 270 },
	{ label: "16:00", value: 300 }, // Chuẩn bị cao điểm tối
	{ label: "17:00", value: 320 },
	{ label: "18:00", value: 350 }, // Đỉnh buổi tối
	{ label: "19:00", value: 370 },
	{ label: "20:00", value: 360 },
	{ label: "21:00", value: 340 }, // Bắt đầu giảm
	{ label: "22:00", value: 280 },
	{ label: "23:00", value: 200 }, // Quay về mức đêm
];

const fakeChartDataNumberCreatedAccounts = [
	{ label: "00:00", value: 80 },
	{ label: "01:00", value: 95 },
	{ label: "02:00", value: 120 },
	{ label: "03:00", value: 130 },
	{ label: "04:00", value: 115 },
	{ label: "05:00", value: 90 },
	{ label: "06:00", value: 105 },
	{ label: "07:00", value: 85 },
	{ label: "08:00", value: 100 },
	{ label: "09:00", value: 75 },
	{ label: "10:00", value: 95 },
	{ label: "11:00", value: 110 },
	{ label: "12:00", value: 140 },
	{ label: "13:00", value: 130 },
	{ label: "14:00", value: 125 },
	{ label: "15:00", value: 100 },
	{ label: "16:00", value: 95 },
	{ label: "17:00", value: 80 },
	{ label: "18:00", value: 75 },
	{ label: "19:00", value: 90 },
	{ label: "20:00", value: 110 },
	{ label: "21:00", value: 120 },
	{ label: "22:00", value: 100 },
	{ label: "23:00", value: 85 },
];

const fakeChartDataNumberComplaints = [
	{ label: "00:00", value: 50 },
	{ label: "01:00", value: 70 },
	{ label: "02:00", value: 90 },
	{ label: "03:00", value: 60 },
	{ label: "04:00", value: 85 },
	{ label: "05:00", value: 100 },
	{ label: "06:00", value: 95 },
	{ label: "07:00", value: 120 },
	{ label: "08:00", value: 80 },
	{ label: "09:00", value: 65 },
	{ label: "10:00", value: 75 },
	{ label: "11:00", value: 90 },
	{ label: "12:00", value: 105 },
	{ label: "13:00", value: 115 },
	{ label: "14:00", value: 100 },
	{ label: "15:00", value: 110 },
	{ label: "16:00", value: 120 },
	{ label: "17:00", value: 130 },
	{ label: "18:00", value: 140 },
	{ label: "19:00", value: 135 },
	{ label: "20:00", value: 125 },
	{ label: "21:00", value: 110 },
	{ label: "22:00", value: 95 },
	{ label: "23:00", value: 80 },
];

const fakeChartDataGender = [
	{ label: "male", value: 275, fill: "var(--orange-chart-clr)" },
	{ label: "female", value: 200, fill: "var(--blue-chart-clr)" },
	{ label: "others", value: 287, fill: "var(--green-chart-clr)" },
];

const fakeTopKOL = [
	{
		id: "djosi32",
		firstName: "Phúc",
		lastName: "Thịnh",
		username: "phucthinh1203",
		avatar: "../temp/user_2.png",
		numberFollowers: 843,
	},
	{
		id: "5yreved",
		firstName: "Phương",
		lastName: "Nam",
		username: "phuongnam54332",
		avatar: "../temp/user_3.png",
		numberFollowers: 700,
	},
	{
		id: "gfd45te",
		firstName: "Đức",
		lastName: "Khải",
		username: "phuongnam54332",
		avatar: "../temp/user_4.png",
		numberFollowers: 476,
	},
	{
		id: "rety5yrv4",
		firstName: "Cang",
		lastName: "Tấn",
		username: "phucthinh1203",
		avatar: "../temp/user_5.png",
		numberFollowers: 412,
	},
	{
		id: "k8oiujhg",
		firstName: "Phúc",
		lastName: "Thịnh",
		username: "phucthinh1203",
		avatar: "../temp/user_6.png",
		numberFollowers: 188,
	},
];

export {
	fakeChartDataPosts,
	fakeChartDataNumberCreatedAccounts,
	fakeChartDataNumberComplaints,
	fakeChartDataGender,
	fakeTopKOL,
};
