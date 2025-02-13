import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import { SearchIcon } from "../components/Icon";

export default function Search() {
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState("all");
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
	const filteredPosts = posts.filter((post) => post.content.toLowerCase().includes(query.toLowerCase()));

	useEffect(() => {
		setUsers([
			{ id: 1, name: "Phương Nam", followers: 120, avatar: "user_1.png" },
			{ id: 2, name: "Phúc Trần", followers: 120, avatar: "user_1.png" },
			{ id: 3, name: "Cang Ngô", followers: 120, avatar: "user_2.png" },
			{ id: 4, name: "Đức khải", followers: 120, avatar: "user_2.png" },
		]);
		setPosts([
			{
				id: 1,
				userID: "1",
				user: "Phúc Trần",
				avatar: "user_1.png",
				content: "Tôi dẫn vợ tôi đi chơi. Hihi",
				image: "post_image_1.png",
				time: "1 giờ trước",
				likes: 123,
				comments: [
					{
						id: 1,
						userID: "3",
						user: "Tấn Cang",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "Bữa tôi cũng đến đây mà không gặp fen nhỉ?",
						likes: 3,
						time: "1 giờ trước",
						replies: [
							{
								id: 1,
								userID: "1",
								user: "Phúc Trần",
								avatar: "/fsocial_fe/icon/user.svg",
								content: "Chắc là duyên chưa tới rồi. Haha!",
								likes: 1,
								time: "30 phút trước",
							},
						],
					},
					{
						id: 2,
						userID: "3",
						user: "Phúc Thịnh",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "Đỉnh quá, chụp chỗ nào đấy!!!! 🤩",
						likes: 5,
						time: "2 giờ trước",
						replies: [],
					},
				],
			},
			{
				id: 2,
				userID: "1",
				user: "Phúc Trần",
				avatar: "user_1.png",
				content: "Hihi",
				image: "post_image_2.png",
				time: "1 giờ trước",
				likes: 9999,
				comments: [
					{
						id: 1,
						userID: "3",
						user: "Tấn Cang",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "quá dễ thương",
						likes: 3,
						time: "1 giờ trước",
						replies: [],
					},
					{
						id: 2,
						userID: "3",
						user: "Phúc Thịnh",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "chụp chỗ nào đấy 🤩",
						likes: 5,
						time: "2 giờ trước",
						replies: [],
					},
				],
			},
		]);
	}, []);

	return (
		<div
			className="
          flex-grow bg-[--background-clr] h-screen overflow-auto scrollable-div
          lg:border-none
          sm:border-s sm:pt-5 
          pt-16
    "
		>
			<div className="md:space-y-5 space-y-4 lg:max-w-[600px] mx-auto">
				<div className="flex gap-2 mx-3 py-2 px-3 border rounded border-[--gray-light-clr] hover:border-[--gray-clr]">
					<SearchIcon color="stroke-[--gray-clr]" />
					<input
						type="text"
						placeholder="Tìm kiếm..."
						className="w-full outline-none"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<div className="flex px-3">
					<Button
						type="secondary"
						className={`py-2.5 rounded-r-none ${tab === "all" ? "bg-[--secondary-hover-clr]" : ""}`}
						onClick={() => setTab("all")}
					>
						Tất cả
					</Button>
					<Button
						type="secondary"
						className={`py-2.5 rounded-none ${tab === "users" ? "bg-[--secondary-hover-clr]" : ""}`}
						onClick={() => setTab("users")}
					>
						Mọi người
					</Button>
					<Button
						type="secondary"
						className={`py-2.5 rounded-l-none ${tab === "posts" ? "bg-[--secondary-hover-clr]" : ""}`}
						onClick={() => setTab("posts")}
					>
						Bài viết
					</Button>
				</div>
				{tab === "all" || tab === "users" ? (
					<div className="px-3">
						<h5 className="font-semibold">Người dùng</h5>
						{filteredUsers.map((user) => (
							<div key={user.id} className="flex items-center justify-between border-b py-3">
								<div className="flex items-center space-x-3">
									<img src={`./temp/${user.avatar}`} alt="avatar" className="size-12 rounded-full" />
									<div>
										<p className="font-semibold">{user.name}</p>
										<p className="fs-xsm text-[--gray-clr]">{user.followers} người theo dõi</p>
									</div>
								</div>
								<Button type="ghost" className="max-w-fit px-4 py-1 rounded">
									Theo dõi
								</Button>
							</div>
						))}
					</div>
				) : null}
				{tab === "all" || tab === "posts" ? (
					<div className="space-y-3 sm:px-3">
						<h5 className="font-semibold px-3">Bài viết</h5>
						{filteredPosts.map((post) => (
							<Post key={post.id} post={post} className="sm:rounded ct-shadow-y" />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
