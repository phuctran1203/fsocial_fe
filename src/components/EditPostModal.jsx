import React, { useRef, useState } from "react";
import { TextBox } from "./Field";
import { usePopupStore } from "@/store/popupStore";
import { LoadingIcon } from "./Icon";
import { postsStore } from "@/store/postsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateTimeToPostTime } from "@/utils/convertDateTime";
import Button from "./Button";
import { toast } from "sonner";
import { updatePost } from "@/api/postsApi";

export default function EditPostModal({ id }) {
	const hidePopup = usePopupStore((state) => state.hidePopup);

	const textbox = useRef(null);

	const post = postsStore.getState().findPost(id);

	const replacePost = postsStore((state) => state.replacePost);

	const [submitClicked, setSubmitClicked] = useState(false);

	const handleUpdate = async () => {
		setSubmitClicked(true);
		const formData = new FormData();
		formData.append("text", textbox.current.innerText);
		formData.append("HTMLText", textbox.current.innerHTML);
		formData.append("postId", id);

		const respUpdate = await updatePost(formData);
		if (respUpdate?.statusCode === 200) {
			toast.success("Đã cập nhật bài viết");
			const newPost = respUpdate.data;
			replacePost(newPost);
			hidePopup();
		} else {
			toast.error("Cập nhật bài viết thất bại");
			setSubmitClicked(false);
		}
	};

	return (
		<div className="relative flex-grow flex flex-col sm:w-[550px] sm:h-fit sm:max-h-[90dvh] h-[100dvh]">
			<div className="flex-grow pt-3 space-y-2 overflow-y-auto scrollable-div">
				<div className="flex space-x-2 px-3">
					<Avatar className={`md:size-11 size-9 grid`}>
						<AvatarImage src={post.avatar} />
						<AvatarFallback className="font-semibold">{post.displayName.charAt(0) ?? "?"}</AvatarFallback>
					</Avatar>

					<div className="flex flex-col justify-center">
						<span className="font-semibold">{post.displayName}</span>
						<span className="text-gray fs-xs">{dateTimeToPostTime(post.createdAt)}</span>
					</div>
				</div>

				<TextBox texboxRef={textbox} className="px-3" innerHTML={post.content.htmltext} autoFocus={true} />
				{/* assets post */}
				{post.content.media.length > 0 && (
					<div className="max-h-[200vh] border-y overflow-hidden transition">
						<img src={`${post.content.media[0]}`} alt="Bài đăng" className="w-full" />
					</div>
				)}
			</div>

			<div className="sticky bottom-0 p-3 bg-background">
				<Button className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`} onClick={handleUpdate}>
					{submitClicked ? <LoadingIcon /> : "Cập nhật"}
				</Button>
			</div>
		</div>
	);
}
