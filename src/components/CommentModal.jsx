import React, { useEffect, useRef, useState } from "react";
import { LoadingIcon, SendIcon, XMarkIcon } from "./Icon";
import Post from "./Post";
import { popupCommentStore } from "../store/popupStore";
import { commentsApi } from "../api/commentsApi";
import { postsStore } from "../store/postsStore";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { TextBox } from "./Field";
import { dateTimeToNotiTime } from "../utils/convertDateTime";

const commentReuse = (comment, selectCommentToReply, handleShowReplyComment, commentsReply) => (
	<div key={comment.id} className="flex flex-col space-y-2">
		<div className="flex gap-3">
			<img src={comment.avatar || "./temp/default_avatar.svg"} alt="avatar" className="size-9 rounded-full" />
			<div className="space-y-1">
				<div>
					<p className="font-semibold">{comment.displayName}</p>
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
						className="fs-sm"
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
				{comment.reply && (
					<button
						className="fs-xsm ps-2 font-semibold text-[--gray-clr] hover:underline"
						onClick={handleShowReplyComment}
					>
						12 phản hồi
					</button>
				)}
				{/* show list reply comment depend on commentId */}
				{/* {comment.postId && (
					<div>
						{commentsReply
							.find((item) => item.commentId === comment.id)
							.reply.map((reply) => commentReuse(comment, selectCommentToReply, handleShowReplyComment))}
					</div>
				)} */}
			</div>
		</div>
	</div>
);

export default function CommentModal() {
	const user = ownerAccountStore((state) => state.user);

	const { isVisible, setIsVisible, id } = popupCommentStore();

	const textbox = useRef(null);

	const { posts, updatePost } = postsStore();

	const post = posts?.find((p) => p.id == id);

	const [comments, setComments] = useState(null);

	const [submitCmtClicked, setSubmitCmtClicked] = useState(false);

	const [selectReply, setSelectReply] = useState({});

	const [commentsReply, setCommentsReply] = useState([
		{
			commentId: "1",
			reply: [
				{
					/*Y chang resp comment*/
				},
				{
					/*Y chang resp comment*/
				},
				{
					/*Y chang resp comment*/
				},
				{
					/*Y chang resp comment*/
				},
			],
		},
	]);

	const selectCommentToReply = (props) => {
		const { id, userId, displayName } = props;
		setSelectReply(props);
		console.log(userId, displayName);
		textbox.current.innerHTML = `<span class="text-[--primary-clr] font-semibold">${displayName}</span>&nbsp`;
		textbox.current.focus();
		// Di chuyển con trỏ đến cuối nội dung trong div
		const range = document.createRange();
		const selection = window.getSelection();

		if (textbox.current.lastChild) {
			range.setStartAfter(textbox.current.lastChild); // Đặt con trỏ sau thẻ <a>
			range.collapse(true); // true => con trỏ sẽ đặt sau phần tử cuối
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	const handleStopReply = () => setSelectReply(null);

	const handleSendComment = async () => {
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
			respSendCmt = await commentsApi.replyComment(formData);
		} else {
			formData.append("postId", id);
			respSendCmt = await commentsApi.sendComment(formData);
		}

		if (respSendCmt.statusCode === 0) {
			updatePost(id, { countComments: post.countComments + 1 });
			setComments((prev) => [{ ...respSendCmt.data, displayName: user.displayName }, ...prev]);
			textbox.current.innerHTML = "";
		}
		setSubmitCmtClicked(false);
	};

	const handleShowReplyComment = () => {};

	const textBoxOnChange = () => {
		if (textbox.current.innerHTML == "<br>") textbox.current.innerHTML = "";
	};

	useEffect(() => {
		const getComment = async () => {
			const respGetComment = await commentsApi.getComments(post.id);
			setComments(respGetComment.data);
		};

		if (isVisible) {
			setTimeout(() => {
				textbox.current.focus();
			}, 100);
			getComment();
		} else {
			textbox.current.innerHTML = "";
		}
	}, [isVisible]);

	return (
		<div
			className={`z-20 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isVisible ? "bg-opacity-30 visible" : "bg-opacity-0 invisible"
			}
			ct-transition`}
			onClick={() => setIsVisible(false)}
		>
			<div
				className={`
				flex flex-col bg-[--background-clr] rounded-lg w-[600px] overflow-y-auto h-full scrollable-div
				${isVisible ? "translate-y-0" : "translate-y-[100vh]"}	
				ct-transition`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="bg-[--background-clr] border-b sticky top-0 py-2">
					<h4 className="text-center">Bài viết của {post?.displayName}</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={() => setIsVisible(false)}>
						<XMarkIcon />
					</button>
				</div>

				{post && <Post post={post} className="border-b" />}

				<div className="space-y-3 py-3 px-5 flex-grow">
					{comments &&
						comments.map((comment) =>
							commentReuse(comment, selectCommentToReply, handleShowReplyComment, commentsReply)
						)}
				</div>

				{/* Ô nhập bình luận */}
				<div className="sticky bottom-0">
					<div
						className={`absolute w-full -z-10 bg-[--background-clr] top-0 border-t py-2 px-4 flex items-center justify-between
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
					<div className="bg-[--background-clr] flex items-end gap-4 px-4 py-2 border-t">
						<img src={user.avatar} alt="avatar" className="size-10 rounded-full" />
						<TextBox
							texboxRef={textbox}
							className="py-2 w-full max-h-[40vh]"
							placeholder="Viết bình luận"
							contentEditable={!submitCmtClicked}
							onInput={textBoxOnChange}
						/>

						<button className="py-2" onClick={handleSendComment} disabled={submitCmtClicked}>
							{submitCmtClicked ? <LoadingIcon color="stroke-[--gray-light-clr]" /> : <SendIcon />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
