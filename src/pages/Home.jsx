
import React, { useEffect } from "react";
import { getPost, postsApi } from "../api/postsApi";
import CommentModal from '../components/CommentModal';
import Post from '../components/Post';
import '../index.scss';
import { postsStore } from "../store/postsStore";

export default function Home() {
	const setPosts = postsStore((state) => state.setPosts);
	const posts = postsStore((state) => state.posts);


	useEffect(() => {

		const fetchPosts = async () => {
			try {
				const resp = await getPost()

				
				setPosts(resp.data);
			} catch (error) {
				console.log(error);
				setPosts(null);
			}
		};
		fetchPosts();
	}, []);

	return (
		<div className=" bg-[--background-clr] flex flex-grow h-screen">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					className="
					space-y-1 w-full pb-12 mt-12 mx-auto
					lg:max-w-[580px]
					md:space-y-4 md:pb-0
					sm:mt-0"
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
