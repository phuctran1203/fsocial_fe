import React, { useState, useEffect, useRef } from "react";
import { dateTimeToMessageTime } from "../utils/convertDateTime";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { getConversations, getMessages } from "@/api/messageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/Button";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { Skeleton } from "@/components/ui/skeleton";
import useMessageStore from "@/store/messageStore";
import MessageHandleMessages from "@/components/MessageHandleMessages";
import MessageHandleCreateConversation from "@/components/MessageHandleCreateConversation";
import { cn } from "@/lib/utils";
import { CirclePlus, SearchIcon } from "lucide-react";

export default function Message() {
	const user = ownerAccountStore((state) => state.user);
	// message socket
	const {
		setMessages,
		conversation,
		setConversation,
		stompClient,
		newMessage,
		setNewMessage,
	} = useMessageStore();

	// chỉ định content hiển thị ở bên phải tương ứng button bên trái cột danh sách hội thoại
	const [contentActive, setContentActive] = useState(0);

	const handleOpenCreateConversation = () => {
		setContentActive(1);
	};

	// LOAD TẤT CẢ CUỘC TRÒ CHUYỆN
	const [conversations, setConversations] = useState(null);

	const handleGetAllConversation = async () => {
		const resp = await getConversations();
		if (!resp || resp.statusCode !== 200) {
			return;
		}
		const data = resp.data;
		setConversations(data);
		if (conversation) setContentActive(2);
	};

	useEffect(() => {
		if (!user?.userId) return;
		// get all conversation
		handleGetAllConversation();
		// reset newMessage global nếu có - message page mount -> bỏ circle new message ở navbar
		setNewMessage(null);
	}, [user?.userId]);

	// Cập nhật conversations
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

	// update lại giao diện list conversations khi có tin nhắn từ người khác đến,
	useEffect(() => {
		// User đang mở cuộc trò chuyện trùng với global message trigger
		if (
			!newMessage ||
			!conversation ||
			newMessage.conversationId === conversation.id
		)
			return;
		const baseConversation = {
			id: newMessage.conversationId,
			lastMessage: newMessage,
		};
		updateConversations(baseConversation);
		setNewMessage(null);
	}, [newMessage]);

	// HANDLE CHỌN CUỘC TRÒ CHUYỆN VÀ NHẮN TIN
	const subscription = useRef(null);
	const controllerGetmsgs = useRef(null);
	const handleChooseConversation = async (selectedConver) => {
		if (
			conversation &&
			conversation.id === selectedConver.id &&
			contentActive === 2
		)
			return;
		setTrigger(!trigger);
		if (selectedConver.lastMessage) selectedConver.lastMessage.read = true;
		setConversation(selectedConver);
		console.log("selectedConver is: ", selectedConver);

		if (subscription.current) await subscription.current.unsubscribe();
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
	// trigger auto focus lại textbox
	const [trigger, setTrigger] = useState(true);

	// Quay lại danh sách cuộc hội thoại (chỉ có ở mobile)
	const handleGoBack = () => {
		setContentActive(0);
		setConversation(null);
	};

	return (
		<div
			className={cn(
				"h-full flex-grow sm:flex bg-background transition",
				[1, 2].includes(contentActive) && "sm:relative fixed top-0 sm:z-0 z-10",
				![1, 2].includes(contentActive) && "overflow-hidden"
			)}
		>
			{/* Danh sách hội thoại */}
			<div
				className="
				flex flex-col pt-4 h-full
				sm:w-2/5 sm:min-w-[300px] sm:max-w-[350px] sm:gap-4 sm:border-r
				w-screen gap-2 transition"
			>
				<div className="px-4 flex items-center justify-between">
					<h2>Tin nhắn</h2>
					<Button
						className="btn-transparent !w-fit p-1"
						onClick={handleOpenCreateConversation}
					>
						<CirclePlus />
					</Button>
				</div>
				{/* search bar */}
				<label
					htmlFor="search-message"
					className="flex gap-2 p-2 mx-4 border rounded-full hover:border-gray transition"
				>
					<SearchIcon className="size-5 ms-1 my-auto text-gray" />
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
									<span className="font-medium">
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
					<MessageHandleCreateConversation
						handleGoBack={handleGoBack}
						handleChooseConversation={handleChooseConversation}
						setContentActive={setContentActive}
						conversations={conversations}
					/>
				)}

				{/* đang nhắn tin */}
				{contentActive === 2 && (
					<MessageHandleMessages
						handleGoBack={handleGoBack}
						trigger={trigger}
						setTrigger={setTrigger}
						updateConversations={updateConversations}
					/>
				)}
			</div>
		</div>
	);
}
