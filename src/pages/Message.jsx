import React, { useState, useEffect, useRef } from "react";
import {
	ArrowLeftIcon,
	Glyph,
	LoadingIcon,
	PlusIcon,
	SearchIcon,
	SendIcon,
	SmileIcon,
} from "../components/Icon";
import { dateTimeToMessageTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";
import { useMessageSocket } from "@/hooks/webSocket";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import {
	createConversation,
	getConversations,
	getMessages,
} from "@/api/messageApi";
import { getTextboxData } from "@/utils/processTextboxData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "emoji-picker-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { themeStore } from "@/store/themeStore";
import Button from "@/components/Button";
import { getTimeLabelIndexes } from "@/utils/groupTimeLabelMessages";
import { getFollowing } from "@/api/profileApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { Skeleton } from "@/components/ui/skeleton";
import useMessageStore from "@/store/messageStore";

export default function Message() {
	const user = ownerAccountStore((state) => state.user);
	// message socket
	// const { messages, setMessages, sendMessage, conversation, setConversation } =
	// 	useMessageSocket();

	const {
		messages,
		setMessages,
		sendMessage,
		conversation,
		setConversation,
		connectWebSocket,
		stompClient,
	} = useMessageStore();

	const theme = themeStore((state) => state.theme);
	// chỉ định content hiển thị ở bên phải tương ứng button bên trái cột danh sách hội thoại
	const [contentActive, setContentActive] = useState(0);
	// tạo cuộc hội thoại mới
	const [friendsList, setFriendsList] = useState(null);
	// Ẩn, hiện popup danh sách bạn bè tìm được
	const [showScrollFriends, setShowScrollFriends] = useState(false);

	const timeoutSearchRef = useRef(null);

	const handleOpenCreateConversation = () => {
		setContentActive(1);
	};

	const handleSearch = (value) => {
		if (timeoutSearchRef.current) {
			clearTimeout(timeoutSearchRef.current);
		}
		console.log(value);
		if (!showScrollFriends) setShowScrollFriends(true);
		timeoutSearchRef.current = setTimeout(async () => {
			// call api lấy list người owner account đang follow
			const resp = await getFollowing();
			if (!resp || resp.statusCode !== 200) return;
			setFriendsList(resp.data);
		}, 500);
	};

	const handleSelectFriend = (friend) => {
		const converExist = conversations.find(
			(conver) => conver.receiverId === friend.userId
		);
		if (converExist) {
			handleChooseConversation(converExist);
			setContentActive(2);
			setTrigger(!trigger);
			return;
		}
		// Clear message của người khác nếu có
		setMessages([]);
		console.log("Friend được chọn để tạo hội thoại mới: ", friend);
		const userId = friend.userId;
		delete friend.userId;
		setConversation({ ...friend, receiverId: userId });
		setContentActive(2);
		setTrigger(!trigger);
	};

	const handleCreateConversation = async () => {
		console.log("will create new conversation from this data: ", conversation);
		const resp = await createConversation(conversation.receiverId);
		if (!resp || resp.statusCode !== 200) return null;
		const data = await resp.data;
		console.log("id crated is: ", data.id);
		return data.id;
	};

	// Load tất cả các cuộc hội thoại
	const [conversations, setConversations] = useState(null);

	const handleGetAllConversation = async () => {
		const resp = await getConversations();
		if (!resp || resp.statusCode !== 200) {
			return;
		}
		const data = resp.data;
		setConversations(data);
	};

	const updateConversations = (baseConversation) => {
		setConversations((prevConversations) => {
			const existConversation = conversations.find(
				(conver) => conver.id === baseConversation.id
			);
			if (existConversation) {
				existConversation.lastMessage = baseConversation.lastMessage;
				return [
					existConversation,
					...prevConversations.filter(
						(conver) => conver.id !== existConversation.id
					),
				];
			}
			return [baseConversation, ...prevConversations];
		});
	};

	useEffect(() => {
		if (!user?.userId) return;
		connectWebSocket();
		// get all conversation
		handleGetAllConversation();
	}, [user?.userId]);

	// click chọn đoạn hội thoại
	const subscription = useRef(null);
	const controllerGetmsgs = useRef(null);
	const handleChooseConversation = async (selectedConver) => {
		if (
			conversation &&
			conversation.id === selectedConver.id &&
			contentActive === 2
		)
			return;
		if (selectedConver.lastMessage) selectedConver.lastMessage.read = true;
		setConversation(selectedConver);
		console.log("selectedConver is: ", selectedConver);

		if (subscription.current) subscription.current.unsubscribe();
		subscription.current = stompClient.subscribe(
			`/queue/private-${selectedConver.id}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				console.log("received trigger: ", receivedMessage);
				if (receivedMessage.receiverId !== user.userId) return;
				setMessages([...useMessageStore.getState().messages, receivedMessage]);
			}
		);

		setContentActive(2);
		setTrigger(!trigger);
		if (controllerGetmsgs.current) controllerGetmsgs.current.abort();
		controllerGetmsgs.current = new AbortController();
		const resp = await getMessages(
			selectedConver.id,
			controllerGetmsgs.current
		);
		if (!resp || resp.statusCode !== 200) {
			setMessages([]);
			return;
		}
		setMessages(resp.data.listMessages.reverse());
	};

	// Quay lại danh sách cuộc hội thoại (chỉ có ở mobile)
	const handleGoBack = () => {
		setContentActive(0);
		setConversation(null);
		setRealHeight(window.innerHeight);
	};

	// ở desktop, chỉ ấn enter sẽ tự gửi, xuống dòng phải đè shiftKey + enter
	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendMessage();
		}
	};

	// trigger auto focus lại textbox
	const [trigger, setTrigger] = useState(true);
	// messsage chuẩn bị gửi lưu ở đây
	const textbox = useRef(null);

	// gửi tin nhắn
	const handleSendMessage = async () => {
		const { innerText, innerHTML } = getTextboxData(textbox);
		if (!innerText || !innerHTML) {
			setTrigger(!trigger);
			return;
		}

		// tạo data message mới update trước lên UI
		const date = new Date();
		const createAt = date.toISOString().replace("Z", "+00:00");
		const baseMessage = {
			content: innerHTML,
			conversationId: conversation.id,
			createAt: createAt,
			read: true,
			receiverId: conversation.receiverId,
		};
		// base conversation
		const baseConversation = {
			...conversation,
			lastMessage: {
				content: innerHTML,
				createAt: createAt,
				read: true,
			},
		};
		// Update UI
		console.log("total messages: ", [...messages, baseMessage]);
		setMessages([...messages, baseMessage]);
		// check conversationId đã tồn tại không
		if (!conversation.id) {
			console.log("Chưa có conversation Id!!!");
			const id = await handleCreateConversation();
			console.log("id conversation response: ", id);
			setConversation({ ...conversation, id });
			sendMessage(innerHTML, id);
			updateConversations({ ...baseConversation, id });
		} else {
			sendMessage(innerHTML);
			updateConversations({ ...baseConversation, id: conversation.id });
		}

		// reset textbox
		setTimeout(() => {
			textbox.current.innerHTML = "";
			setTrigger(!trigger);
		}, 1);
	};
	// Vị trí avatar người nhận sẽ nhảy đến
	const [avatarReceiverPosition, setAvatarReceiverPosition] = useState(null);
	// vị trí các nhãn thời gian của từng block tin nhắn
	const [timeLabelIndexes, setTimeLabelIndexes] = useState([]);

	useEffect(() => {
		// tìm tin nhắn mới nhất người gửi đã gửi
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].receiverId !== conversation.receiverId) {
				setAvatarReceiverPosition(i);
				break;
			}
		}
		// handle chia block tin nhắn
		setTimeLabelIndexes(getTimeLabelIndexes(messages));
		console.log("Group label time indexes: ", getTimeLabelIndexes(messages));
		if (conversation) handleScrollMessages();
	}, [messages]);

	// container chứa tin nhắn
	const containerMessagesRef = useRef(null);
	const oldConverId = useRef("");
	const observer = useRef();
	const callBackAPI = (entries) => {
		if (entries[0].isIntersecting) {
			observer.current.unobserve(entries[0].target);
			console.log("scroll đến element thứ 1, trigger call API lấy message cũ");
		}
	};
	const handleScrollMessages = () => {
		// Tổng chiều cao toàn bộ nội dung trong scroll <= chiều cao phần scroll đang hiển thị
		// if (
		// 	containerMessagesRef.current.scrollHeight <=
		// 	containerMessagesRef.current.clientHeight
		// )
		// 	return;
		// cuộn lên không quá 800 || conversationId cũ khác conversationId hiện tại || tin nhắn mới là của bản thân
		// tự scroll đến đáy
		if (
			containerMessagesRef.current.scrollHeight -
				containerMessagesRef.current.scrollTop <
				800 ||
			oldConverId.current !== conversation.id ||
			messages.at(-1).receiverId !== user.userId
		) {
			setTimeout(() => {
				console.log("okay scroll");
				containerMessagesRef.current.scrollTo({
					top: containerMessagesRef.current.scrollHeight,
				});
				oldConverId.current = conversation.id;
				// intersectionObserver call API lấy tiếp tin nhắn cũ
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver(callBackAPI, {
					root: containerMessagesRef.current,
				});
				observer.current.observe(containerMessagesRef.current.childNodes[1]);
			}, 1);
		}
	};

	// kiểm soát message đang show message time
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
			className={`
			${[1, 2].includes(contentActive) && "sm:relative fixed top-0 sm:z-0 z-10"} 
			${![1, 2].includes(contentActive) && "overflow-hidden"}
			flex-grow sm:flex bg-background transition`}
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
					<Button
						className="btn-transparent !w-fit p-1"
						onClick={handleOpenCreateConversation}
					>
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
					{!conversations &&
						[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div key={i} className="px-3 py-2.5 h-16 flex items-center gap-3">
								<Skeleton className="size-11 rounded-full" />
								<div className="flex-grow space-y-2">
									<Skeleton className="w-1/2 h-4 rounded-sm" />
									<Skeleton className="h-4 rounded-sm" />
								</div>
							</div>
						))}
					{conversations?.length === 0 && (
						<p className="px-3 py-2.5">Bắt đầu tạo cuộc trò chuyện mới nào</p>
					)}
					{conversations?.map((conver, index) => (
						<div
							key={index}
							className={`
								px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-gray-2light transition cursor-pointer
								${conver.id === conversation?.id && "bg-gray-3light"}`}
							onClick={() => handleChooseConversation(conver)}
						>
							<Avatar className={`size-11`}>
								<AvatarImage src={conver.avatar} />
								<AvatarFallback className="fs-xs">
									{combineIntoAvatarName(conver.firstName, conver.lastName)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-grow min-w-0">
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{combineIntoDisplayName(conver.firstName, conver.lastName)}
									</span>
									{/* dấu chấm đánh dấu chưa đọc */}
									{conver.lastMessage && !conver.lastMessage.read && (
										<span className="size-2 bg-primary-gradient rounded-full" />
									)}
								</div>
								{conver.lastMessage && (
									<div className="flex gap-2 items-end justify-between">
										<div
											className={`line-clamp-1 text-gray ${
												!conver.lastMessage.read &&
												"font-semibold text-primary-text"
											}`}
											dangerouslySetInnerHTML={{
												__html: conver.lastMessage.content,
											}}
										></div>
										<span className="text-gray fs-xs text-nowrap">
											{dateTimeToMessageTime(conver.lastMessage.createAt)}
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
				className={`size-full bg-background ${
					[1, 2].includes(contentActive) && "sm:translate-y-0 -translate-y-full"
				} transition`}
			>
				{/* chưa click vào conversation nào */}
				{contentActive === 0 && (
					<div className="size-full place-content-center sm:grid hidden">
						Cùng bắt đầu trò chuyện với người theo dõi của bạn
					</div>
				)}

				{/* tạo conversation */}
				{contentActive === 1 && (
					<div className="size-full">
						{/* head */}
						<div className="relative h-14 px-5 border-b space-x-2 flex items-center">
							<button onClick={handleGoBack}>
								<ArrowLeftIcon className={"sm:hidden me-3"} />
							</button>
							<label htmlFor="new-to">Đến:</label>
							<input
								id="new-to"
								autoFocus
								className="bg-transparent outline-none w-full"
								autoComplete="off"
								placeholder="Nhập tên người dùng"
								onInput={(e) => handleSearch(e.target.value)}
								onFocus={(e) => handleSearch(e.target.value)}
								onBlur={() => setShowScrollFriends(false)}
							/>
							<div
								className={`absolute top-full left-12 mt-2 bg-background border rounded-lg p-2 ${
									showScrollFriends
										? "visible opacity-100"
										: "invisible opacity-0"
								} transition`}
							>
								<ScrollArea className="max-h-72 w-56">
									{!friendsList && (
										<div className="p-2 flex justify-center">
											<LoadingIcon />
										</div>
									)}
									{friendsList && friendsList.length === 0 && (
										<p className="text-center p-2">
											Hãy theo dõi ai đó để bắt đầu cuộc trò chuyện mới nhé
										</p>
									)}
									{friendsList &&
										friendsList.map((friend) => (
											<Button
												key={friend.userId}
												className="btn-transparent p-2 !justify-start"
												onClick={() => handleSelectFriend(friend)}
											>
												<Avatar className={`size-9 me-2`}>
													<AvatarImage src={friend.avatar} />
													<AvatarFallback className="fs-xs">
														{friend.firstName.charAt(0) ?? "?"}
													</AvatarFallback>
												</Avatar>
												<p className="font-semibold">
													{combineIntoDisplayName(
														friend.firstName,
														friend.lastName
													)}
												</p>
											</Button>
										))}
								</ScrollArea>
							</div>
						</div>
					</div>
				)}

				{/* đang nhắn tin */}
				{contentActive === 2 && (
					<div
						style={{ height: realHeight }}
						className="flex flex-col size-full"
					>
						{/* header thông tin */}
						<div
							className={`py-3 px-5 border-b flex items-center justify-between`}
						>
							<div className="flex items-center">
								<button onClick={handleGoBack}>
									<ArrowLeftIcon className={"sm:hidden me-3"} />
								</button>
								<Avatar className={`size-9 me-2`}>
									<AvatarImage src={conversation.avatar} />
									<AvatarFallback className="text-xs">
										{combineIntoAvatarName(
											conversation.firstName,
											conversation.lastName
										)}
									</AvatarFallback>
								</Avatar>
								<p className="font-semibold">
									{combineIntoDisplayName(
										conversation.firstName,
										conversation.lastName
									)}
								</p>
							</div>
							<Glyph />
						</div>
						{/* tin nhắn */}
						<div
							ref={containerMessagesRef}
							className="overflow-y-auto px-3 pb-2 flex-grow space-y-0.5"
						>
							{messages.map((message, index) => (
								<div key={index}>
									{/* label time for messages block */}
									{timeLabelIndexes.includes(index) && (
										<p
											className={`fs-xs pt-3 pb-1.5 text-gray text-center transition`}
										>
											{dateTimeToMessageTime(message.createAt)}
										</p>
									)}
									{message.receiverId !== user.userId ? (
										// when is owner-account's message
										<div
											className={`relative ${
												index === indexMsgShow && "pb-5"
											} transition`}
										>
											<div
												className={`
												px-3 py-1 ms-auto rounded-2xl w-fit md:max-w-[60%] max-w-[80%] text-txtWhite 
												${
													theme === "light"
														? "bg-primary-gradient"
														: "bg-gray-3light"
												} cursor-pointer transition`}
												dangerouslySetInnerHTML={{
													__html: message.content,
												}}
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
										// when is not owner-account's message
										<div
											className={`relative ${
												index === indexMsgShow && "pb-5"
											} transition`}
										>
											<div className="flex gap-1 items-end">
												{avatarReceiverPosition === index ? (
													<Avatar className={`size-6`}>
														<AvatarImage src={conversation.avatar} />
														<AvatarFallback className="text-[6px]">
															{combineIntoAvatarName(
																conversation.firstName,
																conversation.lastName
															)}
														</AvatarFallback>
													</Avatar>
												) : (
													<div className="size-6" />
												)}
												<div
													className={`px-3 py-1 rounded-2xl w-fit md:max-w-[60%] max-w-[80%] ${
														theme === "light"
															? "bg-secondary"
															: "bg-background ring-1 ring-gray-3light ring-inset"
													} cursor-pointer transition`}
													dangerouslySetInnerHTML={{
														__html: message.content,
													}}
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
										onClick={(e) => e.stopPropagation()}
									>
										<EmojiPicker
											onEmojiClick={handleEmojiClick}
											theme={theme}
										/>
									</PopoverContent>
								</PopoverTrigger>
							</Popover>
							<TextBox
								texboxRef={textbox}
								placeholder="Soạn tin nhắn"
								className="py-1.5 max-h-[120px] bg-gray-3light border rounded-3xl px-4 flex-grow scrollable-div"
								onKeyDown={textBoxOnKeyDown}
								autoFocus={true}
								trigger={trigger}
							/>
							<button
								onClick={handleSendMessage}
								className="bg-primary-gradient py-1.5 px-5 rounded-full"
							>
								<SendIcon color="stroke-txtWhite" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
