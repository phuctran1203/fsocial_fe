import { dateTimeToMessageTime } from "@/utils/convertDateTime";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import useMessageStore from "@/store/messageStore";
import { getTimeLabelIndexes } from "@/utils/groupTimeLabelMessages";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { themeStore } from "@/store/themeStore";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { ArrowLeftIcon, Ellipsis, Send } from "lucide-react";
import { ImageIcon, SmileIcon, XMarkIcon } from "./Icon";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import EmojiPicker from "emoji-picker-react";
import { TextBox } from "./Field";
import { createConversation } from "@/api/messageApi";
import { getTextboxData } from "@/utils/processTextboxData";
import { Skeleton } from "./ui/skeleton";

export default function MessageListMessages({
	handleGoBack,
	trigger,
	setTrigger,
	updateConversations,
}) {
	const user = ownerAccountStore((state) => state.user);
	const theme = themeStore((state) => state.theme);
	const {
		ready,
		setReady,
		messages,
		setMessages,
		sendMessage,
		conversation,
		setConversation,
	} = useMessageStore();
	const [indexMsgShow, setIndexMsgShow] = useState(-1);

	const showTimeLabel = (index) => {
		if (index === indexMsgShow) {
			setIndexMsgShow(-1);
			return;
		}
		setIndexMsgShow(index);
	};

	// Vị trí avatar người nhận sẽ nhảy đến
	const [avatarReceiverPosition, setAvatarReceiverPosition] = useState(null);
	// vị trí các nhãn thời gian của từng block tin nhắn
	const [timeLabelIndexes, setTimeLabelIndexes] = useState([]);

	useEffect(() => {
		if (!messages) {
			setReady(false);
			return;
		}

		// tìm tin nhắn mới nhất người gửi đã gửi
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].receiverId !== conversation.receiverId) {
				setAvatarReceiverPosition(i);
				break;
			}
		}
		// handle chia block tin nhắn -> hiển thị nhãn time trên từng block
		setTimeLabelIndexes(getTimeLabelIndexes(messages));
		if (containerMessagesRef.current) handleScrollMessages();
	}, [messages]);

	// HANDLE TỰ ĐỘNG CUỘN XUỐNG ĐÁY VÀ LẤY TIN NHẮN CŨ HƠN KHI USER CUỘN LÊN
	// container chứa tin nhắn
	const containerMessagesRef = useRef(null);
	const oldConverId = useRef("");
	const observer = useRef();
	// const [ready, setReady] = useState(false);

	const callBackAPI = (entries) => {
		if (entries[0].isIntersecting) {
			observer.current.unobserve(entries[0].target);
		}
	};
	const handleScrollMessages = () => {
		// cuộn lên không quá 800 || conversationId trước đó khác conversationId hiện tại || tin nhắn mới là của bản thân
		// => tự scroll đến đáy & tự trigger lấy tin nhắn cũ hơn
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
				setReady(true);
				oldConverId.current = conversation.id;
				// hủy observer cũ
				if (observer.current) observer.current.disconnect();
				// có ít nhất 2 tin nhắn mới intersector
				if (!containerMessagesRef.current.childNodes[1]) return;
				// tạo intersectionObserver call API lấy tiếp tin nhắn cũ
				observer.current = new IntersectionObserver(callBackAPI, {
					root: containerMessagesRef.current,
				});
				observer.current.observe(containerMessagesRef.current.childNodes[1]);

				// set ready hiển thị message
			}, 100);
		}
	};

	// Ở desktop, chỉ ấn enter sẽ tự gửi, xuống dòng phải đè shiftKey + enter
	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendMessage();
		}
	};

	// Tạo hội thoại khi gửi tin nhắn đến 1 người chưa có conversation nào với owner
	const handleCreateConversation = async () => {
		console.log("will create new conversation from this data: ", conversation);
		const resp = await createConversation(conversation.receiverId);
		if (!resp || resp.statusCode !== 200) return null;
		const data = await resp.data;
		console.log("id created is: ", data.id);
		return data.id;
	};

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
		setMessages([...messages, baseMessage]);
		// check conversationId đã tồn tại không
		if (!conversation.id) {
			console.log("Chưa có conversation Id!!!");
			const id = await handleCreateConversation();
			console.log("id conversation vừa tạo mới: ", id);
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

	// handle show/hide emoji picker
	const handleEmojiClick = (emojiObject) => {
		textbox.current.innerHTML += emojiObject.emoji;
	};

	// Handle chọn gửi ảnh
	const [image, setImage] = useState(null);
	const onFileChanged = (e) => {
		const el = e.target;
		const file = el.files[0];
		if (!file) return;
		console.log("có file");
		const imageURL = URL.createObjectURL(file);
		setImage(imageURL);
		el.value = "";
	};
	const removeImage = () => {
		setImage(null);
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
			className="relative flex flex-col size-full"
		>
			{/* header thông tin */}
			<div className={`py-3 px-5 border-b flex items-center justify-between`}>
				<div className="flex items-center">
					<button onClick={handleGoBack}>
						<ArrowLeftIcon className={"sm:hidden me-3"} />
					</button>
					<Avatar className={`size-9 me-2`}>
						<AvatarImage src={conversation?.avatar} />
						<AvatarFallback className="text-xs">
							{combineIntoAvatarName(
								conversation?.firstName,
								conversation?.lastName
							)}
						</AvatarFallback>
					</Avatar>
					<p className="font-medium">
						{combineIntoDisplayName(
							conversation?.firstName,
							conversation?.lastName
						)}
					</p>
				</div>
				<Ellipsis />
			</div>

			<div className="relative flex-grow min-h-0">
				{/* skeleton */}
				{!ready && (
					<div className="absolute overflow-hidden inset-0 pt-3 bg-background z-10 px-3 pb-2 space-y-0.5">
						<Skeleton className="ms-7 w-32 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-48 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-28 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-28 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-44 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-44 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-32 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-28 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-44 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-32 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-28 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-44 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-28 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-7 w-24 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-44 sm:h-8 h-7 rounded-2xl" />
						<Skeleton className="ms-auto w-28 sm:h-8 h-7 rounded-2xl" />
					</div>
				)}

				<div
					ref={containerMessagesRef}
					className="overflow-y-auto h-full px-3 pb-2 space-y-0.5"
				>
					{messages?.map((message, index) => (
						<div key={index}>
							{/* label time for messages block */}
							{timeLabelIndexes.includes(index) && (
								<p
									className={`fs-xs pt-3 pb-1.5 text-gray text-center transition`}
								>
									{dateTimeToMessageTime(message.createAt)}
								</p>
							)}

							{/* when is owner-account's message */}
							{message.receiverId !== user.userId && (
								<div
									className={`relative ${
										index === indexMsgShow && "pb-5"
									} transition`}
								>
									<div
										className={cn(
											"px-3 py-1 ms-auto rounded-2xl w-fit md:max-w-[60%] max-w-[80%] text-txtWhite cursor-pointer transition",
											theme === "light"
												? "bg-primary-gradient"
												: "bg-gray-3light"
										)}
										dangerouslySetInnerHTML={{
											__html: message.content,
										}}
										onClick={() => showTimeLabel(index)}
									/>
									<p
										className={cn(
											"fs-xs -z-10 text-gray absolute bottom-0 right-1 transition",
											index === indexMsgShow ? "opacity-100" : "opacity-0"
										)}
									>
										{dateTimeToMessageTime(message.createAt)}
									</p>
								</div>
							)}

							{/* when is not owner-account's message */}
							{message.receiverId === user.userId && (
								<div
									className={cn(
										"relative transition",
										index === indexMsgShow && "pb-5"
									)}
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
											className={cn(
												"px-3 py-1 rounded-2xl w-fit md:max-w-[60%] max-w-[80%] cursor-pointer transition bg-secondary",
												theme === "dark" &&
													"bg-background ring-1 ring-gray-3light ring-inset"
											)}
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
			</div>

			{/* Thanh nhập tin nhắn */}
			<div className="relative bg-background flex items-end sm:mx-6 m-4 border-2 rounded-3xl px-2 hover:border-gray-light">
				{/* previewImages */}
				{image && (
					<div className="absolute bottom-full left-10 mb-3 h-60 bg-background border rounded-lg p-3">
						<div className="relative h-full">
							<img src={image} alt="" className="h-full" />
							<button
								className="btn-secondary absolute size-6 border right-0 top-0 translate-x-1/4 -translate-y-1/4"
								onClick={removeImage}
							>
								<XMarkIcon className="size-4" strokeWidth={2.5} />
							</button>
						</div>
					</div>
				)}

				<Popover>
					<PopoverTrigger className="h-10">
						<SmileIcon className="size-[22px]" />
						<PopoverContent
							side="bottom"
							align="start"
							sideOffset={30}
							className="bg-background w-fit p-0 rounded-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="w-[340px] max-w-screen p-2">
								<EmojiPicker
									onEmojiClick={handleEmojiClick}
									theme={theme}
									width={"100%"}
								/>
							</div>
						</PopoverContent>
					</PopoverTrigger>
				</Popover>

				<label className="h-10 px-1 place-content-center cursor-pointer">
					{/* how? lạ nhể, ko cóa layout mà vẫn place center được =)) ? */}
					<ImageIcon className="size-[21px]" />
					<input
						type="file"
						hidden
						accept=".png, .jpg, .jpeg"
						onChange={onFileChanged}
					/>
				</label>

				<TextBox
					texboxRef={textbox}
					placeholder="Soạn tin nhắn"
					className="py-2 max-h-[160px] px-2 scrollable-div"
					onKeyDown={textBoxOnKeyDown}
					autoFocus={true}
					trigger={trigger}
				/>

				<button
					onClick={handleSendMessage}
					className="grid place-content-center h-10 pe-1"
				>
					<Send className="size-5" strokeWidth={1.6} />
				</button>
			</div>
		</div>
	);
}
