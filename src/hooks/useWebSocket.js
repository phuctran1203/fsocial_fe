import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (usernameSender) => {
	const [messages, setMessages] = useState([]);
	const [receiver, setReceiver] = useState(null); // Người nhận tin nhắn hiện tại
	const stompClientRef = useRef(null);

	// 🔹 Tạo WebSocket chỉ khi `usernameSender` thay đổi
	useEffect(() => {
		if (!usernameSender) return;

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
	}, [usernameSender]); // Chỉ chạy khi usernameSender thay đổi

	// 🔹 Khi `receiver` thay đổi, đổi subscription nhưng không hủy WebSocket
	useEffect(() => {
		if (!stompClientRef.current || !stompClientRef.current.connected || !receiver) return;

		// Hủy đăng ký cũ trước khi đăng ký mới
		const subscription = stompClientRef.current.subscribe(
			`/queue/messages/${usernameSender}/${receiver}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				setMessages((prev) => [...prev, receivedMessage]);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [receiver]);

	// 🔹 Hàm gửi tin nhắn
	const sendMessage = (content) => {
		if (stompClientRef.current && stompClientRef.current.connected && receiver) {
			const dataSending = {
				sender: usernameSender,
				receiver: receiver,
				content: content,
				type: "CHAT",
			};
			console.log("dataSending: ", dataSending);

			stompClientRef.current.publish({
				destination: "/message/ws",
				body: JSON.stringify(dataSending),
			});
		}
	};

	return { messages, sendMessage, setReceiver };
};

export default useWebSocket;
