import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { usePopupStore } from "@/store/popupStore";
import { TextBox } from "./Field";
import Button from "./Button";
import { LoadingIcon } from "./Icon";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import Post from "./Post";
import { getPost, repostPost } from "@/api/postsApi";
import { getTextboxData } from "@/utils/processTextboxData";
import { toast } from "sonner";
import { useHomePostsStore } from "@/store/postsStore";

export default function ModalRepost({ id, store }) {
	const user = ownerAccountStore.getState().user;
	const hidePopup = usePopupStore((state) => state.hidePopup);
	const textbox = useRef(null);

	const [submitClicked, setSubmitClicked] = useState(false);
	const { insertPost } = useHomePostsStore();

	const [post, setPost] = useState(null);

	const handleGetPost = async () => {
		const resp = await getPost(user.userId, id);
		if (!resp || resp.statusCode !== 200) {
			toast.error("Lấy thông tin bài viết thất bại");
			return;
		}
		setPost(resp.data);
	};

	const handleRepost = async () => {
		const { innerText, innerHTML } = getTextboxData(textbox);
		setSubmitClicked(true);
		const formData = new FormData();
		formData.append("userId", user.userId);
		formData.append("text", innerText);
		formData.append("HTMLText", innerHTML);
		formData.append("originPostId", id);

		const resp = await repostPost(formData);
		setSubmitClicked(false);
		if (!resp || resp.statusCode !== 200) {
			toast.error("Đăng bài viết thất bại");
			return;
		}
		const postCreated = {
			...resp.data,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
		};

		insertPost(postCreated);
		toast.success("Đăng bài viết thành công");
		hidePopup();
	};

	useEffect(() => {
		const founded = store.getState().findPost(id);
		if (founded) {
			setPost(founded);
		} else {
			handleGetPost();
		}
	}, []);

	return (
		<div className="relative pt-11 flex flex-col sm:w-[550px] w-screen sm:h-fit sm:max-h-[90dvh] h-[100dvh]">
			<div className="mt-3 flex-grow space-y-2 overflow-y-auto scrollable-div">
				<div className="flex items-center space-x-2 px-4">
					<Avatar className={`size-9 grid`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="text-[11px] font-medium">
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

				{post && (
					<Post
						post={post}
						isChildren={true}
						showReact={false}
						className="border-y rounded-md"
						store={store}
					/>
				)}
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
