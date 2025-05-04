import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/postsApi";
import { useHomePostsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { messageReadAllPosts } from "@/config/globalVariables";
import { cn } from "@/lib/utils";

export default function Home() {
  const { posts, setPosts, appendPosts } = useHomePostsStore();
  const user = ownerAccountStore((state) => state.user);
  const [isEndPosts, setIsEndPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchPosts = async () => {
    if (isFetching) return;
    setIsFetching(true);
    const resp = await getPosts(user.userId);
    setIsFetching(false);
    if (!resp || resp.statusCode !== 200) return;
    if (!posts) {
      setPosts(resp.data);
    } else {
      if (posts.length !== 0 && resp.data.length === 0) {
        setIsEndPosts(true);
        return;
      }
      // const shuffle = resp.data.sort(() => Math.random() - 0.5);
      // console.log("shuffle is: ", shuffle);

      appendPosts(resp.data);
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    fetchPosts();
  }, [user?.userId]);

  return (
    <div className="bg-background flex-grow transition">
      <div
        className={cn(
          "h-full w-full mx-auto pb-12",
          "md:pb-0",
          "lg:max-w-[540px]"
        )}
      >
        <RenderPosts
          className="sm:rounded shadow-y my-2 md:my-4"
          posts={posts}
          store={useHomePostsStore}
          fetchPosts={fetchPosts}
        />

        {isEndPosts && (
          <p className="pb-4 text-center text-gray">{messageReadAllPosts}</p>
        )}
      </div>
    </div>
  );
}
