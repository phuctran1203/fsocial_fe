import React, { useEffect } from "react";
import CommentModal from "../components/CommentModal";
import { getPosts } from "../api/postsApi";
import { postsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";

export default function Follow() {
	const setPosts = postsStore((state) => state.setPosts);

	useEffect(() => {
		const fetchPosts = async () => {
			const resp = await getPosts();
			setPosts(resp?.statusCode === 200 ? resp.data : null);
		};
		fetchPosts();
	}, []);

	return (
		<div className="bg-background flex flex-grow transition">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					className="
							w-full mx-auto
							lg:max-w-[540px]
							md:space-y-4 md:pb-0
							sm:mt-0
							space-y-1.5 pb-12"
				>
					<RenderPosts className="sm:rounded shadow-y" />
				</div>
			</div>

			<CommentModal />
		</div>
	);
}
