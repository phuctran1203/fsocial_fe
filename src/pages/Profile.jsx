import { ownerAccountStore } from "@/store/ownerAccountStore";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	FollowerProfileTabIcon,
	Glyph,
	PictureProfileTabIcon,
	PostProfileTabIcon,
	ReactedProfileTabIcon,
	VideoProfileTabIcon,
} from "@/components/Icon";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { postsStore } from "@/store/postsStore";
import CommentModal from "@/components/CommentModal";
import { getPosts } from "@/api/postsApi";
import RenderPosts from "@/components/RenderPosts";

const listFriends = [
	{ firstName: "Thịnh", displayName: "Phúc Thịnh", avatar: "./temp/user_2.png" },
	{ firstName: "Nam", displayName: "Phương Nam", avatar: "./temp/user_3.png" },
	{ firstName: "Khải", displayName: "Đức Khải", avatar: "./temp/user_4.png" },
	{ firstName: "Đạt", displayName: "Tấn Đạt", avatar: "./temp/user_5.png" },
	{ firstName: "Cang", displayName: "Tấn Cang", avatar: "./temp/user_6.png" },
	{ firstName: "Nguyễn", displayName: "Minh Nguyễn", avatar: "./temp/user_7.jpg" },
	{ firstName: "Tiến", displayName: "Tiến Mụp", avatar: "./temp/user_8.jpg" },
	// { firstName: "Hồng", displayName: "Hồng Hài Nhi", avatar: "./temp/user_9.jpg" },
];

