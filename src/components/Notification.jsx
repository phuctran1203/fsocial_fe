import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Check,
	Bell,
	CloseCollapseIcon,
	CommentNoti,
	Glyph,
	HeartNoti,
	TrashCanIcon,
	XMarkIcon,
} from "./Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import {
	popupNotificationtStore,
	popupExpandNoti3DotStore,
} from "../store/popupStore";
import Button from "./Button";
import { getNotification } from "@/api/notificationApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { combineIntoAvatarName } from "@/utils/combineName";

const Noti = ({
	id,
	type,
	name,
	firstName,
	lastName,
	read,
	textTime,
	avatar,
	setNotification,
}) => {
	const { idNotiShowing, setIdNotiShowing } = popupExpandNoti3DotStore();

	const setVisible = popupNotificationtStore((state) => state.setIsVisible);

	const open = () => {
		setIdNotiShowing(id);
	};

	const close = () => {
		setIdNotiShowing(null);
	};

	const deleteNoti = () => {
		//call delete
		setNotification((prev) => prev.filter((noti) => noti.id !== id));
		close();
	};

	const markAsRead = () => {
		//call mark this noti as read
		setNotification((prev) =>
			prev.map((noti) => (noti.id === id ? { ...noti, read: !read } : noti))
		);
		close();
	};

	const notiClicked = () => {
		close();
		setVisible(false);
	};

	const notiMap = {
		likePost: {
			icon: <HeartNoti />,
			content: (
				<>
					<span className="fs-sm font-semibold">{name}</span>
					<span>đã thả tim bài viết của bạn</span>
				</>
			),
		},
		likeComment: {
			icon: <HeartNoti />,

			content: (
				<>
					<span className="fs-sm font-semibold">{name}</span>
					<span>đã thả tim bình luận của bạn</span>
				</>
			),
		},
		COMMENT: {
			icon: <CommentNoti />,
			content: (
				<>
					<span className="fs-sm font-semibold">{name}</span>
					<span>đã bình luận về bài viết của bạn</span>
				</>
			),
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
			<Link to="" className="flex items-center gap-2" onClick={notiClicked}>
				<div className={`relative ${read && "opacity-60"}`}>
					<div className={`size-12 rounded-full overflow-hidden`}>
						<Avatar className={`size-full`}>
							<AvatarImage src={avatar} />
							<AvatarFallback className="fs-sm">
								{combineIntoAvatarName(firstName, lastName)}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="absolute size-fit -top-1 -left-0.5">
						{notiMap[type].icon}
					</div>
				</div>

				<div>
					<p className={`fs-sm ${read && "opacity-60"}`}>
						{notiMap[type].content}
					</p>
					<div className="flex items-center gap-2">
						<span className={`fs-xs ${read && "opacity-60"} `}>{textTime}</span>

						{!read && <span className="size-2 bg-primary rounded-full" />}
					</div>
				</div>
			</Link>
			<button className="px-4" onClick={open}>
				<div className="rotate-90">
					<Glyph />
				</div>
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
					<Check />
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
	const isInMessage = location.pathname === "/message";
	const user = ownerAccountStore((state) => state.user);

	const [notification, setNotification] = useState([]);

	const today = notification.filter((noti) => noti.labelType === 0);

	const last7days = notification.filter((noti) => noti.labelType === 1);

	const old = notification.filter((noti) => noti.labelType === 2);

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
				setNotification,
			};
		});

		setNotification(processData);
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
				!isInMessage
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
				${!isInMessage ? "lg:translate-x-0 lg:drop-shadow-none" : ""}
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
						!isInMessage ? "lg:hidden" : ""
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
							<span className="absolute bottom-1/2 left-1/2 px-1 bg-primary rounded-full text-txtWhite text-[12px]">
								99+
							</span>
						</div>
						<h5>Thông báo</h5>
					</div>

					<div
						className={`flex-grow overflow-y-auto sm:pe-4 ${
							!isInMessage ? "" : "scrollable-div"
						}`}
					>
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
