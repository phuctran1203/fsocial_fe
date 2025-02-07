import React, { useState } from "react";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import CommentModal from "../components/CommentModal";
import Nav from "../components/Nav";
import "../index.scss";

export default function Home() {
	const posts = [
		{
			id: 1,
			userID: "1",
			user: "Phúc Trần",
			avatar: "user_1.png",
			content: "Tôi dẫn vợ tôi đi chơi. Hihi",
			image: "post_image_1.png",
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
			avatar: "user_1.png",
			content: "Hihi",
			image: "post_image_2.png",
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

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);

	const openModal = (post) => {
		setSelectedPost(post);
		setIsModalOpen(true);
	};

	return (
		<div className=" bg-[--background-clr] flex flex-grow h-screen">
			<div className="overflow-y-auto scrollable-div w-full">
				<div
					className="
						space-y-1 w-full pb-12 mt-12 mx-auto
						lg:max-w-[600px]
						md:space-y-4 md:pb-0
						sm:mt-0"
				>
					{posts.map((post) => (
						<Post key={post.id} post={post} openModal={openModal} />
					))}
				</div>
			</div>

			{isModalOpen && <CommentModal post={selectedPost} setIsModalOpen={setIsModalOpen} />}
		</div>
	);
}
