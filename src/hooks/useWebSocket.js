import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (senderId) => {
	const [messages, setMessages] = useState([]);
	const [conversation, setConversation] = useState(null); // Người nhận tin nhắn hiện tại
	const stompClientRef = useRef(null);

	// 🔹 Tạo WebSocket chỉ khi `senderId` thay đổi
	useEffect(() => {
		if (!senderId) return;

		const client = new Client({
			brokerURL: "ws://localhost:8082/message/ws",
			reconnectDelay: 5000,
			onConnect: () => {
				console.log("🔗 Kết nối WebSocket!");
			},
		});

		client.activate();
		stompClientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, [senderId]); // Chỉ chạy khi senderId thay đổi

	// 🔹 Khi `conversation` thay đổi, đổi subscription nhưng không hủy WebSocket
	useEffect(() => {
		if (
			!stompClientRef.current ||
			!stompClientRef.current.connected ||
			!conversation
		)
			return;

		// Hủy đăng ký cũ trước khi đăng ký mới
		const subscription = stompClientRef.current.subscribe(
			`/queue/private-${senderId}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				console.log("received trigger: ", receivedMessage);
				setMessages((prev) => [...prev, receivedMessage]);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [conversation?.receiverId]);

	// 🔹 Hàm gửi tin nhắn
	const sendMessage = (content, id) => {
		if (
			stompClientRef.current &&
			stompClientRef.current.connected &&
			conversation
		) {
			const dataSending = {
				receiverId: conversation.receiverId,
				conversationId: id ?? conversation.id,
				content: content,
			};
			console.log("dataSending: ", dataSending);

			stompClientRef.current.publish({
				destination: "/app/chat.private",
				body: JSON.stringify(dataSending),
			});
		}
	};

	return { messages, setMessages, sendMessage, conversation, setConversation };
};

export default useWebSocket;
