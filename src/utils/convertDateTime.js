export function dateTimeToText(time) {
	const previousTime = new Date(time);
	const currentTime = new Date();
	const hoursTodayPassed = new Date().getHours();

	const diffMs = currentTime - previousTime;
	const diffSeconds = Math.floor(diffMs / 1000); // Chuyển thành giây

	let text = "";
	let flag = false;
	let labelType = 0;

	if (diffSeconds < 60) {
		text = `${diffSeconds} giây`;
		labelType = 0;
		flag = true;
	}
	//hôm nay
	const diffMinutes = Math.floor(diffSeconds / 60); // Chuyển thành phút
	if (!flag && diffMinutes < 60) {
		text = `${diffMinutes} phút`;
		labelType = 0;
		flag = true;
	}
	const diffHours = Math.floor(diffMinutes / 60); // Chuyển thành giờ
	if (!flag && diffHours < hoursTodayPassed) {
		text = `${diffHours} giờ`;
		labelType = 0;
		flag = true;
	}

	//hôm qua
	if (!flag && diffHours < hoursTodayPassed + 24) {
		text = `Hôm qua`;
		labelType = 1;
		flag = true;
	}

	//trước đó
	const diffDays = Math.floor(diffHours / 24); // Chuyển thành ngày
	if (!flag && diffDays < 30) {
		text = `${diffDays} ngày`;
		labelType = 2;
		flag = true;
	}
	const diffMonths = Math.floor(diffDays / 30);
	if (!flag && diffMonths < 12) {
		text = `${diffMonths} tháng`;
		labelType = 2;
		flag = true;
	}
	if (!flag) {
		const diffYears = Math.floor(diffMonths / 12);
		labelType = 2;
		text = `${diffYears} năm`;
		flag = true;
	}

	return {
		text: text,
		labelType: labelType,
	};
}
