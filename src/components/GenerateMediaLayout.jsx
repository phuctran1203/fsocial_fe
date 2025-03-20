import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getPost } from "@/api/postsApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";

export const regexVideo = /\/video\//;

export const regexImage = /\/image\//;

const classLayout = (medias) => {
	if (medias.length === 1) {
		return "";
	}
	// if(typeof(medias) )
	if (medias.length === 2) {
		return "flex";
	}
	if (medias.length === 3) {
		return "grid grid-cols-3";
	}
	if (medias.length >= 4) {
		return "grid grid-cols-2 grid-rows-2";
	}
};

export default function GenerateMediaLayout({ medias }) {
	const [post, setPost] = useState(null);

	const handleGetPost = async (postId) => {
		const user = ownerAccountStore.getState().user;
		const resp = await getPost(user.userId, postId);
		if (!resp || resp.statusCode !== 200) return;
		setPost(resp.data);
	};

	const isPost = (medias) =>
		medias.length === 1 &&
		!regexImage.test(medias[0]) &&
		!regexVideo.test(medias[0]);

	useEffect(() => {
		isPost(medias) && handleGetPost(medias[0]);
	}, []);

	return (
		medias.length > 0 && (
			<div
				className={`max-h-[960px] overflow-hidden border-y transition ${classLayout(
					medias
				)}`}
			>
				{medias.map((media, index) => (
					<div key={index} className="overflow-hidden">
						{regexImage.test(media) && (
							<img
								src={media}
								alt="Bài đăng"
								className="size-full object-cover"
							/>
						)}
						{regexVideo.test(media) && (
							<video src={media} controls className="size-full object-cover" />
						)}
						{post && (
							<Post
								post={post}
								isChildren={true}
								showReact={false}
								className="rounded-lg shadow-t"
							/>
						)}

						{/* <ProcessMedia media={media} /> */}
					</div>
				))}
			</div>
		)
	);
}
