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
import useWebSocket from "@/hooks/useWebSocket";
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

export default function Message() {
	const user = ownerAccountStore((state) => state.user);
	const { messages, setMessages, sendMessage, conversation, setConversation } =
		useWebSocket(user.userId);
	const theme = themeStore((state) => state.theme);
	// chỉ định content hiển thị ở bên phải tương ứng button bên trái cột danh sách hội thoại
	const [contentActive, setContentActive] = useState(0);
	// tạo cuộc hội thoại mới
	const [friendsList, setFriendsList] = useState(null);
	// Ẩn, hiện popup danh sách bạn bè tìm được
	const [showScrollFriends, setShowScrollFriends] = useState(false);

	const timeoutSearchRef = useRef(null);

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
	const [conversations, setConversations] = useState([]);

	const handleGetAllConversation = async () => {
		const resp = await getConversations();
		const data = resp.data;
		setConversations(data);
	};

	const updateConversations = (baseConversation) => {
		// nếu đã có conversation
		// -> kéo lên đầu list conversations
		// -> udpate lại lastMessage
		// không có conversation
		// -> tạo mới 1 conversation và đẩy lên đầu list conversations
		setConversations((prevConversations) => {
			const existConversation = conversations.find(
				(conver) => conver.id === baseConversation.id
			);
			if (existConversation) {
				existConversation.lastMessage = baseConversation.lastMessage;
				const result = [
					existConversation,
					prevConversations.filter(
						(conver) => conver.id !== existConversation.id
					),
				];
				console.log("result updateConversations if has conver: ", result);

				return [
					existConversation,
					...prevConversations.filter(
						(conver) => conver.id !== existConversation.id
					),
				];
			}
			const result = [baseConversation, ...prevConversations];
			console.log("result updateConversations if not conver: ", result);
			return [baseConversation, ...prevConversations];
		});
	};

	useEffect(() => {
		if (!user?.userId) return;
		// get all conversation
		handleGetAllConversation();
	}, [user?.userId]);

	// click chọn đoạn hội thoại
	const handleChooseConversation = async (conversation) => {
		setContentActive(2);
		setTrigger(!trigger);
		setConversation(conversation);
		console.log("Conversation is: ", conversation);

		setMessages([]);
		const resp = await getMessages(conversation.id);
		setMessages(resp.data.reverse());
	};

	// Quay lại danh sách cuộc hội thoại (chỉ có ở mobile)
	const handleGoBack = () => {
		setContentActive(0);
		setRealHeight(window.innerHeight);
	};

	// ở desktop, chỉ ấn enter sẽ tự gửi, xuống dòng phải đè shiftKey + enter
	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendMsg();
		}
	};

	// trigger auto focus lại textbox
	const [trigger, setTrigger] = useState(true);
	// messsage chuẩn bị gửi lưu ở đây
	const textbox = useRef(null);

	// gửi tin nhắn
	const handleSendMsg = async () => {
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
		setMessages((prev) => [...prev, baseMessage]);
		// check conversationId đã tồn tại không
		if (!conversation.id) {
			console.log("Chưa có conversation Id!!!");
			const id = await handleCreateConversation();
			console.log("id conversation response: ", id);
			setConversation((prev) => ({ ...prev, id }));
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
	// container chứa tin nhắn
	const containerMessagesRef = useRef(null);

	useEffect(() => {
		// tìm tin nhắn mới nhất người gửi đã gửi
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].receiverId !== conversation.receiverId) {
				setAvatarReceiverPosition(i);
				break;
			}
		}
		// tin nhắn mới nhất mặc định hiển thị message time dưới nó
		setIndexMsgShow(messages.length - 1);
		// handle chia block tin nhắn
		setTimeLabelIndexes(getTimeLabelIndexes(messages));
		console.log("Group label time indexes: ", getTimeLabelIndexes(messages));
		// delay 120ms sẽ tự scroll đến tin nhắn cuối cùng
		if (containerMessagesRef.current) {
			setTimeout(() => {
				containerMessagesRef.current.scrollTo({
					top: containerMessagesRef.current.scrollHeight,
				});
				// bắt đầu intersectionObserver tin nhắn cũ nhất trong messages ở đây
				// để call API lấy tiếp tin nhắn cũ hơn
			}, 120);
		}
	}, [messages]);

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
			className={`${
				conversation && "sm:relative fixed top-0 sm:z-0 z-10"
			} flex-grow sm:flex bg-background transition`}
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
						onClick={() => setContentActive(1)}
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
					{conversations.map((conversation, index) => (
						<div
							key={index}
							className="px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-gray-3light ct-transition cursor-pointer"
							onClick={() => handleChooseConversation(conversation)}
						>
							<Avatar className={`size-11`}>
								<AvatarImage src={conversation.avatar} />
								<AvatarFallback className="fs-xs">
									{user.firstName.charAt(0) ?? "?"}
								</AvatarFallback>
							</Avatar>

							<div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{conversation.firstName + " " + conversation.lastName}
									</span>
									{/* dấu chấm đánh dấu chưa đọc */}
									{conversation.lastMessage &&
										!conversation.lastMessage.read && (
											<span className="size-2 bg-primary rounded-full" />
										)}
								</div>
								{conversation.lastMessage && (
									<div className="flex gap-2">
										<div
											className={`line-clamp-1 ${
												!conversation.lastMessage.read && "font-semibold"
											}`}
											dangerouslySetInnerHTML={{
												__html: conversation.lastMessage.content,
											}}
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
				{/* chưa click vào conversation nào */}
				{contentActive === 0 && (
					<div className="size-full place-content-center sm:grid hidden">
						Cùng bắt đầu trò chuyện với người theo dõi của bạn
					</div>
				)}
				{/* tạo conversation */}
				{contentActive === 1 && (
					<div className="size-full flex flex-col">
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
													{friend.firstName + " " + friend.lastName}
												</p>
											</Button>
										))}
								</ScrollArea>
							</div>
						</div>
						<div className="overflow-y-auto px-3 pt-4 pb-2 flex-grow">
							list friends or something
						</div>
					</div>
				)}
				{/* đang nhắn tin */}
				{contentActive === 2 && (
					<div className="flex flex-col size-full">
						{/* header thông tin */}
						<div
							className={`py-3 px-5 border-b flex items-center justify-between `}
						>
							<div className="flex items-center">
								<button onClick={handleGoBack}>
									<ArrowLeftIcon className={"sm:hidden me-3"} />
								</button>
								<Avatar className={`size-9 me-2`}>
									<AvatarImage src={conversation.avatar} />
									<AvatarFallback className="fs-xs">
										{conversation.firstName.charAt(0) ?? "?"}
									</AvatarFallback>
								</Avatar>
								<p className="font-semibold">
									{conversation.firstName + " " + conversation.lastName}
								</p>
							</div>
							<Glyph />
						</div>
						{/* tin nhắn */}
						<div
							ref={containerMessagesRef}
							className="overflow-y-auto px-3 pt-4 pb-2 flex-grow space-y-0.5"
						>
							{messages.map((message, index) => (
								<div key={index}>
									{/* label time for messages block */}
									{timeLabelIndexes.includes(index) && (
										<p
											className={`fs-xs -z-10 text-gray text-center transition`}
										>
											{dateTimeToMessageTime(message.createAt)}
										</p>
									)}
									{message.receiverId !== user.userId ? (
										// when owner-account's message
										<div
											className={`relative ${
												index === indexMsgShow && "pb-5"
											} transition`}
										>
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
										<div
											className={`relative ${
												index === indexMsgShow && "pb-5"
											} transition`}
										>
											<div className="flex gap-1 items-end">
												{avatarReceiverPosition === index ? (
													<Avatar className={`size-6`}>
														<AvatarImage src={conversation.avatar} />
														<AvatarFallback className="text-[8px]">
															{conversation.firstName.charAt(0) ?? "?"}
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
								onClick={handleSendMsg}
								className="bg-primary py-1.5 px-5 rounded-full"
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
