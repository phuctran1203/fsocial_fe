import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/postsApi";
import { useFollowPostsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import {
	messageDontHavePost,
	messageReadAllPosts,
} from "@/config/globalVariables";

export default function Follow() {
	const { posts, setPosts, appendPosts, smartObserver, disconnectObserver } =
		useFollowPostsStore();
	const user = ownerAccountStore((state) => state.user);
	const [isEndPosts, setIsEndPosts] = useState(false);

	const fetchPosts = async () => {
		const resp = await getPosts(user.userId);
		if (!resp || resp.statusCode !== 200) return;
		if (!posts) {
			setPosts(resp.data);
		} else {
			if (posts.length !== 0 && resp.data.length === 0) {
				setIsEndPosts(true);
				return;
			}
			appendPosts(resp.data);
		}
	};

	// Infinite scroll fetch posts
	const containerRef = useRef();

	useEffect(() => {
		const target = Array.from(containerRef.current.childNodes).at(-3);
		if (target) smartObserver(target, fetchPosts);
		return () => disconnectObserver();
	}, [posts]);

	useEffect(() => {
		if (!user?.userId) return;
		fetchPosts();
	}, [user?.userId]);

	return (
		<div className="bg-background flex flex-grow transition">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					ref={containerRef}
					className="
					w-full mx-auto
					lg:max-w-[540px]
					md:space-y-4 md:pb-0
					sm:mt-2
					space-y-1.5 pb-12"
				>
					<RenderPosts
						className="sm:rounded shadow-y"
						store={useFollowPostsStore}
					/>

					{posts?.length === 0 && (
						<p className="my-4 text-center text-gray">{messageDontHavePost}</p>
					)}

					{isEndPosts && (
						<p className="pb-4 text-center text-gray">{messageReadAllPosts}</p>
					)}
				</div>
			</div>
		</div>
	);
}
