import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, Glyph, PlusIcon, SearchIcon, SendIcon, SmileIcon } from "../components/Icon";
import { dateTimeToMessageTime, dateTimeToNotiTime, dateTimeToPostTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";
import useWebSocket from "@/hooks/useWebSocket";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { getConversations, getMessages } from "@/api/messageApi";
import { getTextboxData } from "@/utils/processTextboxData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { themeStore } from "@/store/themeStore";
import Button from "@/components/Button";

export default function Message() {
	const user = ownerAccountStore((state) => state.user);
	const { messages, setMessages, sendMessage, receiver, setReceiver } = useWebSocket(user.userId);
	const theme = themeStore((state) => state.theme);
	const [contentActive, setContentActive] = useState(0);
	const handleCreateConversation = () => {};

	const handleChooseConversation = async (conversation) => {
		setContentActive(2);
		setTrigger(!trigger);
		setReceiver(conversation);
		setMessages([]);
		const resp = await getMessages(conversation.id);
		setMessages(resp.data);
	};

	// handle load all conversations
	const [conversations, setConversation] = useState([]);

	const handleGetAllConversation = async () => {
		const resp = await getConversations();
		const data = resp.data;
		setConversation(data);
	};

	useEffect(() => {
		if (!user?.userId) return;
		// get all conversation
		handleGetAllConversation();
	}, [user?.userId]);

	// go back button in mobile
	const handleGoBack = () => {
		setContentActive(0);
		setRealHeight(window.innerHeight);
		setReceiver(null);
	};

	const containerMessagesRef = useRef(null);
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
			setTrigger(!trigger);
			return;
		}

		setSubmitMsgClicked(true);
		sendMessage(innerHTML);
		// tạo data message mới gửi update lên UI
		const date = new Date();
		const createAt = date.toISOString().replace("Z", "+00:00");
		const baseMessage = {
			conversationId: receiver.conversationId,
			sender: user.userId,
			content: innerHTML,
			createAt: createAt,
		};
		setMessages((prev) => [...prev, baseMessage]);
		// reset textbox
		setTimeout(() => {
			textbox.current.innerHTML = "";
			setTrigger(!trigger);
		}, 1);
		setTrigger(!trigger);
		setSubmitMsgClicked(false);
	};

	const [avatarReceiverPosition, setAvatarReceiverPosition] = useState(null);

	useEffect(() => {
		// tìm tin nhắn mới nhất người gửi đã gửi
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].sender !== user.userId) {
				setAvatarReceiverPosition(i);
				break;
			}
		}

		setIndexMsgShow(messages.length - 1);

		if (containerMessagesRef.current) {
			setTimeout(() => {
				containerMessagesRef.current.scrollTo({
					top: containerMessagesRef.current.scrollHeight,
				});
				// bắt đầu intersectionObserver tin nhắn cũ nhất trong messages ở đây
				// để call API lấy tiếp tin nhắn cũ hơn
			}, 120);
		}
		// process label time cho cụm message
	}, [messages]);

	// kiểm soát message đang show thời gian
	const [indexMsgShow, setIndexMsgShow] = useState(-1);

	const showTimeLabel = (index) => {
		if (index === indexMsgShow) {
			setIndexMsgShow(-1);
			return;
		}
		setIndexMsgShow(index);
	};

	// handle show hide emoji picker
	const handleEmojiClick = (emojiObject) => {
		textbox.current.innerHTML += emojiObject.emoji;
	};

	// handle căn chỉnh chiều cao khi bàn phím ảo mở lên trên mobile
	const [realHeight, setRealHeight] = useState(window.visualViewport.height);

	useEffect(() => {
		const handleRezise = () => {
			const height = window.visualViewport.height;
			setRealHeight(height);
		};
		window.addEventListener("resize", handleRezise);
		return () => window.removeEventListener("resize", handleRezise);
	}, []);

	return (
		<div
			style={{ height: realHeight }}
			className={`${receiver && "sm:relative fixed top-0 sm:z-0 z-10"} flex-grow sm:flex bg-background transition`}
		>
			{/* Danh sách hội thoại */}
			<div
				className="
				flex flex-col pt-4 h-full
				sm:w-2/5 sm:min-w-[300px] sm:max-w-[350px] sm:gap-4 sm:border-r
				w-screen gap-2 transition"
			>
				<div className="px-4 flex items-center justify-between">
					<h2 className="">Tin nhắn</h2>
					<Button className="btn-transparent !w-fit p-1" onClick={() => setContentActive(1)}>
						<PlusIcon />
					</Button>
				</div>
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
				{/* list conversations */}
				<div className="h-full px-2 flex-grow overflow-auto">
					{conversations.map((conversation, index) => (
						<div
							key={index}
							className="px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-gray-3light ct-transition cursor-pointer"
							onClick={() => handleChooseConversation(conversation)}
						>
							<Avatar className={`size-11`}>
								<AvatarImage src={conversation.avatar} />
								<AvatarFallback className="fs-xs">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
							</Avatar>

							<div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">{conversation.firstName + " " + conversation.lastName}</span>
									{/* dấu chấm đánh dấu chưa đọc */}
									{conversation.lastMessage && !conversation.lastMessage.read && (
										<span className="size-2 bg-primary rounded-full" />
									)}
								</div>
								{conversation.lastMessage && (
									<div className="flex gap-2">
										<div
											className={`line-clamp-1 ${!conversation.lastMessage.read && "font-semibold"}`}
											dangerouslySetInnerHTML={{ __html: conversation.lastMessage.content }}
										></div>
										<span className="text-gray text-nowrap">
											{dateTimeToMessageTime(conversation.lastMessage.createAt)}
										</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* content */}
			<div
				style={{ height: realHeight }}
				className={`size-full bg-background ${
					[1, 2].includes(contentActive) && "sm:translate-y-0 -translate-y-full"
				} transition`}
			>
				{contentActive === 0 && (
					<div className="size-full place-content-center sm:grid hidden">
						Cùng bắt đầu trò chuyện với người theo dõi của bạn
					</div>
				)}

				{contentActive === 1 && (
					<div className="size-full flex flex-col">
						{/* head */}
						<div className="py-4 px-5 border-b space-x-2 flex items-center">
							<button onClick={handleGoBack}>
								<ArrowLeftIcon className={"sm:hidden me-3"} />
							</button>
							<label htmlFor="new-to">Đến:</label>
							<input id="new-to" autoFocus className="bg-transparent outline-none" placeholder="Nhập tên người dùng" />
						</div>
						<div className="overflow-y-auto px-3 pt-4 pb-2 flex-grow">list friends or something</div>
					</div>
				)}

				{contentActive === 2 && (
					<div className="flex flex-col size-full">
						{/* header thông tin */}
						<div className={`py-3 px-5 border-b flex items-center justify-between `}>
							<div className="flex items-center">
								<button onClick={handleGoBack}>
									<ArrowLeftIcon className={"sm:hidden me-3"} />
								</button>
								<Avatar className={`size-9 me-2`}>
									<AvatarImage src={receiver.avatar} />
									<AvatarFallback className="fs-xs">{receiver.firstName.charAt(0) ?? "?"}</AvatarFallback>
								</Avatar>
								<p className="font-semibold">{receiver.firstName + " " + receiver.lastName}</p>
							</div>
							<Glyph />
						</div>
						{/* tin nhắn */}
						<div ref={containerMessagesRef} className="overflow-y-auto px-3 pt-4 pb-2 flex-grow space-y-0.5">
							{messages.map((message, index) => (
								<div key={index}>
									{/* label time for messages block */}
									{/* <p className={`fs-xs -z-10 text-gray text-center transition`}>{dateTimeToPostTime(message.createAt)}</p> */}
									{message.sender === user.userId ? (
										// when owner-account's message
										<div className={`relative ${index === indexMsgShow && "pb-5"} transition`}>
											<div
												className={`px-3 py-1 ms-auto rounded-2xl w-fit max-w-[70vw] bg-primary text-txtWhite cursor-pointer`}
												dangerouslySetInnerHTML={{ __html: message.content }}
												onClick={() => showTimeLabel(index)}
											/>
											<p
												className={`fs-xs -z-10 text-gray absolute bottom-0 right-1 ${
													index === indexMsgShow ? "opacity-100" : "opacity-0"
												} transition`}
											>
												{dateTimeToMessageTime(message.createAt)}
											</p>
										</div>
									) : (
										// when not owner-account's message
										<div className={`relative ${index === indexMsgShow && "pb-5"} transition`}>
											<div className="flex gap-1 items-end">
												{avatarReceiverPosition === index ? (
													<Avatar className={`size-6`}>
														<AvatarImage src={receiver.avatar} />
														<AvatarFallback className="text-[8px]">
															{receiver.firstName.charAt(0) ?? "?"}
														</AvatarFallback>
													</Avatar>
												) : (
													<div className="size-6" />
												)}
												<div
													className={`px-3 py-1 rounded-2xl w-fit max-w-[70vw] bg-secondary cursor-pointer`}
													dangerouslySetInnerHTML={{ __html: message.content }}
													onClick={() => showTimeLabel(index)}
												/>
											</div>
											<p
												className={`fs-xs -z-10 text-gray absolute bottom-0 left-8 ${
													index === indexMsgShow ? "opacity-100" : "opacity-0"
												} transition`}
											>
												{dateTimeToMessageTime(message.createAt)}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
						{/* Thanh nhập tin nhắn */}
						<div className="relative bg-background border-t sm:px-6 px-4 sm:py-4 py-3 flex items-end gap-3 transition">
							<Popover>
								<PopoverTrigger className="md:py-2 py-1.5">
									<SmileIcon className="size-6" />
									<PopoverContent
										side="bottom"
										align="start"
										sideOffset={30}
										className="bg-background w-fit p-2 rounded-2xl"
									>
										<EmojiPicker onEmojiClick={handleEmojiClick} theme={theme} />
									</PopoverContent>
								</PopoverTrigger>
							</Popover>
							<TextBox
								texboxRef={textbox}
								placeholder="Soạn tin nhắn"
								className="py-1.5 max-h-[120px] bg-gray-3light border rounded-3xl px-4 flex-grow scrollable-div"
								contentEditable={!submitMsgClicked}
								onKeyDown={textBoxOnKeyDown}
								autoFocus={true}
								trigger={trigger}
							/>
							<button onClick={handleSendMsg} className="bg-primary py-1.5 px-5 rounded-full">
								<SendIcon color="stroke-txtWhite" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
