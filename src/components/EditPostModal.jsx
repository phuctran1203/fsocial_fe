import React, { useEffect, useRef, useState } from "react";
import { TextBox } from "./Field";
import { popupEditPostStore } from "@/store/popupStore";
import { LoadingIcon, XMarkIcon } from "./Icon";
import { postsStore } from "@/store/postsStore";
import { themeStore } from "@/store/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateTimeToPostTime } from "@/utils/convertDateTime";
import Button from "./Button";
import { toast } from "sonner";

export default function EditPostModal() {
	const { id, isVisible, setIsVisible, setId } = popupEditPostStore();

	const textbox = useRef(null);

	const post = postsStore.getState().findPost(id);

	const [submitClicked, setSubmitClicked] = useState(false);

	const handleUpdate = () => {
		setSubmitClicked(true);

		setTimeout(() => {
			setSubmitClicked(false);
			toast.success("Đã cập nhật bài viết");
			setIsVisible(false);
		}, 3000);
	};

	const [trigger, setTrigger] = useState(true);

	useEffect(() => {
		if (isVisible) {
			setTrigger(!trigger);
		} else {
			setId(null);
		}
	}, [isVisible]);

	const theme = themeStore((state) => state.theme);

	return (
		<div
			className={`z-20 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isVisible ? "bg-opacity-30 visible" : "bg-opacity-0 invisible"
			}
			transition`}
			onClick={() => setIsVisible(false)}
		>
			<div
				className={` 
				pb-3 flex flex-col bg-background rounded-lg w-[550px] min-h-full sm:min-h-[70dvh] max-h-full overflow-hidden ${
					theme === "dark" && "sm:border"
				}
				${isVisible ? "translate-y-0" : "translate-y-[100vh]"}
				transition-all`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sticky top-0 py-2 border-b">
					<h4 className="text-center">Chỉnh sửa bài viết</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={() => setIsVisible(false)}>
						<XMarkIcon />
					</button>
				</div>

				<div className="space-y-2 overflow-y-auto scrollable-div pt-3 mb-3">
					<div className="flex space-x-2 px-3">
						<Avatar className={`md:size-11 size-9 grid`}>
							<AvatarImage src={post?.avatar} />
							<AvatarFallback className="font-semibold">{post?.displayName.charAt(0) ?? "?"}</AvatarFallback>
						</Avatar>

						<div className="flex flex-col justify-center">
							<span className="font-semibold">{post?.displayName}</span>
							<span className="text-gray fs-xs">{dateTimeToPostTime(post?.createdAt)}</span>
						</div>
					</div>

					<TextBox
						texboxRef={textbox}
						className="px-3"
						innerHTML={post?.content.htmltext}
						autoFocus={true}
						trigger={trigger}
					/>
					{/* assets post */}
					{post?.content.media.length > 0 && (
						<div className="max-h-[200vh] border-y overflow-hidden transition">
							<img src={`${post.content.media[0]}`} alt="Bài đăng" className="w-full" />
						</div>
					)}
				</div>

				<div className="sticky bottom-0 mx-3">
					<Button
						className={`btn-primary py-2.5 w-full rounded-[4px] ${submitClicked && "disable-btn"}`}
						onClick={handleUpdate}
					>
						{submitClicked ? <LoadingIcon /> : "Cập nhật"}
					</Button>
				</div>
			</div>
		</div>
	);
}
