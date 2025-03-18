export const getTimeLabelIndexes = (messages) => {
	if (messages.length === 0) return [];

	const indexes = [];
	let today = new Date().toDateString();
	let lastDate = null;
	let firstIndexInGroup = 0;
	let firstTimestampInGroup = null; // Lưu timestamp của tin nhắn đầu tiên trong block

	messages.forEach((msg, index) => {
		const currentTimestamp = new Date(msg.createAt).getTime();
		const currentDate = new Date(msg.createAt).toDateString();
		const isNewDay = lastDate && currentDate !== lastDate;

		if (currentDate !== today) {
			// Nếu là ngày mới hoặc tin nhắn đầu tiên
			if (isNewDay || index === 0) {
				indexes.push(index);
				firstIndexInGroup = index;
				firstTimestampInGroup = currentTimestamp; // Cập nhật timestamp đầu block
			}
		} else {
			// Nếu là hôm nay, so sánh với timestamp của tin nhắn đầu tiên trong block
			if (
				index === 0 || // Tin nhắn đầu tiên luôn là block mới
				currentTimestamp - firstTimestampInGroup > 60 * 1000 // Khoảng cách > 1 phút
			) {
				indexes.push(index);
				firstIndexInGroup = index;
				firstTimestampInGroup = currentTimestamp; // Cập nhật timestamp đầu block
			}
		}

		lastDate = currentDate;
	});

	return indexes;
};
