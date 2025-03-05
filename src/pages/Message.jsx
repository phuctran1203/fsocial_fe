import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, Glyph, SearchIcon, SendIcon, SmileIcon } from "../components/Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";
import { Client } from "@stomp/stompjs";
import useWebSocket from "@/hooks/useWebSocket";
import { ownerAccountStore } from "@/store/ownerAccountStore";

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
	const user = ownerAccountStore((state) => state.user);

	const [selectedUser, setSelectedUser] = useState(null);

	const handleChooseConversation = (userId) => {
		setTrigger(!trigger);
		setSelectedUser(userId);
		setReceiver("4a3e83c8-9d36-4ec1-b4f9-d6e9f2961a60");
		//call API lấy tin nhắn về
	};

	const handleGoBack = () => {
		setRealHeight(window.innerHeight);
		setSelectedUser(null);
	};

	const [submitMsgClicked, setSubmitMsgClicked] = useState(false);

	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			sendMessage(textbox.current.innerText);
		}
	};

	const { messages, sendMessage, setReceiver } = useWebSocket(user.userId);

	const [trigger, setTrigger] = useState(true); // trigger auto focus lại textbox
	const textbox = useRef(null); // messsage chuẩn bị gửi lưu ở đây

	const handleSendMsg = () => {
		sendMessage(textbox.current.innerText);
	};

	// handle căn chỉnh chiều cao khi bàn phím ảo mở lên trên mobile
	const [realHeight, setRealHeight] = useState(window.visualViewport.height);
	useEffect(() => {
		const handleRezise = () => {
			const height = window.visualViewport.height;

			if (textbox.current) textbox.current.innerText = height;
			setRealHeight(height);
		};
		window.addEventListener("resize", handleRezise);
		return () => window.removeEventListener("resize", handleRezise);
	}, []);

	return (
		<div
			style={{ height: realHeight }}
			className={`${
				selectedUser && "sm:relative fixed top-0 sm:z-0 z-10"
			} flex-grow sm:flex bg-background overflow-hidden transition`}
		>
			{/* Danh sách hội thoại */}
			<div
				className="
				flex flex-col pt-4 h-full
				sm:w-2/5 sm:min-w-[300px] sm:max-w-[350px] sm:gap-4 sm:border-r
				w-screen gap-2 transition"
			>
				<h2 className="px-4">Tin nhắn</h2>
				{/* search bar */}
				<label
					htmlFor="search-message"
					className="flex gap-2 p-2 mx-4 border rounded-full hover:border-gray-light transition"
				>
					<SearchIcon className="size-5 ms-1" color="stroke-[--gray-clr]" />
					<input
						type="text"
						id="search-message"
						placeholder="Tìm cuộc trò chuyện"
						className="w-full outline-none bg-transparent"
					/>
				</label>
				{/* list user's messages */}
				<div className="h-full px-2 flex-grow overflow-auto">
					{listUsers.map((user) => (
						<div
							key={user.userId}
							className="px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-gray-3light ct-transition cursor-pointer"
							onClick={() => handleChooseConversation(user.userId)}
						>
							<div className="max-w-12 aspect-square rounded-full overflow-hidden">
								<img src={user.avatar} className="size-full object-cover" alt="" />
							</div>
							<div>
								<div className="flex items-center gap-3">
									<span className="font-semibold">{user.displayName}</span>
									{user.latestMessage !== "" && !user.read && <span className="size-2 bg-primary rounded-full" />}
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
			<div
				style={{ height: realHeight }}
				className={` sm:flex-grow flex flex-col bg-background ${
					selectedUser && "sm:translate-y-0 -translate-y-full"
				} transition`}
			>
				{/* header info */}
				<div className={`py-3 px-4 border-b flex items-center justify-between ${!selectedUser && "hidden"} `}>
					<div className="flex items-center">
						<button onClick={handleGoBack}>
							<ArrowLeftIcon className={"sm:hidden me-3"} />
						</button>
						<img src="./temp/default_avatar.svg" className="size-9 me-2" alt="" />
						<p className="font-semibold">Phúc Trần</p>
					</div>
					<Glyph />
				</div>

				{!selectedUser ? (
					<div className="size-full grid place-content-center">Cùng bắt đầu trò chuyện với người theo dõi của bạn</div>
				) : (
					<div className="overflow-auto px-5 flex-grow" id="allow-scroll">
						{messages.map((message) => (
							<p>{message}</p>
						))}
					</div>
				)}

				{/* Thanh nhập tin nhắn */}
				{selectedUser && (
					<div className="bg-background border-t sm:px-6 px-4 sm:py-4 py-3 flex items-end gap-3">
						<div className="md:py-2 py-1.5">
							<SmileIcon className="size-6" />
						</div>
						<TextBox
							texboxRef={textbox}
							placeholder="Soạn tin nhắn"
							className="sm:py-2 py-1.5 max-h-[120px] bg-gray-3light border rounded-3xl px-5 flex-grow scrollable-div"
							contentEditable={!submitMsgClicked}
							onKeyDown={textBoxOnKeyDown}
							autoFocus={true}
							trigger={trigger}
						/>
						<button onClick={handleSendMsg} className="bg-primary sm:py-2 py-1.5 px-5 rounded-full">
							<SendIcon color="stroke-txtWhite" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
