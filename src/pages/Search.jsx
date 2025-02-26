import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import { SearchIcon } from "../components/Icon";
import { searchUsers, searchPosts } from "../api/searchApi";
import CommentModal from "../components/CommentModal";
import { postsStore } from "../store/postsStore";
import RenderPosts from "@/components/RenderPosts";

export default function Search() {
	const [query, setQuery] = useState("");

	const [tab, setTab] = useState("all");

	const [users, setUsers] = useState([]);

	const setPosts = postsStore((state) => state.setPosts);

	const handleSendKeyword = async () => {
		const [respUsers, respPosts] = await Promise.all([searchUsers(query), searchPosts(query)]);
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
			className="flex-grow bg-background overflow-auto scrollable-div
           sm:pt-5 pt-2 transition"
		>
			<div className="md:space-y-5 space-y-4 lg:max-w-[540px] mx-auto">
				<label
					htmlFor="search"
					className="flex gap-2 mx-3 py-2 px-3 border rounded-full border-gray-2light hover:border-gray-light"
				>
					<SearchIcon color="stroke-gray" className="size-5" />
					<input
						id="search"
						type="text"
						placeholder="Tìm kiếm..."
						className="w-full outline-none bg-transparent"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</label>
				<div className="flex gap-6 px-3">
					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "all" ? "border-primary text-primary" : "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("all")}
					>
						Tất cả
					</button>

					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "users" ? "border-primary text-primary" : "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("users")}
					>
						Mọi người
					</button>

					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "posts" ? "border-primary text-primary" : "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("posts")}
					>
						Bài viết
					</button>
				</div>
				{tab === "all" || tab === "users" ? (
					<div className="px-3">
						<h5 className="font-medium">Người dùng</h5>
						{users.map((user) => (
							<div key={user.userId} className="flex items-center justify-between border-b py-3 transition">
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
						<RenderPosts className="sm:rounded shadow-y" />
					</div>
				) : null}
			</div>
			<CommentModal />
		</div>
	);
}
