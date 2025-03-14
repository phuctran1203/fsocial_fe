export const getTimeLabelIndexes = (messages) => {
	if (messages.length === 0) return [];

	const indexes = [];
	let today = new Date().toDateString();
	let lastDate = null;
	let firstIndexInGroup = 0;
	let lastTimestamp = null;
	let lastReceiver = null;

	messages.forEach((msg, index) => {
		const currentTimestamp = new Date(msg.createAt).getTime();
		const currentDate = new Date(msg.createAt).toDateString();
		const isNewDay = lastDate && currentDate !== lastDate;

		if (currentDate !== today) {
			// Nếu là ngày mới hoặc ngày đầu tiên trong danh sách
			if (isNewDay || index === 0) {
				indexes.push(index);
			}
			firstIndexInGroup = index; // Reset block mới
		} else {
			// Nếu là tin nhắn của hôm nay
			if (
				!lastTimestamp ||
				msg.receiverId !== lastReceiver ||
				currentTimestamp - lastTimestamp > 60 * 1000
			) {
				indexes.push(index);
				firstIndexInGroup = index; // Reset block mới
			}
		}

		lastTimestamp = currentTimestamp;
		lastReceiver = msg.receiverId;
		lastDate = currentDate;
	});

	return indexes;
};
