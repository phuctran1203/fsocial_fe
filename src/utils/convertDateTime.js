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
