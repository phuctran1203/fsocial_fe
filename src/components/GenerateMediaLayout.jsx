import React from "react";

export const regexVideo = /\/video\//;

export const regexImage = /\/image\//;

const ProcessMedia = ({ media }) => {
	if (regexImage.test(media))
		return (
			<img src={media} alt="Bài đăng" className="size-full object-cover" />
		);
	if (regexVideo.test(media))
		return <video src={media} controls className="size-full object-cover" />;
};

const classLayout = (medias) => {
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
	return (
		<div className={`max-h-[960px] border-y transition ${classLayout(medias)}`}>
			{medias.map((media) => (
				<div className="overflow-hidden">
					<ProcessMedia media={media} />
				</div>
			))}
		</div>
	);
}
