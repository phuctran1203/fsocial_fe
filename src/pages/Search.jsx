import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import { LoadingIcon } from "../components/Icon";
import { searchUsers, searchPosts } from "../api/searchApi";
import { useSearchPostsStore } from "../store/postsStore";
import RenderPosts from "@/components/RenderPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { combineIntoAvatarName } from "@/utils/combineName";
import { SearchIcon } from "lucide-react";

export default function Search() {
	const [query, setQuery] = useState("");

	const [tab, setTab] = useState("all");

	const [users, setUsers] = useState(null);

	const setPosts = useSearchPostsStore((state) => state.setPosts);

	const handleSendKeyword = async () => {
		setSearchAction(true);
		const [respUsers, respPosts] = await Promise.all([
			searchUsers(query),
			searchPosts(query),
		]);
		const dataUsers = respUsers.data;
		const dataPosts = respPosts.data;
		setUsers(dataUsers);
		setPosts(dataPosts);
		setSearchAction(false);
	};

	const timeout = useRef(null);
	const [searchAction, setSearchAction] = useState(false);

	useEffect(() => {
		timeout.current = setTimeout(() => {
			handleSendKeyword();
		}, 800);
		return () => clearTimeout(timeout.current);
	}, [query]);

	return (
		<div
			className="min-h-[100dvh] flex-grow bg-background overflow-auto scrollable-div
           sm:pt-5 pt-2 transition"
		>
			<div className="mx-auto md:space-y-5 space-y-4 lg:max-w-[540px]">
				<label
					htmlFor="search"
					className="mx-3 xl:mx-0 bg-background flex items-center gap-2 py-2 px-3 border rounded-full border-gray-2light hover:drop-shadow hover:border-gray"
				>
					<SearchIcon className="size-5 text-gray flex-shrink-0" />
					<input
						id="search"
						type="text"
						placeholder="Tìm kiếm..."
						className="w-full outline-none bg-transparent"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					{searchAction && <LoadingIcon stroke="stroke-gray" />}
				</label>
				<div className="mx-3 xl:mx-0 flex gap-6">
					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "all"
								? "border-primary text-primary"
								: "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("all")}
					>
						Tất cả
					</button>

					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "users"
								? "border-primary text-primary"
								: "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("users")}
					>
						Mọi người
					</button>

					<button
						className={`py-2 w-full rounded-t-sm border-b hover:border-primary hover:text-primary active:bg-gray-3light ${
							tab === "posts"
								? "border-primary text-primary"
								: "border-transparent text-gray"
						} transition`}
						onClick={() => setTab("posts")}
					>
						Bài viết
					</button>
				</div>

				{(tab === "all" || tab === "users") && (
					<div className="mx-3 xl:mx-0">
						<h5 className="font-medium">Người dùng</h5>
						{!users &&
							[0, 1, 2, 3, 4].map((i) => (
								<div key={i} className="py-2 flex items-center gap-3">
									<Skeleton className="size-12 rounded-full" />
									<div className="space-y-1 flex-grow">
										<Skeleton className="w-32 h-4 rounded-sm" />
										<Skeleton className="w-24 h-4 rounded-sm" />
									</div>
								</div>
							))}

						{users?.length === 0 && (
							<p className="text-center text-gray">
								Không tìm thấy người dùng nào
							</p>
						)}

						{users?.map((user) => (
							<div
								key={user.userId}
								className="flex items-center justify-between border-b py-3 transition"
							>
								<div className="flex items-center space-x-3">
									<Avatar className="size-12">
										<AvatarImage src={user.avatar} />
										<AvatarFallback>
											{combineIntoAvatarName(user.firstName, user.lastName)}
										</AvatarFallback>
									</Avatar>

									<div>
										<p className="font-semibold">{user.displayName}</p>
										{user.followers > 0 && (
											<p className="fs-xs text-gray">
												{user.followers} người theo dõi
											</p>
										)}
									</div>
								</div>
								<Button className="btn-ghost max-w-fit px-4 py-1 rounded">
									Theo dõi
								</Button>
							</div>
						))}
					</div>
				)}

				{(tab === "all" || tab === "posts") && (
					<div className="sm:space-y-3 space-y-2">
						<h5 className="font-medium lg:px-0 px-3">Bài viết liên quan</h5>
						<RenderPosts
							className="sm:rounded shadow-y"
							store={useSearchPostsStore}
							emptyMessage="Không tìm thấy bài viết nào"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
