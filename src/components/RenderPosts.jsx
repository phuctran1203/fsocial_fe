import React from "react";
import Post from "./Post";
import { Skeleton } from "./ui/skeleton";

export default function RenderPosts({
	store,
	className,
	emptyMessage = "Hãy theo dõi những người khác để xem những bài viết mới nhé",
}) {
	const posts = store((state) => state.posts);
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

			{posts?.length === 0 && (
				<p className="text-center text-gray">{emptyMessage}</p>
			)}

			{posts?.map((post) => (
				<Post key={post.id} post={post} className={className} store={store} />
			))}
		</>
	);
}
