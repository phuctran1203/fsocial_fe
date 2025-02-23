import { ownerAccountStore } from "@/store/ownerAccountStore";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Glyph, PictureProfileTabIcon, PostProfileTabIcon } from "@/components/Icon";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";

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
		icon: <PostProfileTabIcon />,
	},
	{
		label: "Người theo dõi",
		icon: <PostProfileTabIcon />,
	},
	{
		label: "Đã tương tác",
		icon: <PostProfileTabIcon />,
	},
];

export default function Profile() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const user = ownerAccountStore.getState().user;

	const [currentTab, setCurrentTab] = useState(0);

	return (
		<div className="flex-grow bg-background sm:pt-5 pt-16 transition h-full overflow-auto scrollable-div">
			<div className="lg:max-w-[630px] mx-auto">
				{/* banner */}
				<div className="aspect-[3/1] overflow-hidden rounded-lg">
					<img src="./temp/banner.png" alt="Ảnh bìa" className="object-cover size-full object-center" />
				</div>
				<div className="-mt-6 mx-auto lg:max-w-[610px]">
					{/* profile detail */}

					<div className=" flex gap-3 ">
						<div className="bg-background border-4 rounded-full p-1 w-fit">
							<div className="size-[120px] overflow-hidden rounded-full">
								<img src={user.avatar} alt="" className="size-full object-cover object-center" />
							</div>
						</div>

						<div className="self-end flex-grow mb-2">
							<h3>{user.displayName}</h3>
							<p>12 người theo dõi</p>
							<div className="mt-1 flex -space-x-2">
								{listFriends.map((friend, index) => (
									<div className="relative">
										<Avatar className={`size-7 ring-[2px] ring-background`}>
											<AvatarImage src={friend.avatar} />
											<AvatarFallback>{friend?.firstName?.charAt(0) ?? "?"}</AvatarFallback>
											<button>abc</button>
										</Avatar>
										{index + 1 === listFriends.length && (
											<button className="absolute top-0 size-full bg-black/50 grid place-content-center rounded-full hover:bg-black/60">
												<Glyph color="fill-txtWhite" />
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						{queryParams.get("id") !== user.userId && (
							<div className="self-center">
								<Button className="btn-primary px-8 py-2">Theo dõi</Button>
							</div>
						)}
					</div>
					{/* bio desktop */}
					<div className="mt-3 md:block hidden text-center">Tôi là người, tôi không phải robot</div>
					{/* tabs */}
					<div className="mt-6 border-t">
						<div className="flex justify-between">
							{listTabs.map((tab, index) => (
								<button
									key={index}
									className={`flex items-center gap-1 border-t p-1 ${
										currentTab === index
											? "text-primary-text fill-primary-text stroke-primary-text border-primary-text"
											: "text-gray fill-gray stroke-gray border-background"
									}`}
									onClick={() => setCurrentTab(index)}
								>
									{tab.icon} <span className="sm:inline hidden"> {tab.label}</span>
								</button>
							))}
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
	);
}
