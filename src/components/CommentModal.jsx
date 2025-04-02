import React, { useEffect, useRef, useState } from "react";
import { LoadingIcon, XMarkIcon } from "./Icon";
import Post from "./Post";
import {
	getComments,
	sendComment,
	replyComment,
	getRepliesComment,
} from "../api/commentsApi";

import { ownerAccountStore } from "../store/ownerAccountStore";
import { TextBox } from "./Field";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTextboxData } from "@/utils/processTextboxData";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { HeartPostIcon } from "./Icon";
import { usePopupStore } from "@/store/popupStore";
import Button from "./Button";
import { Send } from "lucide-react";
import { getPost } from "@/api/postsApi";

function RenderComment({ ...props }) {
	const { comment, selectCommentToReply, handleShowReplyComment, replies } =
		props;
	// if (comment.reply != undefined) {
	// console.log("all props is: ", props);
	// console.log("comment is: ", comment);
	// console.log("replies is: ", replies);
	// }
	const navigate = useNavigate();

	const hidePopup = usePopupStore((state) => state.hidePopup);

	const [like, setLike] = useState(false);

	const [countLikes, setCountLikes] = useState(comment.countLikes);

	const handleClickLike = () => {
		setLike(!like);
		setCountLikes(like ? countLikes - 1 : countLikes + 1);
	};

	const handleDirectToProfile = () => {
		hidePopup();
		navigate(`/profile?id=${comment.userId}`);
	};

	return (
		<div className="flex gap-3">
			{/* avatar */}

			<Avatar
				className={`size-9 cursor-pointer`}
				onClick={handleDirectToProfile}
			>
				<AvatarImage src={comment.avatar} />
				<AvatarFallback className="text-[11px]">
					{combineIntoAvatarName(comment.firstName, comment.lastName)}
				</AvatarFallback>
			</Avatar>

			<div>
				<div className="space-y-1">
					{/* tên */}
					<Button
						onClick={handleDirectToProfile}
						className="font-semibold text-gray fs-xs hover:underline hover:text-primary-text"
					>
						{combineIntoDisplayName(comment.firstName, comment.lastName)}
					</Button>
					{/* nội dung cmt */}
					<div dangerouslySetInnerHTML={{ __html: comment.content.htmltext }} />
					{/* time, like, reply button */}
					<div className="flex items-center gap-2 text-gray">
						<span className="text-gray fs-sm">
							{dateTimeToNotiTime(comment.createDatetime).textTime}
						</span>

						<button
							className="flex items-center gap-1"
							onClick={handleClickLike}
						>
							<HeartPostIcon
								compareVar={like}
								className="sm:h-[15px] h-[13px]"
								fill="fill-gray"
							/>
							<span className={`fs-sm ${like && "text-primary"}`}>
								{countLikes}
							</span>
						</button>

						<button
							className="fs-sm hover:text-primary-text"
							onClick={() => {
								selectCommentToReply({ ...comment });
							}}
						>
							Phản hồi
						</button>
					</div>
				</div>

				{comment.reply && (
					<div className="mt-3 space-y-2">
						{!replies ? (
							<button
								className="fs-xs ps-2 font-semibold text-gray hover:underline"
								onClick={() => handleShowReplyComment(comment.id)}
							>
								Xem phản hồi
							</button>
						) : (
							replies.reply.map((cmtReply, index) => (
								<RenderComment
									key={index}
									comment={cmtReply}
									selectCommentToReply={selectCommentToReply}
								/>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default function CommentModal({ id, store }) {
	const user = ownerAccountStore((state) => state.user);
	const textbox = useRef(null);
	const { posts, updatePost } = store();

	// chuẩn bị data
	const [post, setPost] = useState(null);

	const handleGetPost = async () => {
		const found = posts?.find((p) => p.id == id);
		if (found) {
			setPost(found);
			getComment(id);
			return;
		}
		const resp = await getPost(user.userId, id);
		if (!resp || resp.statusCode !== 200) return;
		setPost(resp.data);
		getComment(id);
	};

	const [comments, setComments] = useState([]);

	const getComment = async (id) => {
		const respGetComment = await getComments(id);
		if (!respGetComment || respGetComment.statusCode !== 207) return;
		setComments(respGetComment.data.reverse());
	};

	useEffect(() => {
		handleGetPost();
	}, []);

	// Handle gửi comment
	const [submitCmtClicked, setSubmitCmtClicked] = useState(false);
	const [selectReply, setSelectReply] = useState({});
	const [commentsReply, setCommentsReply] = useState([]);
	const [trigger, setTrigger] = useState(false); // trigger tự động focus texbox sau khi đã gửi comment

	const selectCommentToReply = (selectedComment) => {
		console.log("selectedComment is: ", selectedComment);

		const { id, userId, firstName, lastName } = selectedComment;

		const exist = Array.from(textbox.current.childNodes).find(
			(el) => el.dataset?.mention === userId
		);
		if (exist) {
			console.log("đã có trong danh sách nhắc đến");
			return;
		}
		setSelectReply(selectedComment);
		textbox.current.innerHTML += `<a href="" class="text-primary font-semibold" contentEditable="false" data-mention="${userId}">${combineIntoDisplayName(
			firstName,
			lastName
		)}</a>&nbsp`;
		setTrigger(!trigger); // tự focus vào textbox sau khi click "Phản hồi trên comment"
	};

	const handleStopReply = () => setSelectReply({});

	const handleSendComment = async () => {
		const { innerText, innerHTML } = getTextboxData(textbox);
		if (!innerText || !innerHTML) {
			setTimeout(() => {
				textbox.current.innerHTML = "";
				setTrigger(!trigger);
			}, 1);
			return;
		}
		// chuẩn bị data gửi đi
		setSubmitCmtClicked(true);
		const formData = new FormData();
		formData.append("userId", user.userId);
		formData.append("text", innerText);
		formData.append("HTMLText", innerHTML);
		// const file = document.querySelector("#test-media");
		// formData.append("media", file.files[0]);

		let respSendCmt = null;
		if (selectReply.id) {
			//id là id của comment được chọn để phản hồi
			formData.append("commentId", selectReply.commentId || selectReply.id);
			respSendCmt = await replyComment(formData);
		} else {
			formData.append("postId", id);
			respSendCmt = await sendComment(formData);
		}

		if (!respSendCmt || respSendCmt.statusCode !== 200) {
			toast.error("Bình luận thất bại");
			return;
		}

		toast.success("Đã đăng bình luận");
		textbox.current.innerHTML = "";

		const newCmt = {
			...respSendCmt.data,
			firstName: user.firstName,
			lastName: user.lastName,
		};
		// đang reply cmt được select
		if (selectReply.id) {
			// cmt cấp 1 có id không có commentId
			// cmt cấp 2 có id có commentId = id cmt cấp 1
			let processNewReplies;
			const exist = commentsReply.find(
				(commentReply) => commentReply.id === selectReply.id
			);
			// nếu là cmt cấp 1 và đã có trong state
			if (exist) {
				processNewReplies = commentsReply.map((commentReply) =>
					commentReply.id === selectReply.id
						? { ...commentReply, reply: [...commentReply.reply, newCmt] }
						: commentReply
				);
			} else if (selectReply.commentId) {
				// nếu đang reply cmt cấp 2
				const exist = commentsReply.find(
					(commentReply) => commentReply.id === selectReply.commentId
				);
				// commentId của cmt cấp 2 (tức id cmt cấp 1) có tồn tại trong state
				// hiểu ý ở đây là đang reply cmt cấp 2 nằm trong 1 cmt cấp 1
				// mặc định newCmt sẽ nằm cùng cấp với cmt cấp 2 bên trong cmt cấp 1
				if (exist) {
					processNewReplies = commentsReply.map((commentReply) =>
						commentReply.id === selectReply.commentId
							? { ...commentReply, reply: [...commentReply.reply, newCmt] }
							: commentReply
					);
				}
			} else {
				// chưa có cmt cấp 1 này, đẩy reply mới newCmt vào
				processNewReplies = [
					...commentsReply,
					{ id: selectReply.id, reply: [newCmt] },
				];
			}
			console.log("sau khi process các reply comment: ", processNewReplies);
			setCommentsReply(processNewReplies);
			setComments(
				comments.map((comment) =>
					comment.id === selectReply.id ? { ...comment, reply: true } : comment
				)
			);
		} else {
			// không phải reply sẽ đẩy data mới vào list comment
			setComments((prev) => [{ ...newCmt }, ...prev]);
		}
		handleStopReply();
		updatePost(id, { countComments: post.countComments + 1 });
		setTrigger(!trigger);
		setSubmitCmtClicked(false);
	};

	// Hiển thị các reply comment
	const handleShowReplyComment = async (commentId) => {
		const resp = await getRepliesComment(commentId);
		if (!resp || resp.statusCode !== 200) {
			toast.error("Lấy phản hồi bình luận thất bại");
			return;
		}
		const repliesCmt = {
			id: commentId,
			reply: resp.data,
		};
		// mặc định chưa show replies của cmt này -> cmt này chưa có trong list replies
		const newReplies = [...commentsReply, repliesCmt];
		console.log("newReplies after resp get Replies is: ", newReplies);

		setCommentsReply(newReplies);
	};

	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendComment();
		}
	};

	return (
		<div className="relative pt-10 flex flex-col sm:w-[540px] w-screen sm:h-[95dvh] h-[100dvh]">
			<div className="overflow-y-auto scrollable-div flex-grow flex flex-col">
				{post && (
					<Post
						post={post}
						setPost={setPost}
						isChildren={true}
						className="border-b "
						store={store}
						allowCarousel={true}
					/>
				)}

				<div className="space-y-3 pt-3 pb-14 px-5 flex-grow">
					{comments.map((comment, index) => (
						<RenderComment
							key={index}
							comment={comment}
							selectCommentToReply={selectCommentToReply}
							handleShowReplyComment={handleShowReplyComment}
							replies={commentsReply.find((item) => item.id === comment.id)}
						/>
					))}
					{comments.length === 0 && (
						<p>Hãy là người đầu tiên bình luận bài viết này</p>
					)}
				</div>
			</div>
			{/* Ô nhập bình luận */}
			<div className="sticky bottom-0">
				<div
					className={`absolute w-full -z-10 bg-background top-0 border-t py-2 px-4 flex items-center justify-between
					${selectReply.id ? "-translate-y-full" : "translate-y-0"}
					transition`}
				>
					<p>
						Đang phản hồi{" "}
						<span className="font-semibold">
							{combineIntoDisplayName(
								selectReply.firstName,
								selectReply.lastName
							)}
						</span>
					</p>
					<div onClick={handleStopReply} className="cursor-pointer">
						<XMarkIcon />
					</div>
				</div>

				<div className=" bg-background flex items-end gap-4 px-4 pt-2 pb-3 border-t">
					<Avatar className={`size-9`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="text-[11px]">
							{combineIntoAvatarName(user.firstName, user.lastName)}
						</AvatarFallback>
					</Avatar>
					<TextBox
						texboxRef={textbox}
						className="py-2 w-full max-h-[40vh]"
						placeholder="Viết bình luận"
						contentEditable={!submitCmtClicked}
						onKeyDown={textBoxOnKeyDown}
						autoFocus={true}
						trigger={trigger}
					/>

					<button className="py-2 px-1" onClick={handleSendComment}>
						{submitCmtClicked ? (
							<LoadingIcon stroke="stroke-gray-light" />
						) : (
							<Send className="size-5" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
