import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Nav.module.scss";
// import "./Nav.scss";
import { Bell, FriendsIcon, HamburgerIcon, HomeIcon, LogoNoBG, SearchIcon } from "./Icon";
import { popupCreatePostStore, popupNotificationtStore } from "../store/popupStore";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NavMorePopup from "./NavMorePopup";

export default function Nav() {
	const user = ownerAccountStore((state) => state.user);

	const location = useLocation();

	const isInMessage = location.pathname === "/message";

	const isInHome = ["/", "/home"].includes(location.pathname);

	const { isVisible, setIsVisible } = popupNotificationtStore();

	const isVisibleCreatePost = popupCreatePostStore((state) => state.isVisible);
	const setIsVisibleCreatePost = popupCreatePostStore((state) => state.setIsVisible);

	const toggleShowNotification = () => {
		setIsVisible(!isVisible);
	};

	const closeNotification = () => setIsVisible(false);

	const handlePopupCreatePost = () => {
		isVisible ? closeNotification() : "";
		setIsVisibleCreatePost(!isVisibleCreatePost);
	};

	return (
		<nav
			className={`
			z-10 bg-background
			sm:border-r border-0
			${
				!isInMessage
					? "md:min-w-[260px] md:max-w-[260px] sm:min-w-[210px] sm:max-w-[210px]"
					: "lg:min-w-[260px] lg:max-w-[260px] sm:w-[76px]"
			} 
			sm:static sm:flex sm:flex-col sm:justify-between sm:h-screen sm:py-6
			absolute bottom-0 w-full border-t
			transition
			${styles.transitionNav}`}
		>
			<div className="sm:space-y-8 sm:block w-full">
				{/* logo */}
				<NavLink to="/" className="sm:block hidden" onClick={() => toast.message("Clicked logo")}>
					<LogoNoBG className={!isInMessage ? "ms-6" : "lg:ms-6 mx-auto"} />
				</NavLink>

				<div className="sm:space-y-3 sm:mx-4 sm:block flex justify-evenly">
					<NavLink to="/home" className={styles.navBaseStyle} onClick={closeNotification}>
						<HomeIcon compareVar={isInHome} />
						<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden ${isInHome && "font-semibold"}`}>
							Trang chủ
						</span>
					</NavLink>

					<NavLink to="/follow" className={styles.navBaseStyle} onClick={closeNotification}>
						{({ isActive }) => (
							<>
								<FriendsIcon compareVar={isActive} />
								<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden ${isActive && "font-semibold"}`}>
									Theo dõi
								</span>
							</>
						)}
					</NavLink>

					<NavLink to="/search" className={styles.navBaseStyle} onClick={closeNotification}>
						{({ isActive }) => (
							<>
								<SearchIcon compareVar={isActive} />
								<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden ${isActive && "font-semibold"}`}>
									Tìm kiếm
								</span>
							</>
						)}
					</NavLink>

					<NavLink to="/message" className={styles.navBaseStyle} onClick={closeNotification}>
						{({ isActive }) => (
							<>
								<svg className="size-[26px]" viewBox="0 0 26 26" fill="none">
									<path
										className={`stroke-primary-text ${isActive ? "fill-primary-text" : ""} `}
										d="M2 8.72057C2 6.71818 2 5.71698 2.4074 4.95218C2.76577 4.27943 3.33759 3.73247 4.04092 3.38969C4.84048 3 5.88719 3 7.9806 3H18.4466C20.5401 3 21.5867 3 22.3864 3.38969C23.0897 3.73247 23.6615 4.27943 24.0198 4.95218C24.4272 5.71698 24.4272 6.71818 24.4272 8.72057V15.1562C24.4272 17.1586 24.4272 18.1597 24.0198 18.9246C23.6615 19.5974 23.0897 20.1443 22.3864 20.4871C21.5867 20.8768 20.5401 20.8768 18.4466 20.8768H15.3114C14.534 20.8768 14.1452 20.8768 13.7733 20.9498C13.4434 21.0146 13.1242 21.1217 12.8243 21.2683C12.4862 21.4335 12.1826 21.6657 11.5754 22.1303L8.60328 24.4047C8.08485 24.8014 7.82564 24.9998 7.60748 25C7.41776 25.0002 7.23828 24.9176 7.11993 24.7758C6.98383 24.6128 6.98383 24.2953 6.98383 23.6602V20.8768C5.82513 20.8768 5.24577 20.8768 4.77044 20.755C3.48053 20.4244 2.47299 19.4606 2.12736 18.2268C2 17.7722 2 17.218 2 16.1096V8.72057Z"
										strokeWidth="1.5"
									/>
									<path
										className={`stroke-primary-text ${isActive ? "fill-background" : ""}`}
										d="M12.9966 8.84795C11.9969 7.68205 10.3299 7.36843 9.07734 8.43604C7.82482 9.50365 7.64849 11.2886 8.6321 12.5513C9.24148 13.3336 10.771 14.7623 11.8467 15.7363C12.2418 16.094 12.4392 16.2729 12.6763 16.3449C12.8798 16.4068 13.1134 16.4068 13.3168 16.3449C13.5539 16.2729 13.7514 16.094 14.1466 15.7363C15.2221 14.7623 16.7517 13.3336 17.361 12.5513C18.3447 11.2886 18.1899 9.49242 16.9158 8.43604C15.6418 7.37966 13.9962 7.68205 12.9966 8.84795Z"
										strokeWidth="1.4"
									/>
								</svg>

								<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden ${isActive && "font-semibold"}`}>
									Tin nhắn
								</span>
							</>
						)}
					</NavLink>

					<button
						className={`${styles.navBaseStyle} ${!isInMessage ? "lg:!hidden sm:!flex !hidden" : "sm:!flex !hidden"}`}
						onClick={toggleShowNotification}
					>
						<div className="relative">
							<Bell active={isVisible} />
							<div className="absolute size-2.5 -top-[1px] right-[1px]  bg-primary rounded-full " />
						</div>
						<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden`}>Thông báo</span>
					</button>

					<button className={styles.navBaseStyle} onClick={handlePopupCreatePost}>
						<svg className="size-[26px]" viewBox="0 0 26 26" fill="none">
							<path
								className="fill-primary-text"
								d="M12.9359 1H14.6744C15.1368 1 15.5116 1.37484 15.5116 1.83721C15.5116 2.29958 15.1368 2.67442 14.6744 2.67442H13C10.3452 2.67442 8.43838 2.67619 6.98725 2.87129C5.56018 3.06316 4.69985 3.42806 4.06396 4.06396C3.42806 4.69985 3.06316 5.56019 2.87129 6.98725C2.67619 8.43839 2.67442 10.3452 2.67442 13C2.67442 15.6547 2.67619 17.5615 2.87129 19.0127C3.06316 20.4398 3.42806 21.3001 4.06396 21.936C4.69985 22.572 5.56018 22.9369 6.98725 23.1286C8.43838 23.3238 10.3452 23.3256 13 23.3256C15.6547 23.3256 17.5615 23.3238 19.0127 23.1286C20.4398 22.9369 21.3001 22.572 21.936 21.936C22.572 21.3001 22.9369 20.4398 23.1286 19.0127C23.3238 17.5615 23.3256 15.6547 23.3256 13V11.3256C23.3256 10.8632 23.7004 10.4884 24.1628 10.4884C24.6251 10.4884 25 10.8632 25 11.3256V13.0641C25 15.6409 25 17.6602 24.7882 19.2359C24.5713 20.8485 24.1189 22.1212 23.1201 23.1201C22.1212 24.1189 20.8485 24.5713 19.2358 24.7882C17.6602 25 15.6409 25 13.0641 25H12.9359C10.3591 25 8.33974 25 6.76413 24.7882C5.1514 24.5713 3.87882 24.1189 2.87997 23.1201C1.88111 22.1212 1.42864 20.8485 1.21181 19.2359C0.999978 17.6602 0.999989 15.6409 1 13.0641V12.9359C0.999989 10.3591 0.999978 8.33974 1.21181 6.76414C1.42864 5.1514 1.88111 3.87883 2.87997 2.87997C3.87882 1.88111 5.1514 1.42864 6.76413 1.21181C8.33974 0.999978 10.3591 0.999989 12.9359 1ZM18.3252 2.14521C19.8521 0.618265 22.3278 0.618265 23.8548 2.14521C25.3817 3.67215 25.3817 6.1478 23.8548 7.67475L16.4337 15.0959C16.0192 15.5104 15.7595 15.77 15.4699 15.9961C15.1286 16.2622 14.7594 16.4904 14.3687 16.6766C14.037 16.8346 13.6886 16.9507 13.1326 17.136L9.89033 18.2168C9.29172 18.4163 8.63177 18.2606 8.1856 17.8144C7.73944 17.3682 7.58364 16.7083 7.78317 16.1096L8.86392 12.8674C9.04924 12.3114 9.16534 11.963 9.32341 11.6313C9.5096 11.2406 9.73779 10.8714 10.004 10.5301C10.2299 10.2404 10.4896 9.98078 10.9041 9.56632L18.3252 2.14521ZM22.6707 3.3292C21.7977 2.45616 20.3823 2.45616 19.5092 3.3292L19.0888 3.74962C19.1142 3.85662 19.1496 3.98411 19.1989 4.12632C19.3589 4.58741 19.6616 5.19465 20.2335 5.7665C20.8053 6.33834 21.4126 6.64107 21.8736 6.80104C22.0158 6.85038 22.1433 6.88583 22.2504 6.91117L22.6707 6.49076C23.5438 5.61772 23.5438 4.20223 22.6707 3.3292ZM20.9313 8.23023C20.3554 7.98253 19.6845 7.58544 19.0494 6.95049C18.4145 6.31555 18.0174 5.64463 17.7697 5.06868L12.1265 10.7119C11.6616 11.1769 11.4792 11.3613 11.3242 11.5599C11.1329 11.8052 10.9688 12.0708 10.835 12.3517C10.7265 12.5792 10.6432 12.8246 10.4352 13.4484L9.95312 14.8948L11.1052 16.0469L12.5516 15.5647C13.1754 15.3568 13.4208 15.2734 13.6483 15.165C13.9292 15.0312 14.1947 14.8671 14.4401 14.6757C14.6387 14.5208 14.8231 14.3384 15.288 13.8735L20.9313 8.23023Z"
							/>
						</svg>
						<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden`}>Tạo bài viết</span>
					</button>

					<NavLink to={`/profile?id=${user.userId}`} className={styles.navBaseStyle} onClick={closeNotification}>
						{({ isActive }) => (
							<>
								<div className="size-[26px] rounded-full overflow-hidden">
									<img className="size-full object-cover object-center" src={user.avatar} alt="navbar avatar account" />
								</div>
								<span className={`${!isInMessage ? "sm:inline" : "lg:inline"} hidden ${isActive && "font-semibold"}`}>
									Hồ sơ
								</span>
							</>
						)}
					</NavLink>
				</div>
			</div>

			<div className="sm:flex hidden mx-4">
				<Popover>
					<PopoverTrigger className={`${styles.navBaseStyle}`} onClick={closeNotification}>
						<HamburgerIcon />
						<span className={!isInMessage ? "" : "lg:inline hidden"}>Thêm</span>
					</PopoverTrigger>
					<PopoverContent sideOffset={10} className="ms-4 bg-background w-72 border shadow-xl p-2">
						<NavMorePopup />
					</PopoverContent>
				</Popover>
			</div>
		</nav>
	);
}
