export function dateTimeToNotiTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const diffMs = currentTime - previousTime;
	const diffSeconds = Math.floor(diffMs / 1000);

	if (diffSeconds < 60) return { textTime: `${diffSeconds} giây`, labelType: 0 };

	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) return { textTime: `${diffMinutes} phút`, labelType: 0 };

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < currentTime.getHours()) return { textTime: `${diffHours} giờ`, labelType: 0 };

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 7) return { textTime: `${diffDays} ngày`, labelType: 1 };
	if (diffDays < 30) return { textTime: `${diffDays} ngày`, labelType: 2 };

	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths < 12) return { textTime: `${diffMonths} tháng`, labelType: 2 };

	const diffYears = Math.floor(diffMonths / 12);
	return { textTime: `${diffYears} năm`, labelType: 2 };
}

export function dateTimeToPostTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const hoursTodayPassed = currentTime.getHours();

	const diffMs = currentTime - previousTime;
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);

	// Nếu dưới 1 phút
	if (diffSeconds < 60) return "Vừa xong";
	// Nếu dưới 1 giờ
	if (diffMinutes < 60) return `${diffMinutes} phút`;
	// Nếu trong hôm nay
	if (diffHours < hoursTodayPassed) return `${diffHours} giờ`;
	// Nếu là hôm qua
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	if (previousTime.toDateString() === yesterday.toDateString()) {
		return `${previousTime.getHours()}:${previousTime.getMinutes().toString().padStart(2, "0")} hôm qua`;
	}
	// Nếu trước hôm qua
	return `${previousTime.getHours().toString().padStart(2, "0")}:${previousTime
		.getMinutes()
		.toString()
		.padStart(2, "0")} ${previousTime.getDate().toString().padStart(2, "0")}/${(previousTime.getMonth() + 1)
		.toString()
		.padStart(2, "0")}/${previousTime.getFullYear()}`;
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function dateTimeToMessageTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();

	// Tính ngày bắt đầu của tuần (Thứ Hai tuần này)
	const thisWeekStart = new Date();
	thisWeekStart.setDate(currentTime.getDate() - currentTime.getDay() + 1); // Chuyển về thứ Hai tuần này
	thisWeekStart.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

	let text = "";

	// Hôm nay -> hh:mm
	if (previousTime.toDateString() === currentTime.toDateString()) {
		text = `${previousTime.getHours()}:${previousTime.getMinutes().toString().padStart(2, "0")}`;
	}
	// Từ hôm qua đến thứ Hai tuần này -> Thứ n hh:mm
	else if (previousTime >= thisWeekStart) {
		const dayName = previousTime.toLocaleDateString("vi-VN", { weekday: "long" });
		text = `${capitalize(dayName)} ${previousTime.getHours()}:${previousTime.getMinutes().toString().padStart(2, "0")}`;
	}
	// Chủ nhật tuần trước về trước đó -> hh:mm dd/MM/yyyy
	else {
		text = `${previousTime.getHours()}:${previousTime.getMinutes().toString().padStart(2, "0")} ${previousTime
			.getDate()
			.toString()
			.padStart(2, "0")}/${(previousTime.getMonth() + 1).toString().padStart(2, "0")}/${previousTime.getFullYear()}`;
	}

	return text;
}
