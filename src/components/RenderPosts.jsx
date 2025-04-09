import Post from "./Post";
import { Skeleton } from "./ui/skeleton";
import { Virtuoso } from "react-virtuoso";

export default function RenderPosts({
  posts,
  store,
  className,
  fetchPosts = () => {},
}) {
  return (
    <Virtuoso
      style={{ height: "100%" }}
      className="scrollable-div"
      components={{
        Footer: () =>
          [0].map((l) => (
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
          )),
      }}
      increaseViewportBy={{ top: 5000, bottom: 500 }}
      data={posts}
      itemContent={(_, post) => (
        <Post post={post} className={className} store={store} />
      )}
      rangeChanged={({ endIndex }) => {
        const nearBottom = endIndex >= posts.length - 5; // cách đáy 5 item
        if (nearBottom) {
          fetchPosts();
        }
      }}
    />
  );
}
