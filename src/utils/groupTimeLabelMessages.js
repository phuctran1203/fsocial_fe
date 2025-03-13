export const getTimeLabelIndexes = (messages) => {
	if (messages.length === 0) return [];

	const indexes = [];
	let today = new Date().toDateString();
	let lastDate = null;
	let firstIndexInGroup = 0;
	let lastTimestamp = null;
	let lastReceiver = null;

	messages.forEach((msg, index) => {
		const currentTimestamp = new Date(msg.dateTime).getTime();
		const currentDate = new Date(msg.dateTime).toDateString();
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
				currentTimestamp - lastTimestamp > 30 * 1000
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

// 🔹 **Ví dụ sử dụng**
// const messages = [
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-08T10:00:00Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-08T10:00:05Z" },
// 	{ senderId: 2, receiverId: 1, createdAt: "2024-03-08T10:00:20Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-09T12:00:00Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-10T12:00:00Z" },
// 	{ senderId: 2, receiverId: 1, createdAt: "2024-03-10T12:00:15Z" },
// 	{ senderId: 2, receiverId: 1, createdAt: "2024-03-10T12:00:25Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-11T10:00:00Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-11T10:00:08Z" },
// 	{ senderId: 1, receiverId: 2, createdAt: "2024-03-11T10:00:20Z" },
// 	{ senderId: 2, receiverId: 1, createdAt: "2024-03-11T10:00:30Z" },
// ];

// console.log(getTimeLabelIndexes(messages));
