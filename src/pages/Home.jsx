import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Post from '../components/Post';
import CommentModal from '../components/CommentModal';
import Nav from '../components/Nav';
import '../index.scss';
import { getPosts } from "../api/postapi";

export default function Home() {

	const [post, setPost] = useState([])
	const [data, setData] = useState([])


	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await getPosts();
				console.log("load post");
				console.log(response.data);
				setData(response);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};
		
		fetchPosts();
	}, []); 

	console.log(data);
	
	useEffect(() =>{
		const posts = [
			{
				id: 1,
				userID: "1",
				user: "Phúc Trần",
				avatar: "/fsocial_fe/icon/user.svg",
				content: "Tôi dẫn vợ tôi đi chơi. Hihi",
				image: "/fsocial_fe/post_img.svg",
				time: "1 giờ trước",
				likes: 123,
				comments: [
					{
						id: 1,
						userID: "3",
						user: "Tấn Cang",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "Bữa tôi cũng đến đây mà không gặp fen nhỉ?",
						likes: 3,
						time: "1 giờ trước",
						replies: [
							{
								id: 1,
								userID: "1",
								user: "Phúc Trần",
								avatar: "/fsocial_fe/icon/user.svg",
								content: "Chắc là duyên chưa tới rồi. Haha!",
								likes: 1,
								time: "30 phút trước",
							},
						],
					},
					{
						id: 2,
						userID: "3",
						user: "Phúc Thịnh",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "Đỉnh quá, chụp chỗ nào đấy!!!! 🤩",
						likes: 5,
						time: "2 giờ trước",
						replies: [],
					},
				],
			},
			{
				id: 2,
				userID: "1",
				user: "Phúc Trần",
				avatar: "/fsocial_fe/icon/user.svg",
				content: "Hihi",
				image: "/fsocial_fe/post_img2.svg",
				time: "1 giờ trước",
				likes: 9999,
				comments: [
					{
						id: 1,
						userID: "3",
						user: "Tấn Cang",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "quá dễ thương",
						likes: 3,
						time: "1 giờ trước",
						replies: [],
					},
					{
						id: 2,
						userID: "3",
						user: "Phúc Thịnh",
						avatar: "/fsocial_fe/icon/user.svg",
						content: "chụp chỗ nào đấy 🤩",
						likes: 5,
						time: "2 giờ trước",
						replies: [],
					},
				],
			},
		];

		setPost(posts)
	}, [])


	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);

	const openModal = (post) => {
		setSelectedPost(post);
		setIsModalOpen(true);
	};

	return (
		<div className="bg-[--background-clr] flex h-screen">

			<Nav />
			
			<div className="w-3/5 p-5 overflow-y-auto h-full scrollable-div">
				{post.map((post) => (
					<Post key={post.id} post={post} openModal={openModal} />
				))}
			</div>

			<div className="w-1/5 bg-white p-5 shadow-md">
				<h2 className="text-lg font-semibold">Thông báo</h2>
				<ul className="mt-3 space-y-2">
					<li className="text-sm">Phương Nam đã bình luận về bài viết của bạn</li>
				</ul>
			</div>

			{isModalOpen && <CommentModal post={selectedPost} setIsModalOpen={setIsModalOpen} />}
		</div>
	);
}
