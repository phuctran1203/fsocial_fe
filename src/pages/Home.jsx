import React, { useEffect, useRef } from "react";
import { getPosts } from "../api/postsApi";
import { postsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";
import { ownerAccountStore } from "@/store/ownerAccountStore";

export default function Home() {
	const setPosts = postsStore((state) => state.setPosts);
	const user = ownerAccountStore((state) => state.user);
	// const abortControllerRef = useRef(null);

	const fetchPosts = async () => {
		// if (abortControllerRef.current) {
		// 	abortControllerRef.current.abort();
		// }
		// const controller = new AbortController();
		// abortControllerRef.current = controller;
		const resp = await getPosts(user.userId);
		setPosts(resp?.data || []);
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
					<RenderPosts className="sm:rounded shadow-y" />
				</div>
			</div>
		</div>
	);
}
