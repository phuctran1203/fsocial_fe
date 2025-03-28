import { getPost } from "@/api/postsApi";
import RenderPosts from "@/components/RenderPosts";
import {
	messageDontHavePost,
	messageNotFoundPost,
} from "@/config/globalVariables";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { useSinglePostStore } from "@/store/postsStore";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SinglePost() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const postId = queryParams.get("id");
	const user = ownerAccountStore((state) => state.user);
	const { posts, setPosts } = useSinglePostStore();

	const handleGetPost = async () => {
		const resp = await getPost(user.userId, postId);
		if (!resp || resp.statusCode !== 200) {
			setPosts([]);
		}
		setPosts([resp.data]);
	};
	useEffect(() => {
		if (user?.userId) handleGetPost();
	}, [user?.userId, queryParams.get("id")]);
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
						store={useSinglePostStore}
					/>
					{posts?.length === 0 && (
						<p className="my-4 text-center text-gray">{messageNotFoundPost}</p>
					)}
				</div>
			</div>
		</div>
	);
}
