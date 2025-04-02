import React, { useRef, useState } from "react";
import { ArrowLeftIcon, LoadingIcon } from "./Icon";
import { ScrollArea } from "./ui/scroll-area";
import Button from "./Button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFollowing } from "@/api/profileApi";
import useMessageStore from "@/store/messageStore";
import { combineIntoDisplayName } from "@/utils/combineName";

export default function MessageHandleCreateConversation({
	handleGoBack,
	handleChooseConversation,
	setContentActive,
	conversations,
}) {
	const { setMessages, setConversation } = useMessageStore();
	const [showScrollFriends, setShowScrollFriends] = useState(false);
	const [friendsList, setFriendsList] = useState(null);
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
		const converExist = conversations.find(
			(conver) => conver.receiverId === friend.userId
		);
		if (converExist) {
			handleChooseConversation(converExist);
			setContentActive(2);
			return;
		}
		// Clear message của người khác nếu có
		setMessages([]);
		console.log("Friend được chọn để tạo hội thoại mới: ", friend);
		const userId = friend.userId;
		delete friend.userId;
		setConversation({ ...friend, receiverId: userId });
		setContentActive(2);
	};

	return (
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
						showScrollFriends ? "visible opacity-100" : "invisible opacity-0"
					} transition`}
				>
					<ScrollArea className="max-h-72 w-56">
						{!friendsList && (
							<div className="p-2 flex justify-center">
								<LoadingIcon />
							</div>
						)}

						{friendsList?.length === 0 && (
							<p className="text-center p-2">
								Hãy theo dõi ai đó để bắt đầu cuộc trò chuyện mới nhé
							</p>
						)}

						{friendsList?.map((friend) => (
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
								<p className="font-medium">
									{combineIntoDisplayName(friend.firstName, friend.lastName)}
								</p>
							</Button>
						))}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
