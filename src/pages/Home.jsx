import React, { useEffect } from "react";
import Post from "../components/Post";
import CommentModal from "../components/CommentModal";
import { postsApi } from "../api/postsApi";
import { postsStore } from "../store/postsStore";
import "../index.scss";

export default function Home() {
	const setPosts = postsStore((state) => state.setPosts);
	const posts = postsStore((state) => state.posts);

	useEffect(() => {
		const fetchPosts = async () => {
			const resp = await postsApi.getPosts();
			setPosts(resp?.statusCode === 200 ? resp.data : null);
		};
		fetchPosts();
	}, []);

	return (
		<div className="bg-background flex flex-grow h-screen">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					className="
					w-full mx-auto
					lg:max-w-[580px]
					md:space-y-4 md:pb-0
					sm:mt-0
					mt-12 space-y-1.5 pb-12"
				>
					{posts === null ? (
						<h1>Lỗi lấy posts</h1>
					) : (
						posts.map((post) => <Post key={post.id} post={post} className="rounded ct-shadow-y" />)
					)}
				</div>
			</div>

			<CommentModal />
		</div>
	);
}
