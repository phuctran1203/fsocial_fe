import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (senderId) => {
	const [messages, setMessages] = useState([]);
	const [receiver, setReceiver] = useState(null); // Người nhận tin nhắn hiện tại
	const stompClientRef = useRef(null);

	// 🔹 Tạo WebSocket chỉ khi `senderId` thay đổi
	useEffect(() => {
		if (!senderId) return;

		const client = new Client({
			brokerURL: "ws://localhost:8082/message/ws",
			reconnectDelay: 5000,
			onConnect: () => console.log("🔗 Kết nối WebSocket!"),
		});

		client.activate();
		stompClientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, [senderId]); // Chỉ chạy khi senderId thay đổi

	// 🔹 Khi `receiver` thay đổi, đổi subscription nhưng không hủy WebSocket
	useEffect(() => {
		if (!stompClientRef.current || !stompClientRef.current.connected || !receiver) return;

		// Hủy đăng ký cũ trước khi đăng ký mới
		const subscription = stompClientRef.current.subscribe(`/queue/private-${senderId}`, (message) => {
			const receivedMessage = JSON.parse(message.body);
			console.log("received trigger: ", receivedMessage);
			setMessages((prev) => [...prev, receivedMessage]);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [receiver?.userId]);

	// 🔹 Hàm gửi tin nhắn
	const sendMessage = (content) => {
		if (stompClientRef.current && stompClientRef.current.connected && receiver) {
			const dataSending = {
				sender: senderId,
				receiver: receiver.userId,
				content: content,
				type: "CHAT",
			};
			console.log("dataSending: ", dataSending);

			stompClientRef.current.publish({
				destination: "/app/chat.private",
				body: JSON.stringify(dataSending),
			});
		}
	};

	return { messages, setMessages, sendMessage, receiver, setReceiver };
};

export default useWebSocket;
