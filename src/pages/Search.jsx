import React, { useState, useEffect, useRef } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import { SearchIcon } from "../components/Icon";
import { searchAPI } from "../api/searchApi";

export default function Search() {
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState("all");
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	// const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
	// const filteredPosts = posts.filter((post) => post.content.toLowerCase().includes(query.toLowerCase()));

	const handleSendKeyword = async () => {
		console.log("send keyword");

		const [respUsers, respPosts] = await Promise.all([searchAPI.searchUsers(query), searchAPI.searchPosts(query)]);

		const dataUsers = respUsers.data;
		const dataPosts = respPosts.data;
		setUsers(dataUsers);
		setPosts(dataPosts);
	};
	// const firstRender = useRef(true);
	let timeout = null;
	useEffect(() => {
		// if (firstRender.current) {
		// 	firstRender.current = false;
		// 	return;
		// }
		timeout = setTimeout(() => {
			handleSendKeyword();
		}, 1000);
		return () => clearTimeout(timeout);
	}, [query]);

	return (
		<div
			className="flex-grow bg-[--background-clr] h-screen overflow-auto scrollable-div
          lg:border-none sm:pt-5 pt-16"
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
						{users.map((user) => (
							<div key={user.userId} className="flex items-center justify-between border-b py-3">
								<div className="flex items-center space-x-3">
									<img src={user.avatar || "./temp/default_avatar.svg"} alt="avatar" className="size-12 rounded-full" />
									<div>
										<p className="font-semibold">{user.displayName}</p>
										{user.followers > 0 && <p className="fs-xsm text-[--gray-clr]">{user.followers} người theo dõi</p>}
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
						{posts.map((post) => (
							<Post key={post.id} post={post} className="sm:rounded ct-shadow-y" />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
