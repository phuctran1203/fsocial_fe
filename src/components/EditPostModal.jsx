import React, { useEffect, useRef, useState } from "react";
import { TextBox } from "./Field";
import { usePopupStore } from "@/store/popupStore";
import { LoadingIcon } from "./Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateTimeToPostTime } from "@/utils/convertDateTime";
import Button from "./Button";
import { toast } from "sonner";
import { getPost, updatePost } from "@/api/postsApi";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import GenerateMediaLayout from "./GenerateMediaLayout";
import { processMedias } from "@/utils/processMedia";

export default function EditPostModal({ id, store }) {
	const hidePopup = usePopupStore((state) => state.hidePopup);
	const { findPost, replacePost } = store();
	const textbox = useRef(null);

	// chuẩn bị data, trường hợp tìm trong 1 store mà chưa có post đó, tự call api lấy về
	const [post, setPost] = useState(null);

	const handleGetPost = async () => {
		// const post = store.getState().findPost(id);
		const found = findPost(id);
		if (found) {
			setPost(found);
			return;
		}
		const resp = await getPost(user.userId, id);
		if (!resp || resp.statusCode !== 200) return;
		setPost(resp.data);
	};

	useEffect(() => {
		handleGetPost();
	}, []);

	const [submitClicked, setSubmitClicked] = useState(false);

	const handleUpdate = async () => {
		setSubmitClicked(true);
		const formData = new FormData();
		formData.append("text", textbox.current.innerText);
		formData.append("HTMLText", textbox.current.innerHTML);
		formData.append("postId", id);

		const respUpdate = await updatePost(formData);
		setSubmitClicked(false);
		if (!respUpdate || respUpdate.statusCode !== 200) {
			toast.error("Cập nhật bài viết thất bại");
			return;
		}
		toast.success("Đã cập nhật bài viết");
		const newPost = respUpdate.data;
		replacePost(newPost);
		hidePopup();
	};

	return (
		<div className="relative pt-10 flex flex-col sm:w-[550px] sm:h-fit sm:max-h-[90dvh] h-[100dvh]">
			{post && (
				<div className="flex-grow pt-3 space-y-2 overflow-y-auto scrollable-div">
					<div className="flex space-x-2 px-4">
						<Avatar className={`size-9`}>
							<AvatarImage src={post.avatar} />
							<AvatarFallback className="text-[11px] font-medium">
								{combineIntoAvatarName(post.firstName, post.lastName)}
							</AvatarFallback>
						</Avatar>

						<div className="flex flex-col justify-center">
							<span className="font-semibold">
								{combineIntoDisplayName(post.firstName, post.lastName)}
							</span>
							<span className="text-gray fs-xs">
								{dateTimeToPostTime(post.createDatetime)}
							</span>
						</div>
					</div>

					<TextBox
						texboxRef={textbox}
						className="px-4"
						innerHTML={post.content.htmltext}
						autoFocus={true}
					/>
					{/* assets post */}

					<GenerateMediaLayout medias={processMedias(post)} blockEvent={true} />
				</div>
			)}

			<div className="sticky bottom-0 p-3 bg-background">
				<Button
					className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`}
					onClick={handleUpdate}
				>
					{submitClicked ? <LoadingIcon /> : "Cập nhật"}
				</Button>
			</div>
		</div>
	);
}
