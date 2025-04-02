import React from "react";
import Post from "./Post";
import { Skeleton } from "./ui/skeleton";

export default function RenderPosts({ store, className }) {
	console.log("vào được render post");

	const posts = store((state) => state.posts);
	console.log("posts: ", posts);

	return (
		<>
			{!posts &&
				[0, 1].map((l) => (
					<div key={l} className="pt-4 shadow-y transition">
						<div className="px-4 space-y-6">
							<div className="flex space-x-2">
								<Skeleton className="size-9 rounded-full" />

								<div className="gap-1 flex flex-col justify-center">
									<Skeleton className="w-[100px] h-4 rounded-sm" />
									<Skeleton className="w-[100px] h-4 rounded-sm" />
								</div>
							</div>

							<Skeleton className="px-4 w-1/2 h-4 rounded-sm" />
						</div>
						<Skeleton className="mt-1.5 w-full aspect-square rounded-sm" />
					</div>
				))}

			{posts?.map((post, index) => (
				<Post key={index} post={post} className={className} store={store} />
			))}
		</>
	);
}
