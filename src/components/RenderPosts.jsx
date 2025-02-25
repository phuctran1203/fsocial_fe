import React from "react";
import Post from "./Post";
import { postsStore } from "@/store/postsStore";

export default function RenderPosts({ className }) {
	const posts = postsStore((state) => state.posts);
	return posts === null ? (
		<h1 className="text-center mt-20">Lỗi lấy posts</h1>
	) : (
		posts.map((post) => <Post key={post.id} post={post} className={className} />)
	);
}
