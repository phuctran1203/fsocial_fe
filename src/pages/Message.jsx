import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, SendIcon, SmileIcon } from "../components/Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";
// import { FaPaperPlane } from "react-icons/fa";

const listUsers = [
	{
		userId: "1",
		displayName: "Phúc Thịnh",
		latestMessage: "Chào bạn!",
		avatar: "./temp/user_2.png",
		time: "2025-02-10 10:00:00",
		read: true,
	},
	{
		userId: "2",
		displayName: "Phương Nam",
		latestMessage: "Lấy dùm tui cái laptop nha 🤧",
		avatar: "./temp/user_3.png",
		time: "2025-02-10 10:00:00",
		read: true,
	},
	{
		userId: "3",
		displayName: "Đức Khải",
		latestMessage: "",
		avatar: "./temp/user_4.png",
		time: "",
		read: false,
	},
	{
		userId: "4",
		displayName: "Cang Ngô",
		latestMessage: "",
		avatar: "./temp/user_5.png",
		time: "",
		read: false,
	},
	{
		userId: "5",
		displayName: "Tấn Đạt",
		latestMessage: "Biết ông lích không?",
		avatar: "./temp/user_6.png",
		time: "2025-02-10 10:00:00",
		read: false,
	},
];

const message = [
	{
		idMessage: "4h7ad2",
		data: {
			userId: 1,
			sendToId: 0,
			message: "",
		},
	},
];

export default function Message() {
	const textbox = useRef(null);

	const [selectedUser, setSelectedUser] = useState(null);

	const [messages, setMessages] = useState(null);

	const messagesEndRef = useRef(null);

	const sendMessage = () => {};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	const handleUserClick = (userId) => {
		setSelectedUser(userId);
		//call API lấy tin nhắn về
	};

	return (
		<div className="flex flex-grow h-screen bg-[--background-clr]">
			{/* Danh sách hội thoại */}
			<div className="lg:w-[340px] md:w-[280px] flex flex-col border-r pt-4 gap-4">
				<h2 className="px-4">Tin nhắn</h2>

				<label
					htmlFor="search-message"
					className="flex gap-2 p-2 mx-4 border rounded-full hover:border-[--gray-light-clr]"
				>
					<SearchIcon className="size-5 ms-1" color="stroke-[--gray-clr]" />
					<input type="text" id="search-message" placeholder="Tìm cuộc trò chuyện" className="w-full outline-none" />
				</label>

				<div className="px-2 flex-grow overflow-auto">
					{[...listUsers, ...listUsers, ...listUsers, ...listUsers].map((user) => (
						<div
							key={user.userId}
							className="px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-[--gray-extraaa-light-clr] ct-transition cursor-pointer"
							onClick={() => handleUserClick(user.userId)}
						>
							<div className="max-w-12 aspect-square rounded-full overflow-hidden">
								<img src={user.avatar} className="size-full object-cover" alt="" />
							</div>
							<div>
								<div className="flex items-center gap-3">
									<span className="font-semibold">{user.displayName}</span>
									{user.latestMessage !== "" && !user.read && (
										<span className="size-2 bg-[--primary-clr] rounded-full" />
									)}
								</div>
								{user.latestMessage !== "" && (
									<div className="flex gap-1">
										<p className={`line-clamp-1 ${!user.read && "font-semibold"}`}>{user.latestMessage}</p>
										<span className="text-[--gray-clr] text-nowrap">{dateTimeToNotiTime(user.time).textTime}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Cửa sổ tin nhắn */}
			<div className="flex-1 flex flex-col">
				<div className={`p-4 border-b ${!selectedUser && "hidden"}`}>abcdef</div>
				{!selectedUser && (
					<div className="size-full grid place-content-center">Cùng bắt đầu trò chuyện với người theo dõi của bạn</div>
				)}
				<div className="flex-1 p-4 overflow-auto"></div>

				{/* Thanh nhập tin nhắn */}
				{selectedUser && (
					<div className="px-6 pb-5 flex items-end gap-3">
						<div className="py-2">
							<SmileIcon />
						</div>
						<TextBox
							texboxRef={textbox}
							placeholder="Soạn tin nhắn"
							className="py-2 max-h-[100px] bg-[--gray-extraaa-light-clr] border rounded-3xl px-5 flex-grow scrollable-div"
						/>
						<button onClick={sendMessage} className="bg-[--primary-clr] py-2 px-5 rounded-full">
							<SendIcon color="stroke-[--text-white-clr]" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
