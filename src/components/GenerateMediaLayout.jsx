import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getPost } from "@/api/postsApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { regexImage, regexVideo } from "@/config/regex";
import { getImageSize, getVideoSize } from "@/utils/getSizeElement";

const classLayout = async (medias) => {
	const dimensions = await Promise.all(
		medias.map((media) => {
			if (regexImage.test(media)) {
				return getImageSize(media).catch((err) => {
					console.log(`Lỗi lấy kích thước cho ảnh ${media}: ${err}`);
				});
			}
			if (regexVideo.test(media)) {
				return getVideoSize(media).catch((err) => {
					console.log(`Lỗi lấy kích thước cho video ${media}: ${err}`);
				});
			}
			return Promise.resolve({}); // Trường hợp không khớp regex
		})
	);

	console.log("dimensions medias is: ", dimensions);
	const ratios = dimensions.map(
		(dimension) => dimension.width / dimension.height
	);
	console.log("ratios: ", ratios);

	if (medias.length === 1) return "";
	if (medias.length === 2) {
		return "flex";
	}
	if (medias.length === 3) {
		return "";
	}
	if (medias.length === 4) {
		return "";
	}
	if (medias.length >= 5) {
		return "";
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

	const isPost =
		medias.length === 1 &&
		!regexImage.test(medias[0]) &&
		!regexVideo.test(medias[0]);

	useEffect(() => {
		isPost && handleGetPost(medias[0]);
	}, []);

	const navigate = useNavigate();
	const handleToOriginPost = () => {
		navigate(`/post?id=${post.id}`);
	};

	return (
		medias.length > 0 && (
			<div
				className={cn(
					"max-h-[960px] overflow-hidden transition",
					!isPost ? cn("border-y border-x-0", classLayout(medias)) : "border-b"
				)}
			>
				{!isPost &&
					medias.map((media, index) => (
						<div key={index} className="overflow-hidden">
							{regexImage.test(media) && (
								<img
									src={media}
									alt="Bài đăng"
									className="size-full object-cover"
								/>
							)}
							{regexVideo.test(media) && (
								<video
									src={media}
									controls
									className="size-full object-cover"
								/>
							)}
						</div>
					))}

				{post && (
					<div onClick={handleToOriginPost}>
						<Post
							post={post}
							isChildren={true}
							showReact={false}
							className="border-t cursor-pointer rounded-lg overflow-hidden"
							isShared={true}
						/>
					</div>
				)}
			</div>
		)
	);
}
