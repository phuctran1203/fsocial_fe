const data = [
	// Vừa mới đây (vài giây, vài phút trước)
	{
		id: 10,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 10 * 1000).toISOString(),
		read: false,
	}, // 10 giây trước
	{
		id: 11,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
		read: false,
	}, // 2 phút trước
	{
		id: 12,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
		read: false,
	}, // 45 phút trước

	// Hôm nay (nhiều giờ trước)
	{
		id: 13,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		read: false,
	}, // 5 giờ trước
	{
		id: 14,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
		read: false,
	}, // 12 giờ trước

	// Hôm qua nhưng chưa đủ 24 tiếng
	{
		id: 15,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
		read: false,
	}, // 23 giờ trước

	// Hôm qua thực sự
	{
		id: 16,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
		read: false,
	}, // Hôm qua

	// Từ 2 đến 7 ngày trước
	{
		id: 21,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
		read: false,
	}, // 2 ngày trước
	{
		id: 22,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
		read: false,
	}, // 3 ngày trước
	{
		id: 23,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
		read: true,
	}, // 4 ngày trước
	{
		id: 24,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
		read: true,
	}, // 5 ngày trước
	{
		id: 25,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
		read: true,
	}, // 6 ngày trước
	{
		id: 26,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
		read: true,
	}, // 7 ngày trước

	// Từ 8 đến 29 ngày trước (bổ sung)
	{
		id: 27,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
		read: true,
	}, // 9 ngày trước
	{
		id: 28,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
		read: true,
	}, // 15 ngày trước
	{
		id: 29,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
		read: true,
	}, // 20 ngày trước
	{
		id: 30,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString(),
		read: true,
	}, // 28 ngày trước

	// 30 ngày trước (khoảng 1 tháng trước)
	{
		id: 31,
		type: "likePost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
		read: true,
	},

	// 6 tháng trước
	{
		id: 32,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
		read: true,
	},

	// 1 năm trước
	{
		id: 33,
		type: "commentPost",
		image: "user_2.png",
		name: "Phương Nam",
		time: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
		read: true,
	},
];

export { data };
