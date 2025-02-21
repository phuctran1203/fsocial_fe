import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Glyph } from "./Icon";
import { popupCommentStore } from "../store/popupStore";
import { postsStore } from "../store/postsStore";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Button from "./Button";

export default function Post({ post, className = "" }) {
	const location = useLocation();

	const { isVisible, setIsVisible, setId } = popupCommentStore();

	const likes = post.countLikes;

	const liked = post.liked;

	const updatePost = postsStore((state) => state.updatePost);

	const showCommentPopup = () => {
		if (isVisible) return;
		setIsVisible(true);
		setId(post.id);
	};

	const handleLike = () => {
		//call API
		updatePost(post.id, { liked: !liked, countLikes: liked ? likes - 1 : likes + 1 });
	};

	return (
		<div className={`md:py-4 py-3 space-y-3 ${className}`}>
			<div className="flex items-center justify-between px-4">
				<div className="flex space-x-2">
					<Link to="">
						<img
							src={post.avatar || "./temp/default_avatar.svg"}
							alt="avatar"
							className="md:size-11 size-9 rounded-full"
						/>
					</Link>
					<div className="flex flex-col justify-center">
						<Link to="" className="font-semibold">
							{post.displayName}
						</Link>
						<span className="text-gray fs-xsm">{dateTimeToNotiTime(post.createdAt).textTime}</span>
					</div>
				</div>
				<Popover>
					<PopoverTrigger>
						<Glyph />
					</PopoverTrigger>
					<PopoverContent className="bg-background w-52 shadow-2xl p-2">
						<Button className="btn-transparent !justify-start py-2 ps-3 text-nowrap">Báo cáo</Button>
						<Button className="btn-transparent !justify-start text-nowrap py-2 ps-3">Chỉnh sửa</Button>
						<Button className="btn-transparent !justify-start py-2 ps-3 text-nowrap">Xóa bài</Button>
					</PopoverContent>
				</Popover>
			</div>

			<div className="space-y-2">
				<div className="px-4" dangerouslySetInnerHTML={{ __html: post.content.htmltext }}></div>

				{/* assets post */}
				{post.content.media.length > 0 && (
					<div className="max-h-[200vh] border-y border-gray-3light overflow-hidden">
						<img src={`${post.content.media[0]}`} alt="Bài đăng" className="w-full" />
					</div>
				)}
			</div>

			<div className="flex justify-between px-4">
				{/* like button */}
				<div className="flex items-center sm:gap-2 gap-1 cursor-pointer" onClick={handleLike}>
					<svg className="sm:h-6 h-5" width="25" height="22" viewBox="0 0 25 22" fill="none">
						{/* stroke */}
						<path
							className={liked ? "fill-primary stroke-primary" : "fill-primary-text stroke-primary-text"}
							d="M12.4877 4.16991L11.9102 4.7257C12.0613 4.88268 12.2698 4.97138 12.4877 4.97138C12.7056 4.97138 12.914 4.88268 13.0651 4.7257L12.4877 4.16991ZM9.73709 17.871C8.11742 16.5942 6.34638 15.3473 4.94138 13.7652C3.56385 12.214 2.60293 10.4041 2.60293 8.05592H1C1 10.9043 2.1867 13.0774 3.74285 14.8296C5.27152 16.5509 7.22019 17.9279 8.74474 19.1298L9.73709 17.871ZM2.60293 8.05592C2.60293 5.75745 3.9017 3.82997 5.67453 3.01961C7.39683 2.23234 9.71103 2.44083 11.9102 4.7257L13.0651 3.61412C10.4557 0.903024 7.42678 0.456202 5.00814 1.56176C2.64002 2.64423 1 5.15774 1 8.05592H2.60293ZM8.74474 19.1298C9.29212 19.5613 9.87974 20.0215 10.4752 20.3694C11.0706 20.7172 11.7499 21 12.4877 21V19.3971C12.1568 19.3971 11.7675 19.2681 11.284 18.9854C10.8006 18.703 10.2992 18.3141 9.73709 17.871L8.74474 19.1298ZM16.2306 19.1298C17.7551 17.9279 19.7038 16.5509 21.2325 14.8296C22.7886 13.0774 23.9753 10.9043 23.9753 8.05592H22.3724C22.3724 10.4041 21.4115 12.214 20.0339 13.7652C18.6289 15.3473 16.8579 16.5942 15.2383 17.871L16.2306 19.1298ZM23.9753 8.05592C23.9753 5.15774 22.3353 2.64423 19.9671 1.56176C17.5485 0.456202 14.5196 0.903024 11.9102 3.61412L13.0651 4.7257C15.2643 2.44083 17.5785 2.23234 19.3008 3.01961C21.0736 3.82997 22.3724 5.75745 22.3724 8.05592H23.9753ZM15.2383 17.871C14.6761 18.3141 14.1747 18.703 13.6914 18.9854C13.2078 19.2681 12.8185 19.3971 12.4877 19.3971V21C13.2254 21 13.9048 20.7172 14.5001 20.3694C15.0956 20.0215 15.6832 19.5613 16.2306 19.1298L15.2383 17.871Z"
							strokeWidth={0.2}
						/>
						{/* inside */}
						<path
							className={liked ? "fill-primary stroke-primary" : ""}
							d="M12.4877 4.97138C12.2698 4.97138 12.0613 4.88268 11.9102 4.7257C9.71103 2.44083 7.39683 2.23234 5.67453 3.01961C3.9017 3.82997 2.60293 5.75745 2.60293 8.05592C2.60293 10.4041 3.56385 12.214 4.94138 13.7652C6.34638 15.3473 8.11742 16.5942 9.73709 17.871C10.2992 18.3141 10.8006 18.703 11.284 18.9854C11.7675 19.2681 12.1568 19.3971 12.4877 19.3971C12.8185 19.3971 13.2078 19.2681 13.6914 18.9854C14.1747 18.703 14.6761 18.3141 15.2383 17.871C16.8579 16.5942 18.6289 15.3473 20.0339 13.7652C21.4115 12.214 22.3724 10.4041 22.3724 8.05592C22.3724 5.75745 21.0736 3.82997 19.3008 3.01961C17.5785 2.23234 15.2643 2.44083 13.0651 4.7257C12.914 4.88268 12.7056 4.97138 12.4877 4.97138Z"
							strokeWidth={1}
						/>
					</svg>
					<span className={liked ? "text-primary" : ""}>{likes > 0 ? likes : "Tim"}</span>
				</div>

				{/* comment button */}
				<div className="flex items-center sm:gap-2 gap-1 cursor-pointer" onClick={showCommentPopup}>
					<svg className="sm:h-6 h-5" width="22" height="22" viewBox="0 0 22 22" fill="none">
						<path
							className="fill-primary-text stroke-primary-text"
							d="M6.87664 18.9942C6.98835 18.9756 7.10309 18.9916 7.20548 19.04C8.38157 19.5962 9.66992 19.8885 11.0008 19.8885C15.91 19.8885 19.8896 15.9089 19.8896 10.9998C19.8896 6.09071 15.91 2.11109 11.0008 2.11109C6.09174 2.11109 2.11212 6.09071 2.11212 10.9998C2.11212 12.8963 2.70687 14.7018 3.79492 16.2052C3.91221 16.3673 3.9333 16.5799 3.85015 16.7619L2.49634 19.7242L6.87664 18.9942ZM1.6479 20.9921C1.20879 21.0653 0.866255 20.6181 1.05129 20.2132L2.70758 16.5889C1.60261 14.9526 1.00103 13.0209 1.00103 10.9998C1.00103 5.47707 5.4781 1 11.0008 1C16.5236 1 21.0007 5.47707 21.0007 10.9998C21.0007 16.5226 16.5236 20.9996 11.0008 20.9996C9.56479 20.9996 8.17075 20.6964 6.8904 20.1183L1.6479 20.9921Z"
							strokeWidth="0.6"
						/>
					</svg>
					<span>{post.countComments > 0 ? post.countComments : "Bình luận"}</span>
				</div>

				{/* re post button */}
				<div className="flex items-center sm:gap-2 gap-1 cursor-pointer">
					<svg className="" width="24" height="17" viewBox="0 0 24 17" fill="none">
						<path
							className="stroke-primary-text"
							d="M14.8569 12.25L18.5712 16M18.5712 16L22.2855 12.25M18.5712 16L18.5714 5.99999C18.5714 3.23857 16.3542 1 13.619 1H9.90476M7.42857 4.74999L3.71429 1M3.71429 1L0 4.74999M3.71429 1L3.71429 11C3.71429 13.7614 5.93154 16 8.66667 16H12.381"
							strokeWidth="1.7"
						/>
					</svg>

					<span className={post.repost === 0 ? "sm:inline hidden" : "inline"}>
						{post.repost > 0 ? post.repost : "Đăng lại"}
					</span>
				</div>

				{/* share */}
				<div className="flex items-center gap-2 cursor-pointer">
					<svg className="sm:h-6 h-5" width="19" height="22" viewBox="0 0 19 22" fill="none">
						<path
							className="stroke-primary-text"
							d="M12.1109 4.88892L6.55534 8.77781M12.1109 17.1111L6.55534 13.2222M6.55556 11C6.55556 12.5341 5.3119 13.7778 3.77778 13.7778C2.24366 13.7778 1 12.5341 1 11C1 9.46592 2.24366 8.22225 3.77778 8.22225C5.3119 8.22225 6.55556 9.46592 6.55556 11ZM17.6669 18.2222C17.6669 19.7563 16.4232 21 14.8891 21C13.355 21 12.1113 19.7563 12.1113 18.2222C12.1113 16.6881 13.355 15.4444 14.8891 15.4444C16.4232 15.4444 17.6669 16.6881 17.6669 18.2222ZM17.6669 3.77778C17.6669 5.3119 16.4232 6.55556 14.8891 6.55556C13.355 6.55556 12.1113 5.3119 12.1113 3.77778C12.1113 2.24366 13.355 1 14.8891 1C16.4232 1 17.6669 2.24366 17.6669 3.77778Z"
							strokeWidth="1.5"
						/>
					</svg>
					<span className="sm:inline hidden">Chia sẻ</span>
				</div>
			</div>
		</div>
	);
}
