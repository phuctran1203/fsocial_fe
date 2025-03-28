import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Nav.module.scss";
// import "./Nav.scss";
import {
	Bell,
	CreatePostNavIcon,
	FollowNavIcon,
	HamburgerIcon,
	HomeNavIcon,
	LogoNoBG,
	MessageNavIcon,
} from "./Icon";
import { popupNotificationtStore, usePopupStore } from "../store/popupStore";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { toast } from "sonner";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import NavMorePopup from "./NavMorePopup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "./CreatePost";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import useMessageStore from "@/store/messageStore";
import { regexInMessage, regexInSetting } from "@/config/regex";
import { SearchIcon } from "lucide-react";

export default function Nav() {
	const user = ownerAccountStore((state) => state.user);

	const location = useLocation();

	const isNotificationSlide =
		regexInMessage.test(location.pathname) ||
		regexInSetting.test(location.pathname);

	const isInHome = ["/", "/home"].includes(location.pathname);

	const isVisibleNoti = popupNotificationtStore((state) => state.isVisible);
	const setIsVisibleNoti = popupNotificationtStore(
		(state) => state.setIsVisible
	);

	const toggleShowNotification = () => {
		setIsVisibleNoti(!isVisibleNoti);
	};

	const closeNotification = () => {
		setIsVisibleNoti(false);
	};

	const [popoverOpen, setPopoverOpen] = useState(false);

	const { showPopup } = usePopupStore();

	const handlePopupCreatePost = () => {
		showPopup("Tạo bài viết", <CreatePost />);
	};

	const newMessage = useMessageStore((state) => state.newMessage);

	return (
		<nav
			className={`
			z-10 bg-background flex-shrink-0 border-0
			${
				!isNotificationSlide
					? "md:w-[260px] sm:w-[210px]"
					: "lg:w-[260px] sm:w-[76px]"
			} 
			sm:border-r sm:border-t-0 sm:static sm:flex sm:flex-col sm:justify-between sm:h-screen sm:py-6
			fixed bottom-0 w-full border-t
			transition
			${styles.transitionNav}`}
		>
			<div className="sm:space-y-8 sm:block w-full">
				{/* logo */}
				<NavLink to="/" className="sm:block hidden">
					<LogoNoBG
						className={!isNotificationSlide ? "ms-6" : "lg:ms-6 mx-auto"}
					/>
				</NavLink>

				<div className="sm:space-y-3 sm:mx-4 sm:block flex justify-evenly">
					<NavLink
						to="/home"
						className={styles.navBaseStyle}
						onClick={closeNotification}
					>
						<HomeNavIcon compareVar={isInHome} />
						<span
							className={`${
								!isNotificationSlide ? "sm:inline" : "lg:inline"
							} hidden ${isInHome && "font-semibold"}`}
						>
							Trang chủ
						</span>
					</NavLink>

					<NavLink
						to="/follow"
						className={styles.navBaseStyle}
						onClick={closeNotification}
					>
						{({ isActive }) => (
							<>
								<FollowNavIcon compareVar={isActive} />
								<span
									className={`${
										!isNotificationSlide ? "sm:inline" : "lg:inline"
									} hidden ${isActive && "font-semibold"}`}
								>
									Theo dõi
								</span>
							</>
						)}
					</NavLink>

					<NavLink
						to="/search"
						className={styles.navBaseStyle}
						onClick={closeNotification}
					>
						{({ isActive }) => (
							<>
								<SearchIcon
									className="size-[26px]"
									strokeWidth={isActive ? 2.2 : 1.6}
								/>
								<span
									className={`${
										!isNotificationSlide ? "sm:inline" : "lg:inline"
									} hidden ${isActive && "font-semibold"}`}
								>
									Tìm kiếm
								</span>
							</>
						)}
					</NavLink>

					<NavLink
						to="/message"
						className={styles.navBaseStyle}
						onClick={closeNotification}
					>
						{({ isActive }) => (
							<>
								<div className="relative">
									<MessageNavIcon compareVar={isActive} />
									{newMessage && !isNotificationSlide && (
										<div className="absolute size-2.5 -top-[1px] -right-1 bg-primary-gradient rounded-full " />
									)}
								</div>
								<span
									className={`${
										!isNotificationSlide ? "sm:inline" : "lg:inline"
									} hidden ${isActive && "font-semibold"}`}
								>
									Tin nhắn
								</span>
							</>
						)}
					</NavLink>

					<button
						className={`${styles.navBaseStyle} ${
							!isNotificationSlide
								? "lg:!hidden sm:!flex !hidden"
								: "sm:!flex !hidden"
						}`}
						onClick={toggleShowNotification}
					>
						<div className="relative">
							<Bell active={isVisibleNoti} />
							<div className="absolute size-2.5 -top-[1px] right-[1px]  bg-primary-gradient rounded-full " />
						</div>
						<span
							className={`${
								!isNotificationSlide ? "sm:inline" : "lg:inline"
							} hidden`}
						>
							Thông báo
						</span>
					</button>

					<button
						className={styles.navBaseStyle}
						onClick={handlePopupCreatePost}
					>
						<CreatePostNavIcon />
						<span
							className={`${
								!isNotificationSlide ? "sm:inline" : "lg:inline"
							} hidden`}
						>
							Tạo bài viết
						</span>
					</button>

					<NavLink
						to={`/profile`}
						className={styles.navBaseStyle}
						onClick={closeNotification}
					>
						{({ isActive }) => (
							<>
								<Avatar className={`size-[26px]`}>
									<AvatarImage src={user.avatar} />
									<AvatarFallback className="text-[8px] font-semibold">
										{combineIntoAvatarName(user.firstName, user.lastName)}
									</AvatarFallback>
								</Avatar>

								<span
									className={`${
										!isNotificationSlide ? "sm:inline" : "lg:inline"
									} hidden ${isActive && "font-semibold"}`}
								>
									{combineIntoDisplayName(user.firstName, user.lastName)}
								</span>
							</>
						)}
					</NavLink>
				</div>
			</div>

			<div className="sm:flex hidden mx-4">
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger
						className={`${styles.navBaseStyle}`}
						onClick={closeNotification}
					>
						<HamburgerIcon />
						<span className={!isNotificationSlide ? "" : "lg:inline hidden"}>
							Thêm
						</span>
					</PopoverTrigger>
					<PopoverContent
						sideOffset={10}
						className="ms-4 bg-background w-72 border shadow-xl p-2 transition"
					>
						<NavMorePopup setPopoverOpen={setPopoverOpen} />
					</PopoverContent>
				</Popover>
			</div>
		</nav>
	);
}
