import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, Glyph, SearchIcon, SendIcon, SmileIcon } from "../components/Icon";
import { dateTimeToMessageTime, dateTimeToNotiTime, dateTimeToPostTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";
import useWebSocket from "@/hooks/useWebSocket";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { getMessages } from "@/api/messageApi";
import { getTextboxData } from "@/utils/processTextboxData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const listUsers = [
	{
		userId: "4a3e83c8-9d36-4ec1-b4f9-d6e9f2961a60",
		displayName: "Phúc Thịnh",
		latestMessage: "Chào bạn!",
		avatar: "./temp/user_2.png",
		time: "2025-02-10 10:00:00",
		read: true,
	},
	{
		userId: "677d104e-e1df-4fdc-8ed3-2ddc34cdced4",
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

export default function Message() {
	const user = ownerAccountStore((state) => state.user);

	const { messages, setMessages, sendMessage, receiver, setReceiver } = useWebSocket(user.userId);

	const handleChooseConversation = async (user) => {
		setTrigger(!trigger);
		setReceiver(user);
		setMessages([]);
		// const resp = await getMessages(user.userId);
		// setMessages(resp.data);
	};

	const handleGoBack = () => {
		setRealHeight(window.innerHeight);
		setReceiver(null);
	};

	const [submitMsgClicked, setSubmitMsgClicked] = useState(false);

	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendMsg();
		}
	};

	const [trigger, setTrigger] = useState(true); // trigger auto focus lại textbox
	const textbox = useRef(null); // messsage chuẩn bị gửi lưu ở đây

	const handleSendMsg = () => {
		const { innerText, innerHTML } = getTextboxData(textbox);
		if (!innerText || !innerHTML) {
			setTimeout(() => {
				textbox.current.innerHTML = "";
				setTrigger(!trigger);
			}, 1);
			return;
		}
		setSubmitMsgClicked(true);
		sendMessage(textbox.current.innerText);
		setSubmitMsgClicked(false);
		const date = new Date();
		const timeStamp = date.toISOString().replace("Z", "+00:00");
		const baseMessage = {
			id: Math.random() * 1000,
			sender: user.userId,
			receiver: receiver.userId,
			content: innerHTML,
			timestamp: timeStamp,
		};
		setMessages((prev) => [...prev, baseMessage]);
		setTimeout(() => {
			textbox.current.innerHTML = "";
			setTrigger(!trigger);
		}, 1);
		setTrigger(!trigger);
	};

	const [avatarPosition, setAvatarPosition] = useState([null, null]);
	useEffect(() => {
		const pos = [];
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].sender === user.userId) {
				pos[0] = i;
				break;
			}
		}
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].sender !== user.userId) {
				pos[1] = i;
				break;
			}
		}
		setAvatarPosition(pos);
		// process label time cho cụm message
	}, [messages]);

	// kiểm soát message đang show thời gian
	const checkboxRef = useRef(null);
	const [checkboxActive, setCheckboxActive] = useState(null);
	const handleCheckboxChange = (e) => {
		const el = e.target;
		if (el !== checkboxActive && el.checked) {
			checkboxActive.checked = false;
			setCheckboxActive(el);
		}
	};

	useEffect(() => {
		if (!checkboxRef.current) return;
		if (checkboxActive?.checked) {
			checkboxActive.checked = false;
		}
		checkboxRef.current.checked = true;
		setCheckboxActive(checkboxRef.current);
	}, [checkboxRef?.current]);

	const openIcon = () => {
		// window.open("/path/to/icon.ico", "_blank");
	};

	// handle căn chỉnh chiều cao khi bàn phím ảo mở lên trên mobile
	const [realHeight, setRealHeight] = useState(window.visualViewport.height);
	useEffect(() => {
		const handleRezise = () => {
			const height = window.visualViewport.height;

			// if (textbox.current) textbox.current.innerText = height;
			setRealHeight(height);
		};
		window.addEventListener("resize", handleRezise);
		return () => window.removeEventListener("resize", handleRezise);
	}, []);

	return (
		<div
			style={{ height: realHeight }}
			className={`${
				receiver && "sm:relative fixed top-0 sm:z-0 z-10"
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
							onClick={() => handleChooseConversation(user)}
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
										<span className="text-[--gray-clr] text-nowrap">{dateTimeToMessageTime(user.time).textTime}</span>
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
					receiver && "sm:translate-y-0 -translate-y-full"
				} transition`}
			>
				{/* header info */}
				<div className={`py-3 px-4 border-b flex items-center justify-between ${!receiver && "hidden"} `}>
					<div className="flex items-center">
						<button onClick={handleGoBack}>
							<ArrowLeftIcon className={"sm:hidden me-3"} />
						</button>
						<Avatar className={`size-9 me-2`}>
							<AvatarImage src={receiver?.avatar} />
							<AvatarFallback className="fs-xs">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
						</Avatar>
						<p className="font-semibold">{receiver?.displayName}</p>
					</div>
					<Glyph />
				</div>

				{!receiver ? (
					<div className="size-full grid place-content-center">Cùng bắt đầu trò chuyện với người theo dõi của bạn</div>
				) : (
					<div className="overflow-auto px-3 pt-4 pb-1 flex-grow space-y-0.5" id="allow-scroll">
						{messages.map((message, index) => (
							<div key={message.id}>
								<div className="flex gap-1">
									{message.sender === user.userId ? (
										<div className="ms-auto relative transition overflow-hidden">
											<input
												ref={index === messages.length - 1 ? checkboxRef : null}
												type="checkbox"
												className="peer !absolute right-0 !max-w-[100%] !w-14 !h-full opacity-0"
												onChange={(e) => handleCheckboxChange(e)}
											/>
											<div
												className={`px-3 py-1 ms-auto rounded-2xl w-fit max-w-[70vw] bg-primary text-txtWhite`}
												dangerouslySetInnerHTML={{ __html: message.content }}
											></div>
											<p className="fs-xs -z-10 w-fit ms-auto pe-1 text-center text-gray absolute invisible -translate-y-2 peer-checked:static peer-checked:visible peer-checked:translate-y-0 peer-checked:transition">
												{dateTimeToPostTime(message.timestamp)}
											</p>
										</div>
									) : (
										<>
											{avatarPosition[1] === index ? (
												<Avatar className={`size-7`}>
													<AvatarImage src={receiver.avatar} />
													<AvatarFallback className="fs-xs">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
												</Avatar>
											) : (
												<div className="size-7" />
											)}
											<div className="me-auto relative transition overflow-hidden">
												<input
													ref={index === messages.length - 1 ? checkboxRef : null}
													type="checkbox"
													className="peer !absolute left-0 !max-w-[100%] !w-14 !h-full opacity-0"
													onChange={(e) => handleCheckboxChange(e)}
												/>
												<div className={`px-3 py-1 rounded-2xl w-fit max-w-[70vw] bg-secondary`}>{message.content}</div>
												<p className="fs-xs -z-10 w-fit ps-1 text-center text-gray absolute invisible -translate-y-2 peer-checked:static peer-checked:visible peer-checked:translate-y-0 peer-checked:transition">
													{dateTimeToPostTime(message.timestamp)}
												</p>
											</div>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Thanh nhập tin nhắn */}
				{receiver && (
					<div className="bg-background border-t sm:px-6 px-4 sm:py-4 py-3 flex items-end gap-3">
						<button className="md:py-2 py-1.5" onClick={openIcon}>
							<SmileIcon className="size-6" />
						</button>
						<TextBox
							texboxRef={textbox}
							placeholder="Soạn tin nhắn"
							className="py-1.5 max-h-[120px] bg-gray-3light border rounded-3xl px-5 flex-grow scrollable-div"
							contentEditable={!submitMsgClicked}
							onKeyDown={textBoxOnKeyDown}
							autoFocus={true}
							trigger={trigger}
						/>
						<button onClick={handleSendMsg} className="bg-primary py-1.5 px-5 rounded-full">
							<SendIcon color="stroke-txtWhite" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
