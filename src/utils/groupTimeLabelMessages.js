export const getTimeLabelIndexes = (messages) => {
  if (messages.length === 0) return [];

  const indexes = [];
  let lastTimestamp = null;
  let lastSender = null;
  let firstIndexInGroup = 0;
  let today = new Date().toDateString();
  let lastDate = null;
  let isTodayGroup = false;

  messages.forEach((msg, index) => {
    const currentTimestamp = new Date(msg.createdAt).getTime();
    const currentDate = new Date(msg.createdAt).toDateString();
    const isNewDay = lastDate && currentDate !== lastDate;

    if (isNewDay) {
      // Nếu là ngày mới và trước đó không phải hôm nay -> lưu lại index của nhóm trước
      if (!isTodayGroup) {
        indexes.push(firstIndexInGroup);
      }

      // Reset trạng thái
      firstIndexInGroup = index;
      isTodayGroup = currentDate === today;
    }

    if (currentDate !== today) {
      // Nếu là tin nhắn của ngày cũ, chỉ lưu index đầu tiên của nhóm
      if (!isTodayGroup) {
        firstIndexInGroup = index;
      }
    } else {
      // Nếu là tin nhắn của hôm nay, kiểm tra khoảng cách thời gian và sender
      if (
        !lastTimestamp ||
        msg.senderId !== lastSender ||
        currentTimestamp - lastTimestamp > 10 * 1000
      ) {
        indexes.push(index);
        firstIndexInGroup = index;
      }
    }

    lastTimestamp = currentTimestamp;
    lastSender = msg.senderId;
    lastDate = currentDate;
  });

  // Nếu nhóm cuối cùng không phải hôm nay, lưu lại index đầu tiên của nó
  if (!isTodayGroup) {
    indexes.push(firstIndexInGroup);
  }

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
