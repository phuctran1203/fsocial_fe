import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export default function ModalCarouel({ medias }) {
	return (
		<div className="relative flex-grow sm:w-[700px] w-screen sm:h-[90dvh] h-[100dvh]">
			<Carousel className="w-[80%] mx-auto h-[96%]">
				<CarouselContent className="h-full">
					{medias.map((media, index) => (
						<CarouselItem key={index} className="h-full">
							{media.type === "image" && (
								<img
									src={media.src}
									alt="Bài đăng"
									className="size-full object-contain"
								/>
							)}
							{media.type === "video" && (
								<video src={media.src} controls className="" />
							)}
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
