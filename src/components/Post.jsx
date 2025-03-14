import { Link } from "react-router-dom";
import { ComplaintIcon, Glyph, TrashCanIcon, PencilIcon } from "./Icon";
import { usePopupStore } from "../store/popupStore";
import { postsStore } from "../store/postsStore";
import { dateTimeToPostTime } from "../utils/convertDateTime";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Button from "./Button";
import { likePost } from "@/api/postsApi";
import CommentModal from "./CommentModal";
import ReportModal from "./ReportModal";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import { useState } from "react";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import GenerateMediaLayout from "./GenerateMediaLayout";
import ModalRepost from "./ModalRepost";
import { HeartPostIcon } from "./Icon";
import { CommentPostIcon } from "./Icon";
import { RepostPostIcon } from "./Icon";
import { SharePostIcon } from "./Icon";

export default function Post({
	post,
	isChildren,
	showReact = true,
	className = "",
}) {
	const { showPopup } = usePopupStore();

	const [popoverOpen, setPopoverOpen] = useState(false);

	const user = ownerAccountStore.getState().user;

	const showCommentPopup = () => {
		showPopup(
			`Bài viết của ${combineIntoDisplayName(post.firtName, post.lastName)}`,
			<CommentModal id={post.id} />
		);
	};

	const showRepostPopup = () => {
		showPopup(null, <ModalRepost id={post.id} />);
	};

	const handlePopupReport = () => {
		setPopoverOpen(false);
		showPopup("Báo cáo vi phạm", <ReportModal id={post.id} />);
	};

	const handlePopupEdit = () => {
		setPopoverOpen(false);
		showPopup("Chỉnh sửa bài viết", <EditPostModal id={post.id} />);
	};

	const handlePopupDelete = () => {
		setPopoverOpen(false);
		showPopup("Xóa bài viết", <DeletePostModal id={post.id} />);
	};

	const likes = post.countLikes;

	const liked = post.like;

	const updatePost = postsStore((state) => state.updatePost);

	const handleLike = async () => {
		updatePost(post.id, {
			like: !liked,
			countLikes: liked ? likes - 1 : likes + 1,
		});
		likePost(post.id);
	};

	return (
		<div className={`${className} transition`}>
			<div className="flex items-center justify-between px-4 pt-4 pb-3">
				<div className="flex space-x-2">
					<Link to={`/profile?id=${post.userId}`}>
						<Avatar className={`size-9`}>
							<AvatarImage src={post.avatar} />
							<AvatarFallback className="text-[11px] transition">
								{combineIntoAvatarName(post.firtName, post.lastName)}
							</AvatarFallback>
						</Avatar>
					</Link>
					<div className="flex flex-col justify-center">
						<Link to={`/profile?id=${post.userId}`} className="font-semibold">
							{combineIntoDisplayName(post.firtName, post.lastName)}
						</Link>
						<span className="text-gray fs-xs">
							{dateTimeToPostTime(post.createDatetime)}
						</span>
					</div>
				</div>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger
						className={`btn-transparent w-fit px-2 py-3.5 ${
							isChildren && "hidden"
						}`}
					>
						<Glyph />
					</PopoverTrigger>
					<PopoverContent
						side="left"
						align="start"
						sideOffset={20}
						className="z-10 bg-background w-52 shadow-2xl p-2"
					>
						{post.userId !== user.userId && (
							<Button
								className="btn-transparent justify-start py-2 ps-3 text-nowrap gap-3"
								onClick={handlePopupReport}
							>
								<ComplaintIcon /> Báo cáo
							</Button>
						)}
						{post.userId === user.userId && (
							<Button
								className="btn-transparent justify-start text-nowrap py-2 ps-3 gap-3"
								onClick={handlePopupEdit}
							>
								<PencilIcon /> Chỉnh sửa
							</Button>
						)}
						{post.userId === user.userId && (
							<Button
								className="btn-transparent justify-start py-2 ps-3 text-nowrap gap-3"
								onClick={handlePopupDelete}
							>
								<TrashCanIcon className="size-5" /> Xóa bài
							</Button>
						)}
					</PopoverContent>
				</Popover>
			</div>

			<div>
				{/* post content */}
				<div
					className="px-4 mb-2"
					dangerouslySetInnerHTML={{ __html: post.content.htmltext }}
				/>
				{/* assets post */}
				{post.content.media.length > 0 && (
					<GenerateMediaLayout medias={post.content.media} />
				)}
			</div>

			{showReact && (
				<div className="px-4 sm:py-4 py-3  flex justify-between">
					{/* like button */}
					<div
						className="flex items-center sm:gap-2 gap-1 cursor-pointer"
						onClick={handleLike}
					>
						<HeartPostIcon compareVar={liked} />
						<p className={liked ? "text-primary" : ""}>
							{likes > 0 ? (
								likes
							) : (
								<span className="fs-sm sm:inline hidden">Tim</span>
							)}
						</p>
					</div>

					{/* comment button */}
					<button
						className="flex items-center sm:gap-2 gap-1"
						onClick={() => showCommentPopup()}
					>
						<CommentPostIcon />
						<p>
							{post.countComments > 0 ? (
								post.countComments
							) : (
								<span className="fs-sm sm:inline hidden">Bình luận</span>
							)}
						</p>
					</button>

					{/* re post button */}
					<button
						className="flex items-center sm:gap-2 gap-1"
						onClick={showRepostPopup}
					>
						<RepostPostIcon />
						<p>
							{post.repost > 0 ? (
								post.repost
							) : (
								<span className="fs-sm sm:inline hidden">Đăng lại</span>
							)}
						</p>
					</button>

					{/* share */}
					<div className="flex items-center gap-2 cursor-pointer">
						<SharePostIcon />
						<span className="fs-sm sm:inline hidden">Chia sẻ</span>
					</div>
				</div>
			)}
		</div>
	);
}