const listTabs = [
	{
		label: "Bài đăng",
		icon: <PostProfileTabIcon />,
	},
	{
		label: "Hình ảnh",
		icon: <PictureProfileTabIcon />,
	},
	{
		label: "Video",
		icon: <VideoProfileTabIcon />,
	},
	{
		label: "Người theo dõi",
		icon: <FollowerProfileTabIcon />,
	},
	{
		label: "Đã tương tác",
		icon: <ReactedProfileTabIcon />,
	},
];
export default function Profile() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const user = ownerAccountStore((state) => state.user);

	const maxPreviewFriendsAvatar = useRef(7);

	const containerTabsRef = useRef(null);

	const wrapperTabsRef = useRef(null);

	const [currentTab, setCurrentTab] = useState(0);

	const setPosts = postsStore((state) => state.setPosts);

	const showPosts = async () => {
		const resp = await getPosts();
		setPosts(resp?.statusCode === 200 ? resp.data : null);
	};

	const showPictures = async () => {};

	const showVideos = async () => {};

	const showFollowers = async () => {};

	const showPostsReacted = async () => {};

	useEffect(() => {
		switch (currentTab) {
			case 0:
				showPosts();
				break;
			case 1:
				showPictures();
				break;
			case 2:
				showVideos();
				break;
			case 3:
				showFollowers();
				break;
			case 4:
				showPostsReacted();
				break;
		}
	}, [currentTab]);

	const clickChangeTab = (index) => {
		const container = containerTabsRef.current;
		const targetChild = wrapperTabsRef.current.children[index];
		if (!container || !targetChild) return;
		const targetLeft = targetChild.offsetLeft - container.offsetLeft;
		container.scrollTo({ left: targetLeft, behavior: "smooth" });
		ignoreIntersec.current = true;
		setCurrentTab(index);
		setTimeout(() => {
			if (ignoreIntersec.current) ignoreIntersec.current = false;
		}, 500);
	};

	const [touched, setTouched] = useState(false);
	const startDragPos = useRef(0);
	const scrollLeftStart = useRef(0);
	const speedFactor = 2; // Tăng tốc cuộn lên 1.8 lần

	const ignoreIntersec = useRef(false);

	const onPressDown = (e) => {
		setTouched(true);
		const clientX = e.touches?.[0]?.clientX || e.clientX;
		startDragPos.current = clientX;
		scrollLeftStart.current = containerTabsRef.current?.scrollLeft || 0;
	};

	const onDrag = (e) => {
		if (!touched || !containerTabsRef.current) return;

		e.preventDefault(); // Ngăn chặn hành vi cuộn mặc định của trình duyệt

		const clientX = e.touches?.[0]?.clientX || e.clientX;
		const diff = clientX - startDragPos.current;

		// Tăng tốc độ cuộn bằng cách nhân với speedFactor
		containerTabsRef.current.scrollLeft = scrollLeftStart.current - diff * speedFactor;
	};

	const onEnd = () => {
		setTouched(false);
	};

	useEffect(() => {
		const interCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !ignoreIntersec.current) {
					const index = Array.from(wrapperTabsRef.current.children).indexOf(entry.target);
					setCurrentTab(index);
				}
			});
		};
		const options = {
			root: containerTabsRef.current, // Phạm vi quan sát (mặc định là viewport)
			rootMargin: "0px", // Biên ngoài phạm vi quan sát (giống margin trong CSS)
			threshold: 0.6, // Ngưỡng kích hoạt (0 → 1)
		};
		const observer = new IntersectionObserver(interCallback, options);
		Array.from(wrapperTabsRef.current.children).forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, [currentTab]);

	return (
		<div className="flex-grow bg-background transition overflow-auto scrollable-div">
			<div className="lg:max-w-[630px] mx-auto">
				{/* banner */}
				<div className="sm:mt-5 mt-2 aspect-[3/1] overflow-hidden rounded-lg">
					<img src="./temp/banner.png" alt="Ảnh bìa" className="object-cover size-full object-center" />
				</div>
				<div className="sm:-mt-6 -mt-4 mx-auto lg:max-w-[600px] ">
					{/* profile detail */}
					<div className="flex sm:flex-row sm:items-start flex-col items-center gap-4 sm:px-3 px-1">
						<div className="bg-background border-4 rounded-full p-1 w-fit transition">
							<Avatar className={`size-[120px]`}>
								<AvatarImage src={user.avatar} />
								<AvatarFallback className="text-[40px] transition">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
							</Avatar>
							{/* <div className="size-[120px] overflow-hidden rounded-full">
								<img src={user.avatar} alt="" className="size-full object-cover object-center" />
							</div> */}
						</div>

						<div className="sm:self-end sm:block flex flex-col items-center flex-grow sm:mb-2">
							<h3>{user.firstName + " " + user.lastName}</h3>
							<p>12 người theo dõi</p>
							<div className="mt-1 flex -space-x-2">
								{listFriends.slice(0, maxPreviewFriendsAvatar.current).map((friend, index) => (
									<div className="relative">
										<Avatar className={`size-7 ring-[2px] ring-background transition`}>
											<AvatarImage src={friend.avatar} />
											<AvatarFallback>{friend?.firstName?.charAt(0) ?? "?"}</AvatarFallback>
										</Avatar>
										{index + 1 ===
											(listFriends.length > maxPreviewFriendsAvatar.current
												? maxPreviewFriendsAvatar.current
												: listFriends.length) && (
											<button className="absolute top-0 size-full bg-black/50 grid place-content-center rounded-full hover:bg-black/60">
												<Glyph color="fill-txtWhite" />
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						{queryParams.get("id") === user.userId && (
							<div className="self-center">
								<Button className="btn-primary px-8 py-2">Theo dõi</Button>
							</div>
						)}
					</div>

					{/* bio */}
					<div className="mt-4 text-center">Tôi là người, tôi không phải robot</div>

					<div className="mt-8 flex flex-col gap-2 h-[100dvh]">
						{/* button head */}
						<div className="border-t flex bg-background transition">
							{listTabs.map((tab, index) => (
								<button
									key={index}
									className={`flex-grow flex items-center justify-center gap-1 border-t px-1 sm:py-1 py-3 ${
										currentTab === index
											? "text-primary-text fill-primary-text stroke-primary-text border-primary-text"
											: "text-gray fill-gray stroke-gray border-background"
									}`}
									onClick={() => clickChangeTab(index)}
								>
									{tab.icon} <span className="sm:inline hidden"> {tab.label}</span>
								</button>
							))}
						</div>

						{/* tab content */}
						<div
							ref={containerTabsRef}
							className="flex-grow w-full overflow-x-auto snap-x snap-mandatory scrollable-div scroll-smooth"
							onMouseDown={onPressDown}
							onMouseMove={onDrag}
							onMouseUp={onEnd}
						>
							<div ref={wrapperTabsRef} className="grid grid-cols-[repeat(5,100%)] h-full gap-[1px]">
								{/* owner posts */}
								<div className="snap-start mx-auto md:space-y-4 space-y-1.5 md:pb-0 overflow-y-auto w-full max-h-full scrollable-div">
									<RenderPosts className="sm:rounded shadow-y" />
								</div>
								{/* owner pictures */}
								<div className="snap-start grid grid-cols-3 gap-[1px] h-fit overflow-y-auto w-full max-h-full scrollable-div">
									{Array.from({ length: 8 }).map((_, index) => (
										<div key={index} className="aspect-square w-full overflow-hidden">
											<img
												src={`./temp/profile_tab_image_${index + 1}.png`}
												alt=""
												className="w-full object-cover object-center"
											/>
										</div>
									))}
								</div>
								{/* owner video */}
								<div className="snap-start grid grid-cols-3 gap-[1px] h-fit overflow-y-auto w-full max-h-full scrollable-div">
									{Array.from({ length: 8 }).map((_, index) => (
										<div key={index} className="relative aspect-square w-full overflow-hidden">
											<img
												src={`./temp/profile_tab_image_${index + 1}.png`}
												alt=""
												className="w-full object-cover object-center"
											/>
											<button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-black/60 rounded-full grid place-content-center">
												<svg className="size-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path
														className="stroke-txtWhite"
														d="M11.9949 5.41155C13.335 6.1039 13.335 7.8961 11.9949 8.58844L3.90312 12.7687C2.60064 13.4416 1 12.5658 1 11.1803V2.81974C1 1.43421 2.60064 0.558412 3.90312 1.23129L11.9949 5.41155Z"
														stroke-width="1.5"
													/>
												</svg>
											</button>
										</div>
									))}
								</div>
								{/* owner followers */}
								<div className="snap-start grid grid-cols-4 sm:gap-3 gap-2 h-fit overflow-y-auto w-full max-h-full scrollable-div">
									{listFriends.map((friend) => (
										<div key={friend.firstName}>
											<div className="aspect-square overflow-hidden rounded-md">
												<img src={friend.avatar} alt="" className="size-full object-cover object-center" />
											</div>
											<p className="font-semibold">{friend.displayName}</p>
										</div>
									))}
								</div>
								{/* owner posts reacted */}
								<div className="snap-start mx-auto md:space-y-4 space-y-1.5 md:pb-0 overflow-y-auto w-full max-h-full scrollable-div">
									<RenderPosts className="sm:rounded shadow-y" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CommentModal />
		</div>
	);
}
