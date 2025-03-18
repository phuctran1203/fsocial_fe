import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ownerAccountStore } from "@/store/ownerAccountStore";

export const useMessageSocket = () => {
	const user = ownerAccountStore((state) => state.user);
	const [messages, setMessages] = useState([]);
	const [conversation, setConversation] = useState(null); // Người nhận tin nhắn hiện tại
	const stompClientRef = useRef(null);

	useEffect(() => {
		if (!user?.userId) return;

		const client = new Client({
			brokerURL: "ws://localhost:8082/message/ws",
			reconnectDelay: 5000,
			onConnect: () => {
				console.log("🔗 Kết nối WebSocket message!");
			},
		});

		client.activate();
		stompClientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, [user?.userId]); // Chỉ chạy khi senderId thay đổi

	// 🔹 Khi `conversation` thay đổi, đổi subscription nhưng không hủy WebSocket
	useEffect(() => {
		if (
			!stompClientRef.current ||
			!stompClientRef.current.connected ||
			!conversation
		)
			return;

		const subscription = stompClientRef.current.subscribe(
			`/queue/private-${user.userId}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				console.log("received trigger: ", receivedMessage);
				setMessages((prev) => [...prev, receivedMessage]);
			}
		);

		return () => {
			// Hủy đăng ký cũ trước khi đăng ký mới
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

export const useConversationsSocket = () => {
	useEffect(() => {
		const client = new Client({
			brokerURL: "ws://localhost:8082/conversations",
			reconnectDelay: 5000,
			onConnect: () => {
				console.log("🔗 Kết nối WebSocket conversations!");
			},
		});
		client.activate();

		const subscription = client.subscribe(`/queue/private-`, (message) => {
			const receivedMessage = JSON.parse(message.body);
			console.log("received trigger: ", receivedMessage);
		});

		return () => {
			client.deactivate();
			subscription.unsubscribe();
		};
	}, []);
};

export const useNotificationSocket = () => {
	const [client, setClient] = useState(null);
	const createClient = () => {
		// useEffect(() => {
		const client = new Client({
			brokerURL: "ws://localhost:8087/notification/ws",
			reconnectDelay: 5000,
			onConnect: () => {
				console.log("🔗 Kết nối WebSocket notification!");
			},
		});
		client.activate();
		setClient(client);
	};
	const startSubscribe = (userId) => {
		client.subscribe(`/topic/notifications-${userId}`, (message) => {
			const receivedMessage = JSON.parse(message.body);
			console.log("received trigger: ", receivedMessage);
		});
	};

	return { createClient, startSubscribe };
};
