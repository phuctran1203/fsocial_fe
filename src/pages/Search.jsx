import React, { useState, useEffect, useRef } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import { SearchIcon } from "../components/Icon";
import { searchAPI } from "../api/searchApi";
import CommentModal from "../components/CommentModal";
import { postsStore } from "../store/postsStore";

export default function Search() {
	const [query, setQuery] = useState("");

	const [tab, setTab] = useState("all");

	const [users, setUsers] = useState([]);

	const setPosts = postsStore((state) => state.setPosts);

	const posts = postsStore((state) => state.posts);

	const handleSendKeyword = async () => {
		const [respUsers, respPosts] = await Promise.all([searchAPI.searchUsers(query), searchAPI.searchPosts(query)]);
		const dataUsers = respUsers.data;
		const dataPosts = respPosts.data;
		setUsers(dataUsers);
		setPosts(dataPosts);
	};

	const timeout = useRef(null);

	useEffect(() => {
		timeout.current = setTimeout(() => {
			handleSendKeyword();
		}, 500);
		return () => clearTimeout(timeout.current);
	}, [query]);

	return (
		<div
			className="flex-grow bg-[--background-clr] h-screen overflow-auto scrollable-div
           sm:pt-5 pt-16"
		>
			<div className="md:space-y-5 space-y-4 lg:max-w-[540px] mx-auto">
				<label
					htmlFor="search"
					className="flex gap-2 mx-3 py-2 px-3 border rounded-full border-gray-2light hover:border-gray-light"
				>
					<SearchIcon color="stroke-gray" className="size-6" />
					<input
						id="search"
						type="text"
						placeholder="Tìm kiếm..."
						className="w-full outline-none bg-transparent"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</label>
				<div className="flex px-3">
					<Button
						className={`btn-transparent py-2.5 rounded-r-none ${tab === "all" && "bg-secondary"}`}
						onClick={() => setTab("all")}
					>
						<p className={tab !== "all" && "text-gray"}> Tất cả</p>
					</Button>
					<Button
						className={`btn-transparent py-2.5 rounded-none ${tab === "users" && "bg-secondary"}`}
						onClick={() => setTab("users")}
					>
						<p className={tab !== "users" && "text-gray"}>Mọi người</p>
					</Button>
					<Button
						className={`btn-transparent py-2.5 rounded-l-none ${tab === "posts" && "bg-secondary"}`}
						onClick={() => setTab("posts")}
					>
						<p className={tab !== "posts" && "text-gray"}>Bài viết</p>
					</Button>
				</div>
				{tab === "all" || tab === "users" ? (
					<div className="px-3">
						<h5 className="font-medium">Người dùng</h5>
						{users.map((user) => (
							<div key={user.userId} className="flex items-center justify-between border-b py-3">
								<div className="flex items-center space-x-3">
									<img src={user.avatar || "./temp/default_avatar.svg"} alt="avatar" className="size-12 rounded-full" />
									<div>
										<p className="font-semibold">{user.displayName}</p>
										{user.followers > 0 && <p className="fs-xs text-gray">{user.followers} người theo dõi</p>}
									</div>
								</div>
								<Button className="btn-ghost max-w-fit px-4 py-1 rounded">Theo dõi</Button>
							</div>
						))}
					</div>
				) : null}
				{tab === "all" || tab === "posts" ? (
					<div className="sm:space-y-3 space-y-2 lg:px-3">
						<h5 className="font-medium lg:px-0 px-3">Bài viết liên quan</h5>
						{posts?.map((post) => (
							<Post key={post.id} post={post} className="sm:rounded ct-shadow-y" />
						))}
					</div>
				) : null}
			</div>
			<CommentModal />
		</div>
	);
}
