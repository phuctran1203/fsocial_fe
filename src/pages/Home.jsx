
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Post from '../components/Post';
import CommentModal from '../components/CommentModal';
import Nav from '../components/Nav';
import '../index.scss';
import { getPosts } from "../api/postapi";

export default function Home() {
	const setPosts = postsStore((state) => state.setPosts);
	const posts = postsStore((state) => state.posts);


	useEffect(() => {
		const controller = new AbortController();
		const fetchPosts = async () => {
			setPosts(await postsApi.getPosts(), controller.signal);
		};
		fetchPosts();
		return () => controller.abort();
	}, []);

	return (
		<div className=" bg-[--background-clr] flex flex-grow h-screen">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					className="
					w-full mx-auto
					lg:max-w-[580px]
					md:space-y-4 md:pb-0
					sm:mt-0
					mt-12 space-y-1 pb-12"
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
