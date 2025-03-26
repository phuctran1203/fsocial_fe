import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Bell,
	CloseCollapseIcon,
	CommentNotiIcon,
	HeartNotiIcon,
	TrashCanIcon,
	XMarkIcon,
} from "./Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import {
	popupNotificationtStore,
	popupExpandNoti3DotStore,
} from "../store/popupStore";
import Button from "./Button";
import { getNotification, markReadNotification } from "@/api/notificationApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { Skeleton } from "./ui/skeleton";
import { useNotificationsStore } from "@/store/notificationStore";
import { regexInMessage, regexInSetting } from "@/config/regex";
import { CheckCheck, EllipsisVertical } from "lucide-react";

const Noti = (props) => {
	const { id, postId, type, firstName, lastName, read, textTime, avatar } =
		props;
	const navigate = useNavigate();

	const { idNotiShowing, setIdNotiShowing } = popupExpandNoti3DotStore();

	const setVisible = popupNotificationtStore((state) => state.setIsVisible);

	const { deleteNotification, updateNotification } = useNotificationsStore();

	const open = () => {
		setIdNotiShowing(id);
	};

	const close = () => {
		setIdNotiShowing(null);
	};

	const deleteNoti = () => {
		//call delete
		deleteNotification(id);
		close();
	};

	const markAsRead = async () => {
		//call mark this noti as read
		updateNotification(id, { read: !read });
		close();
		markReadNotification(id);
	};

	const notiClicked = () => {
		close();
		if (!read) markAsRead();
		setVisible(false);
		navigate(`/post?id=${postId}`);
	};

	const notiMap = {
		LIKE: {
			icon: <HeartNotiIcon />,
			content: <span className="fs-sm">đã thả tim bài viết của bạn</span>,
		},

		likeComment: {
			icon: <HeartNotiIcon />,
			content: <span className="fs-sm">đã thả tim bình luận của bạn</span>,
		},

		COMMENT: {
			icon: <CommentNotiIcon />,
			content: <span className="fs-sm">đã bình luận về bài viết của bạn</span>,
		},
	};

	return (
		<div
			className={`
			relative overflow-hidden ps-4 py-2 rounded-md flex justify-between
			${idNotiShowing === id ? "" : "hover:bg-gray-3light active:bg-gray-2light"} 
			transition`}
		>
			{/* direct đến thông báo */}
			<button className="flex items-center gap-2" onClick={notiClicked}>
				<div className={`relative ${read && "opacity-60"}`}>
					<div className={`size-12 rounded-full overflow-hidden`}>
						<Avatar className={`size-full`}>
							<AvatarImage src={avatar} />
							<AvatarFallback className="fs-sm transition">
								{combineIntoAvatarName(firstName, lastName)}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="absolute size-fit -top-1 -left-0.5">
						{notiMap[type]?.icon || "i"}
					</div>
				</div>

				<div>
					<p className={`fs-sm text-left ${read && "opacity-60"}`}>
						<span className="font-semibold me-1">
							{combineIntoDisplayName(firstName, lastName)}
						</span>
						{notiMap[type]?.content || "i"}
					</p>
					<div className="flex items-center gap-2">
						<span className={`fs-xs ${read && "opacity-60"} `}>{textTime}</span>

						{!read && (
							<span className="size-2 bg-primary-gradient rounded-full" />
						)}
					</div>
				</div>
			</button>
			<button className="px-4" onClick={open}>
				<EllipsisVertical className="size-5" />
			</button>
			<div
				className={`flex absolute top-0 h-full left-full bg-secondary ${
					idNotiShowing === id && "-translate-x-full"
				} transition`}
			>
				<Button
					className="btn-secondary !rounded-none px-3 border-r"
					onClick={deleteNoti}
					allowTab={idNotiShowing === id}
				>
					<TrashCanIcon />
				</Button>
				<Button
					className="btn-secondary !rounded-none px-3 border-r"
					onClick={markAsRead}
					allowTab={idNotiShowing === id}
				>
					<CheckCheck />
				</Button>
				<Button
					className="btn-secondary !rounded-none px-3.5"
					allowTab={idNotiShowing === id}
					onClick={close}
				>
					<XMarkIcon />
				</Button>
			</div>
		</div>
	);
};

