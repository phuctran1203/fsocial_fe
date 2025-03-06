export function dateTimeToNotiTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const hoursTodayPassed = new Date().getHours();

	const diffMs = currentTime - previousTime;
	const diffSeconds = Math.floor(diffMs / 1000); // Chuyển thành giây

	let text = "";
	let flag = false;
	let labelType = 0;

	//hôm nay
	if (diffSeconds < 60) {
		text = `${diffSeconds} giây`;
		labelType = 0;
		flag = true;
	}
	const diffMinutes = !flag ? Math.floor(diffSeconds / 60) : null; // Chuyển thành phút
	if (diffMinutes && diffMinutes < 60) {
		text = `${diffMinutes} phút`;
		labelType = 0;
		flag = true;
	}
	const diffHours = !flag ? Math.floor(diffMinutes / 60) : null; // Chuyển thành giờ
	if (diffHours && diffHours < hoursTodayPassed) {
		text = `${diffHours} giờ`;
		labelType = 0;
		flag = true;
	}

	//7 ngày trước
	const diffDays = !flag ? Math.ceil(diffHours / 24) : null; // Chuyển thành ngày

	if (diffDays && diffDays < 30) {
		text = `${diffDays} ngày`;
		labelType = diffDays <= 7 ? 1 : 2; //7 ngày trước hoặc trước đó
		flag = true;
	}

	const diffMonths = !flag ? Math.floor(diffDays / 30) : null; // Chuyển thành tháng
	if (diffMonths && diffMonths < 12) {
		text = `${diffMonths} tháng`;
		labelType = 2;
		flag = true;
	}
	if (!flag) {
		const diffYears = Math.round(diffMonths / 12); // Chuyển thành năm
		labelType = 2;
		text = `${diffYears} năm`;
	}

	return {
		textTime: text,
		labelType: labelType,
	};
}

export function dateTimeToPostTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const hoursTodayPassed = new Date().getHours();

	const diffMs = currentTime - previousTime;
	const diffSeconds = Math.floor(diffMs / 1000); // Chuyển thành giây

	let text = "";
	let flag = false;

	//hôm nay
	if (diffSeconds < 60) {
		text = `Vừa xong`;
		flag = true;
	}
	const diffMinutes = !flag ? Math.floor(diffSeconds / 60) : null; // Chuyển thành phút
	if (diffMinutes && diffMinutes < 60) {
		text = `${diffMinutes} phút`;
		flag = true;
	}
	// bài lên hôm nay: chêch lệch giờ nhỏ hơn số giờ đã qua của hôm nay
	const diffHours = !flag ? Math.floor(diffMinutes / 60) : null; // Chuyển thành giờ
	if (diffHours && diffHours < hoursTodayPassed) {
		text = `${diffHours} giờ`;
		flag = true;
	}

	// bài lên hôm qua: chêch lệch giờ lớn hơn số giờ đã qua của hôm nay và nhỏ hơn 24h + số giờ đã qua của hôm nay
	if (!flag && diffHours < 24 + hoursTodayPassed) {
		text = `${previousTime.getMinutes()}:${previousTime.getHours()} hôm qua`;
		flag = true;
	}

	//bài lên lớn hơn hôm qua -> format về mm:hh DD/MM/YYYY
	if (!flag) {
		text = `${previousTime.getMinutes().toString().padStart(2, "0")}:${previousTime
			.getHours()
			.toString()
			.padStart(2, "0")} ${previousTime.getDate().toString().padStart(2, "0")}/${previousTime
			.getMonth()
			.toString()
			.padStart(2, "0")}/${previousTime.getFullYear()}`;
	}

	return text;
}

export function dateTimeToMessageTime(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const hoursTodayPassed = new Date().getHours();

	let text = "";
	let flag = false;

	const diffMs = currentTime - previousTime;

	const diffHours = Math.floor(diffMs / 1000 / 60 / 60); // Chuyển thành giờ

	// trong hôm nay -> hh:mm
	if (diffHours < hoursTodayPassed) {
		text = `${previousTime.getHours()}:${previousTime.getMinutes()}`;
		flag = true;
	}
	// từ hôm qua lùi đến thứ 2 -> thứ n hh:mm
	// if (!flag){
	// 	text = `${previousTime.}`;
	// 	flag = true
	// }

	// từ CN tuần trước lùi lại: hh:mm dd:MM:yyyy
}
