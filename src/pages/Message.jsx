import React, { useState, useEffect, useRef } from "react";
// import { FaPaperPlane } from "react-icons/fa";

export default function Message() {
	const [messages, setMessages] = useState({
		"Phúc Thịnh": [
			{ id: 1, text: "Chào bạn!", sender: "Phúc Thịnh" },
			{ id: 2, text: "Chào bạn, có gì không?", sender: "user" },
			{ id: 3, text: "Đi cà phê nhé!", sender: "Phúc Thịnh" },
		],
		"Phương Nam": [
			{ id: 1, text: "Hello Nam!", sender: "user" },
			{ id: 2, text: "Hello bạn, lâu quá!", sender: "Phương Nam" },
		],
		"Đức Khải": [
			{ id: 1, text: "Anh rảnh không?", sender: "user" },
			{ id: 2, text: "Có gì không em?", sender: "Đức Khải" },
		],
	});

	const [input, setInput] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);

	const messagesEndRef = useRef(null);

	const sendMessage = () => {
		if (input.trim() && selectedUser) {
			setMessages((prevMessages) => ({
				...prevMessages,
				[selectedUser]: [...prevMessages[selectedUser], { id: Date.now(), text: input, sender: "user" }],
			}));
			setInput("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	const handleUserClick = (userName) => {
		setSelectedUser(userName);
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-grow h-screen bg-gray-100">
			{/* Danh sách hội thoại */}
			<div className="w-1/4 bg-white border-r p-4">
				<h2 className="text-lg font-semibold mb-4">Tin nhắn</h2>
				<input type="text" placeholder="Tìm cuộc trò chuyện" className="w-full p-2 border rounded mb-4" />
				<div className="space-y-2">
					{Object.keys(messages).map((user) => (
						<div
							key={user}
							className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
							onClick={() => handleUserClick(user)}
						>
							{user}
						</div>
					))}
				</div>
			</div>

			{/* Cửa sổ tin nhắn */}
			<div className="flex-1 flex flex-col">
				<div className="bg-white p-4 border-b">{selectedUser || "Chọn người để bắt đầu nhắn tin"}</div>

				<div className="flex-1 p-4 overflow-auto bg-gray-50">
					{selectedUser ? (
						messages[selectedUser].map((msg) => (
							<div key={msg.id} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
								<div>
									<div className={`text-sm font-semibold mb-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
										{msg.sender === "user" ? "Bạn" : msg.sender}
									</div>

									<div
										className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-orange-500 text-white" : "bg-gray-300"}`}
									>
										{msg.text}
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-gray-500 text-center mt-20">Chọn người để bắt đầu nhắn tin</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Thanh nhập tin nhắn */}
				{selectedUser && (
					<div className="bg-white p-4 flex items-center border-t">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder={`Nhắn tin với ${selectedUser}...`}
							className="flex-1 p-2 border rounded mr-2"
						/>
						<button onClick={sendMessage} className="bg-orange-500 text-white p-2 rounded flex items-center">
							{/* <FaPaperPlane /> */}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
