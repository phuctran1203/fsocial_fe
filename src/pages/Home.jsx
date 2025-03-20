import React, { useEffect, useRef } from "react";
import { getPosts } from "../api/postsApi";
import { useHomePostsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";
import { ownerAccountStore } from "@/store/ownerAccountStore";

export default function Home() {
	const setPosts = useHomePostsStore((state) => state.setPosts);
	const user = ownerAccountStore((state) => state.user);

	const fetchPosts = async () => {
		const resp = await getPosts(user.userId);
		if (!resp || resp.statusCode !== 200) return;
		setPosts(resp.data); //testing skeleton
	};

	useEffect(() => {
		if (!user?.userId) return;
		fetchPosts();
	}, [user?.userId]);

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
					<RenderPosts
						className="sm:rounded shadow-y"
						store={useHomePostsStore}
					/>
				</div>
			</div>
		</div>
	);
}
