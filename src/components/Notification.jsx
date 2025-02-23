import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Bell, CloseCollapseIcon, CommentNoti, Glyph, HeartNoti, TrashCanIcon, XMarkIcon } from "./Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { popupNotificationtStore, popupExpandNoti3DotStore } from "../store/popupStore";
import Button from "./Button";

const Noti = (props) => {
	const { id, type, image, name, read, textTime, index } = props;

	const { idNotiShowing, setIdNotiShowing } = popupExpandNoti3DotStore();

	const setVisible = popupNotificationtStore((state) => state.setIsVisible);

	const open = () => {
		setIdNotiShowing(index);
	};

	const close = () => {
		setIdNotiShowing(null);
	};

	const deleteNoti = () => {
		//call delete
		close();
	};

	const markAsRead = () => {
		//call mark this noti as read
		close();
	};

	const notiClicked = () => {
		close();
		setVisible(false);
	};

	const notiMap = {
		likePost: {
			icon: <HeartNoti />,
			content: "đã thả tim bài viết của bạn",
		},
		likeComment: {
			icon: <HeartNoti />,
			content: "đã tha tim bình luận của bạn",
		},
		commentPost: {
			icon: <CommentNoti />,
			content: "đã bình luận về bài viết của bạn",
		},
	};

	return (
		<div
			key={index}
			className={`
			relative overflow-hidden ps-4 py-1 rounded-md flex justify-between
			${idNotiShowing != null && idNotiShowing === index ? "" : "hover:bg-gray-3light active:bg-gray-2light"} 
			transition`}
		>
			{/* direct đến thông báo */}
			<Link to="" className="flex items-center gap-2" onClick={notiClicked}>
				<div className={`relative ${read && "opacity-60"}`}>
					<div className={`sm:size-12 size-11 rounded-full overflow-hidden`}>
						<img className="size-full object-center object-cover" src={`./temp/${image}`} alt="" />
					</div>
					<div className="absolute size-fit -top-1 -left-0.5">{notiMap[type].icon}</div>
				</div>

				<div>
					<p className={`fs-sm ${read && "opacity-60"}`}>
						<span className="fs-sm font-semibold">{name} </span>
						{notiMap[type].content}
					</p>
					<div className="flex items-center gap-2">
						<span className={`fs-xs ${read && "opacity-60"} `}>{textTime}</span>

						{!read && <span className="size-2 bg-primary rounded-full" />}
					</div>
				</div>
			</Link>
			<button className="px-4" onClick={open}>
				<Glyph className="rotate-90" />
			</button>
			<div
				className={`flex absolute top-0 h-full left-full ${
					idNotiShowing != null && idNotiShowing === index && "-translate-x-full"
				} transition`}
			>
				<Button className="btn-secondary !rounded-none px-3 border-r-[1px]" onClick={deleteNoti}>
					<TrashCanIcon />
				</Button>
				<Button className="btn-secondary !rounded-none px-3 border-r-[1px]" onClick={markAsRead}>
					<Check />
				</Button>
				<Button className="btn-secondary !rounded-none px-3" onClick={close}>
					<XMarkIcon />
				</Button>
			</div>
		</div>
	);
};

const data = [
	{ id: 1, type: "commentPost", image: "user_2.png", name: "Phương Nam", time: "2025-02-09 16:32:19", read: false },
	{ id: 2, type: "commentPost", image: "user_2.png", name: "Phương Nam", time: "2025-02-08 16:32:19", read: false },
	{ id: 3, type: "commentPost", image: "user_2.png", name: "Phương Nam", time: "2025-02-07 15:22:19", read: false },
	{ id: 4, type: "likePost", image: "user_2.png", name: "Phương Nam", time: "2025-02-06 10:22:19", read: true },
	{ id: 5, type: "likePost", image: "user_2.png", name: "Phương Nam", time: "2025-02-02 10:22:19", read: true },
	{ id: 5, type: "likePost", image: "user_2.png", name: "Phương Nam", time: "2025-02-02 10:22:19", read: true },
	{ id: 6, type: "commentPost", image: "user_2.png", name: "Phương Nam", time: "2025-01-10 10:22:19", read: false },
	{ id: 7, type: "likePost", image: "user_2.png", name: "Phương Nam", time: "2024-09-07 10:22:19", read: true },
	{ id: 8, type: "commentPost", image: "user_2.png", name: "Phương Nam", time: "2024-02-07 10:22:19", read: true },
	{ id: 9, type: "likePost", image: "user_2.png", name: "Phương Nam", time: "2024-02-07 10:22:19", read: true },
];

export default function Notification() {
	const location = useLocation();
	const isInMessage = location.pathname === "/message";

	const processData = data.map((noti) => {
		const { textTime, labelType } = dateTimeToNotiTime(noti.time);
		return {
			...noti,
			textTime,
			labelType,
		};
	});

	const today = processData.filter((noti) => noti.labelType === 0);

	const last7days = processData.filter((noti) => noti.labelType === 1);

	const old = processData.filter((noti) => noti.labelType === 2);

	const { isVisible, setIsVisible } = popupNotificationtStore();

	return (
		<div
			className={` 
			z-0 bg-black h-screen overflow-hidden
			lg:block ${
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
			lg:border-l-[1px]
			left-0 absolute w-full bg-opacity-0
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
				md:min-w-[340px] md:max-w-[340px]
				sm:min-w-[310px] sm:max-w-[310px]
				w-full
				${isVisible ? "drop-shadow-[1px_0px_1px_var(--drop-shadow)]" : "sm:-translate-x-full sm:translate-y-0 translate-y-full"}
				transition`}
			>
				<CloseCollapseIcon
					className={`absolute left-full top-1/2 -translate-x-[1px] -translate-y-1/2 cursor-pointer  ${
						!isInMessage ? "lg:hidden" : ""
					} sm:block hidden
						${isVisible ? "" : "-translate-x-full"}`}
				/>
				<div
					className={`
					h-full flex flex-col
					md:space-y-4  
					sm:pt-6 sm:pb-1 sm:ps-4
					py-14 space-y-2`}
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

					<div className={`flex-grow overflow-y-auto sm:pe-4 ${!isInMessage ? "" : "scrollable-div"}`}>
						{today.length > 0 && (
							<div className="md:space-y-1 space-y-2">
								<h6 className="px-4">Hôm nay</h6>
								{today.map((noti, index) => Noti({ ...noti, index: index }))}
							</div>
						)}

						{last7days.length > 0 && (
							<div className="md:space-y-1 space-y-2">
								<h6 className="px-4">7 ngày trước</h6>
								{last7days.map((noti, index) => Noti({ ...noti, index: index + today.length }))}
							</div>
						)}

						{old.length > 0 && (
							<div className="md:space-y-1 space-y-2">
								<h6 className="px-4">Trước đó</h6>
								{old.map((noti, index) => Noti({ ...noti, index: index + today.length + last7days.length }))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
