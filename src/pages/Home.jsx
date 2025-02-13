
import React, { useEffect } from "react";
import { postsApi } from "../api/postsApi";
import CommentModal from '../components/CommentModal';
import Post from '../components/Post';
import '../index.scss';
import { postsStore } from "../store/postsStore";
import axios from "axios";
import API from "../api/axiosInstance";

export default function Home() {
	const setPosts = postsStore((state) => state.setPosts);
	const posts = postsStore((state) => state.posts);


	useEffect(() => {

		const result = async ()=> { 	
				console.log("call");
				
			return await API.get("/timeline")
			
		 }

		 result()

		// const controller = new AbortController();
		// const fetchPosts = async () => {
		// 	setPosts(await postsApi.getPosts(), controller.signal);
		// };
		// fetchPosts();
		// return () => controller.abort();
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
