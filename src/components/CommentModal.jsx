import React, { useEffect, useRef, useState } from "react";
import { LoadingIcon, SendIcon, XMarkIcon } from "./Icon";
import Post from "./Post";
import { getComments, sendComment, replyComment } from "../api/commentsApi";
import { postsStore } from "../store/postsStore";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { TextBox } from "./Field";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CommentReuse(props) {
	const { comment, selectCommentToReply, handleShowReplyComment, replies, isReply } = props;
	return (
		<div className={`${isReply && "ps-6"} flex flex-col space-y-2`}>
			<div className="flex gap-3">
				<Link to="">
					<img src={comment.avatar || "./temp/default_avatar.svg"} alt="avatar" className="size-9 rounded-full" />
				</Link>

				<div className="space-y-1">
					<div>
						<Link to="" className="font-semibold text-gray fs-xs hover:underline hover:text-primary-text">
							{comment.displayName}
						</Link>
						<div dangerouslySetInnerHTML={{ __html: comment.content.htmltext }}></div>
					</div>

					<div className="flex items-center gap-2 text-[--gray-clr]">
						<span className="text-[--gray-clr] fs-sm">{dateTimeToNotiTime(comment.createdAt).textTime}</span>
						<div className="flex items-center">
							<svg className="sm:h-[15px] h-[13px]" width="25" height="22" viewBox="0 0 25 22" fill="none">
								<path
									className={
										false ? "fill-[--primary-clr] stroke-[--primary-clr]" : "fill-[--gray-clr] stroke-[--gray-clr]"
									}
									d="M12.4877 4.16991L11.9102 4.7257C12.0613 4.88268 12.2698 4.97138 12.4877 4.97138C12.7056 4.97138 12.914 4.88268 13.0651 4.7257L12.4877 4.16991ZM9.73709 17.871C8.11742 16.5942 6.34638 15.3473 4.94138 13.7652C3.56385 12.214 2.60293 10.4041 2.60293 8.05592H1C1 10.9043 2.1867 13.0774 3.74285 14.8296C5.27152 16.5509 7.22019 17.9279 8.74474 19.1298L9.73709 17.871ZM2.60293 8.05592C2.60293 5.75745 3.9017 3.82997 5.67453 3.01961C7.39683 2.23234 9.71103 2.44083 11.9102 4.7257L13.0651 3.61412C10.4557 0.903024 7.42678 0.456202 5.00814 1.56176C2.64002 2.64423 1 5.15774 1 8.05592H2.60293ZM8.74474 19.1298C9.29212 19.5613 9.87974 20.0215 10.4752 20.3694C11.0706 20.7172 11.7499 21 12.4877 21V19.3971C12.1568 19.3971 11.7675 19.2681 11.284 18.9854C10.8006 18.703 10.2992 18.3141 9.73709 17.871L8.74474 19.1298ZM16.2306 19.1298C17.7551 17.9279 19.7038 16.5509 21.2325 14.8296C22.7886 13.0774 23.9753 10.9043 23.9753 8.05592H22.3724C22.3724 10.4041 21.4115 12.214 20.0339 13.7652C18.6289 15.3473 16.8579 16.5942 15.2383 17.871L16.2306 19.1298ZM23.9753 8.05592C23.9753 5.15774 22.3353 2.64423 19.9671 1.56176C17.5485 0.456202 14.5196 0.903024 11.9102 3.61412L13.0651 4.7257C15.2643 2.44083 17.5785 2.23234 19.3008 3.01961C21.0736 3.82997 22.3724 5.75745 22.3724 8.05592H23.9753ZM15.2383 17.871C14.6761 18.3141 14.1747 18.703 13.6914 18.9854C13.2078 19.2681 12.8185 19.3971 12.4877 19.3971V21C13.2254 21 13.9048 20.7172 14.5001 20.3694C15.0956 20.0215 15.6832 19.5613 16.2306 19.1298L15.2383 17.871Z"
									strokeWidth={0.6}
								/>

								<path
									className={false ? "fill-[--primary-clr] stroke-[--primary-clr]" : ""}
									d="M12.4877 4.97138C12.2698 4.97138 12.0613 4.88268 11.9102 4.7257C9.71103 2.44083 7.39683 2.23234 5.67453 3.01961C3.9017 3.82997 2.60293 5.75745 2.60293 8.05592C2.60293 10.4041 3.56385 12.214 4.94138 13.7652C6.34638 15.3473 8.11742 16.5942 9.73709 17.871C10.2992 18.3141 10.8006 18.703 11.284 18.9854C11.7675 19.2681 12.1568 19.3971 12.4877 19.3971C12.8185 19.3971 13.2078 19.2681 13.6914 18.9854C14.1747 18.703 14.6761 18.3141 15.2383 17.871C16.8579 16.5942 18.6289 15.3473 20.0339 13.7652C21.4115 12.214 22.3724 10.4041 22.3724 8.05592C22.3724 5.75745 21.0736 3.82997 19.3008 3.01961C17.5785 2.23234 15.2643 2.44083 13.0651 4.7257C12.914 4.88268 12.7056 4.97138 12.4877 4.97138Z"
									strokeWidth={1}
								/>
							</svg>
							<span className="fs-sm">{comment.countLikes}</span>
						</div>

						<button
							className="fs-sm hover:text-primary-text"
							onClick={() => {
								selectCommentToReply({
									id: comment.id,
									userId: comment.userId,
									displayName: comment.displayName,
								});
							}}
						>
							Phản hồi
						</button>
					</div>

					{comment.reply && !isReply && (
						<button
							className="fs-xs ps-2 font-semibold text-[--gray-clr] hover:underline"
							onClick={handleShowReplyComment}
						>
							{replies?.reply.length} phản hồi
						</button>
					)}
					{/* show list reply comment */}
					<div>
						{replies?.reply.map((reply) => (
							<CommentReuse
								key={comment.id}
								comment={reply}
								selectCommentToReply={selectCommentToReply}
								handleShowReplyComment={handleShowReplyComment}
								isReply={true}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function CommentModal({ id }) {
	const user = ownerAccountStore((state) => state.user);

	const textbox = useRef(null);

	const { posts, updatePost } = postsStore();

	const post = posts?.find((p) => p.id == id);

	const [comments, setComments] = useState([]);

	const [submitCmtClicked, setSubmitCmtClicked] = useState(false);

	const [selectReply, setSelectReply] = useState({});

	const [commentsReply, setCommentsReply] = useState([]);

	const selectCommentToReply = (props) => {
		const { id, userId, displayName } = props;
		setSelectReply(props);
		console.log(id, userId, displayName);
		textbox.current.innerHTML = `<span class="text-primary font-semibold">${displayName}</span>&nbsp`;
		setTrigger(!trigger);
	};

	const handleStopReply = () => setSelectReply(null);

	const handleSendComment = async () => {
		if (textbox.current.innerText.trim() == "") {
			setTimeout(() => {
				textbox.current.innerHTML = "";
			}, 1);
			return;
		}
		setSubmitCmtClicked(true);
		const formData = new FormData();
		formData.append("userId", user.userId);
		formData.append("text", textbox.current.innerText);
		formData.append("HTMLText", textbox.current.innerHTML);
		// const file = document.querySelector("#test-media");
		// formData.append("media", file.files[0]);

		let respSendCmt = null;
		if (selectReply?.id) {
			//id là id của comment được chọn để phản hồi
			formData.append("commentId", selectReply.id);
			respSendCmt = await replyComment(formData);
		} else {
			formData.append("postId", id);
			respSendCmt = await sendComment(formData);
		}

		if (respSendCmt.statusCode === 200) {
			toast.success("Đã đăng bình luận");

			textbox.current.innerHTML = "";
			// nếu đang reply sẽ đẩy comment mới vào reply
			if (selectReply?.id) {
				const exist = commentsReply.find((commentReply) => commentReply.commentId === selectReply.id);
				let processNewReplies;
				if (exist) {
					processNewReplies = [...commentsReply].map((commentReply) =>
						commentReply.commentId === selectReply.id
							? { commentId: selectReply.id, reply: [respSendCmt.data, ...commentReply.reply] }
							: commentReply
					);
				} else {
					processNewReplies = [{ commentId: selectReply.id, reply: [respSendCmt.data] }, ...commentsReply];
				}
				setCommentsReply(processNewReplies);

				console.log("phản hồi bình luận");
			} else {
				// không phải reply sẽ đẩy data mới vào list comment
				setComments((prev) => [{ ...respSendCmt.data, displayName: user.displayName }, ...prev]);
			}
			updatePost(id, { countComments: post.countComments + 1 });
		} else {
			toast.error("Bình luận thất bại");
		}
		setTrigger(!trigger);
		setSubmitCmtClicked(false);
	};

	const [refresh, setRefresh] = useState(true);

	const handleShowReplyComment = (commendId) => {};

	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		setRefresh(!refresh);
		if (e.key === "Enter" && !e.shiftKey) {
			handleSendComment();
		}
	};

	const getComment = async () => {
		const respGetComment = await getComments(post.id);
		setComments(respGetComment.data);
	};

	const [trigger, setTrigger] = useState(false);

	useEffect(() => {
		getComment();
	}, []);

	return (
		<div className="relative flex-grow flex flex-col sm:w-[560px] sm:h-[90dvh] h-[100dvh]">
			<div className="overflow-y-auto scrollable-div flex-grow flex flex-col">
				<Post post={post} isChildren={true} className="border-b " />

				<div className="space-y-3 py-3 px-5 flex-grow">
					{comments.length > 0 ? (
						comments.map((comment) => (
							<CommentReuse
								key={comment.id}
								comment={comment}
								selectCommentToReply={selectCommentToReply}
								handleShowReplyComment={handleShowReplyComment}
								replies={commentsReply.find((item) => item.commentId === comment.id)}
								isReply={false}
							/>
						))
					) : (
						<p>Hãy là người đầu tiên bình luận bài viết này</p>
					)}
				</div>
			</div>
			{/* Ô nhập bình luận */}
			<div className="sticky bottom-0">
				<div
					className={`absolute w-full -z-10 bg-background top-0 border-t py-2 px-4 flex items-center justify-between
					${selectReply?.id ? "-translate-y-full" : "translate-y-0"}
					transition`}
				>
					<p>
						Đang phản hồi <span className="font-semibold">{selectReply?.displayName}</span>
					</p>
					<div onClick={handleStopReply} className="cursor-pointer">
						<XMarkIcon />
					</div>
				</div>

				<div className=" bg-background flex items-end gap-4 px-4 pt-2 pb-3 border-t">
					<Avatar className={`size-9`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="fs-xm">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
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

					<button
						className="py-2"
						onClick={handleSendComment}
						disabled={textbox.current?.innerText == "" || submitCmtClicked}
					>
						{submitCmtClicked ? <LoadingIcon stroke="stroke-gray-light" /> : <SendIcon />}
					</button>
				</div>
			</div>
		</div>
	);
}
