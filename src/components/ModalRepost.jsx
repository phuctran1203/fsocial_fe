import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateTimeToPostTime } from "@/utils/convertDateTime";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { usePopupStore } from "@/store/popupStore";
import { postsStore } from "@/store/postsStore";
import { TextBox } from "./Field";
import Button from "./Button";
import { LoadingIcon } from "./Icon";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import Post from "./Post";

export default function ModalRepost({ id }) {
	const user = ownerAccountStore((state) => state.user);
	const hidePopup = usePopupStore((state) => state.hidePopup);
	const textbox = useRef(null);
	const post = postsStore.getState().findPost(id);
	const [submitClicked, setSubmitClicked] = useState(false);
	const handleRepost = async () => {
		setSubmitClicked(true);
		hidePopup();
	};

	return (
		<div className="relative flex-grow flex flex-col sm:w-[550px] w-screen sm:h-fit sm:max-h-[90dvh] h-[100dvh]">
			<div className="flex-grow space-y-2 overflow-y-auto scrollable-div">
				<div className="flex items-center space-x-2 px-4">
					<Avatar className={`size-9 grid`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="text-[11px]">
							{combineIntoAvatarName(user.firstName, user.lastName)}
						</AvatarFallback>
					</Avatar>

					<span className="font-semibold">
						{combineIntoDisplayName(user.firstName, user.lastName)}
					</span>
				</div>

				<TextBox
					texboxRef={textbox}
					className="px-4"
					autoFocus={true}
					placeholder="Chia sẻ suy nghĩ của bạn về bài viết này"
				/>

				<Post
					post={post}
					isChildren={true}
					showReact={false}
					className="border-y rounded-md"
				/>
			</div>

			<div className="sticky bottom-0 p-3 bg-background">
				<Button
					className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`}
					onClick={handleRepost}
				>
					{submitClicked ? <LoadingIcon /> : "Đăng tải"}
				</Button>
			</div>
		</div>
	);
}