export default function Notification() {
	const location = useLocation();
	const isNotificationSlide =
		regexInMessage.test(location.pathname) ||
		regexInSetting.test(location.pathname);

	const user = ownerAccountStore((state) => state.user);

	const { notifications, setNotifications } = useNotificationsStore();

	const today = !notifications
		? []
		: notifications.filter((noti) => noti.labelType === 0);

	const last7days = !notifications
		? []
		: notifications.filter((noti) => noti.labelType === 1);

	const old = !notifications
		? []
		: notifications.filter((noti) => noti.labelType === 2);

	const { isVisible, setIsVisible } = popupNotificationtStore();

	const handleGetNotification = async () => {
		const resp = await getNotification(user.userId);
		if (!resp || resp.statusCode !== 200) return;
		const data = resp.data;
		const processData = data.map((noti) => {
			const { textTime, labelType } = dateTimeToNotiTime(noti.createdAt);
			return {
				...noti,
				textTime,
				labelType,
			};
		});

		setNotifications(processData);
	};

	useEffect(() => {
		if (!user?.userId) return;
		handleGetNotification();
	}, [user?.userId]);

	return (
		<div
			className={` 
			z-0 bg-black h-screen overflow-hidden flex-shrink-0
			lg:border-l-[1px] lg:block ${
				!isNotificationSlide
					? `
				lg:relative lg:left-auto lg:min-w-fit lg:max-w-fit lg:visible
				md:left-[260px] md:w-[calc(100%-260px)]
				sm:left-[210px] sm:w-[calc(100%-210px)]`
					: `
				lg:left-[260px] lg:w-[calc(100%-260px)] 
				sm:left-[76px] sm:w-[calc(100%-76px)]
				`
			}
			left-0 fixed top-0 w-full bg-opacity-0
			${isVisible ? "sm:bg-opacity-25" : "invisible sm:bg-opacity-0"}
			transition
			`}
			onClick={() => setIsVisible(false)}
		>
			<div
				className={`
				h-full relative bg-background 
				${!isNotificationSlide ? "lg:translate-x-0 lg:drop-shadow-none" : ""}
				lg:translate-y-0
				md:w-[360px]
				sm:w-[340px] sm:pb-0
				w-full pb-14
				${
					isVisible
						? "drop-shadow-[1px_0px_1px_var(--drop-shadow)]"
						: "sm:-translate-x-full sm:translate-y-0 translate-y-full"
				}
				transition`}
			>
				<CloseCollapseIcon
					className={`absolute left-full top-1/2 -translate-x-[1px] -translate-y-1/2 cursor-pointer  ${
						!isNotificationSlide ? "lg:hidden" : ""
					} sm:block hidden
						${isVisible ? "" : "-translate-x-full"}
						will-change-transform`}
				/>
				<div
					className={`
					h-full flex flex-col
					md:space-y-4  
					sm:pt-6 sm:pb-1 sm:ps-4
					pt-16 space-y-2`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="px-4 flex items-center gap-5">
						<div className="relative">
							<Bell active={true} />
							<span className="absolute bottom-1/2 left-1/2 px-1 bg-primary font-bold rounded-full text-txtWhite text-[12px]">
								99+
							</span>
						</div>
						<h5>Thông báo</h5>
					</div>

					<div
						className={`flex-grow overflow-y-auto sm:pe-4 ${
							!isNotificationSlide ? "" : "scrollable-div"
						}`}
					>
						{!notifications &&
							[0, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<div key={i} className="px-4 flex items-center gap-2 mb-5">
									<Skeleton className="size-12 rounded-full" />
									<div className="flex-grow space-y-1">
										<Skeleton className="w-1/2 h-4 rounded-sm" />
										<Skeleton className="h-4 rounded-sm" />
										<Skeleton className="w-1/4 h-4 rounded-sm" />
									</div>
								</div>
							))}

						{notifications?.length === 0 && (
							<p className="p-4">Không có thông báo</p>
						)}

						{today.length > 0 && (
							<div className="sm:space-y-0 space-y-1">
								<h6 className="px-4">Hôm nay</h6>
								{today.map((noti) => (
									<Noti key={noti.id} {...noti} />
								))}
							</div>
						)}

						{last7days.length > 0 && (
							<div className="sm:space-y-0 space-y-1">
								<h6 className="px-4">7 ngày trước</h6>
								{last7days.map((noti) => (
									<Noti key={noti.id} {...noti} />
								))}
							</div>
						)}

						{old.length > 0 && (
							<div className="sm:space-y-0 space-y-1">
								<h6 className="px-4">Trước đó</h6>
								{old.map((noti) => (
									<Noti key={noti.id} {...noti} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
