import { regexImage, regexVideo } from "@/config/regex";

export const processMedias = (post) => {
	if (post.content?.media) {
		return post.content.media.map((media) => {
			let type;
			if (regexImage.test(media)) type = "image";
			else if (regexVideo.test(media)) type = "video";
			return {
				src: media,
				type,
			};
		});
	}
	if (post.originPostId) {
		return [{ src: post.originPostId, type: "post" }];
	}
	return [];
};
