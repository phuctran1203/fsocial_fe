import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/postsApi";
import { useHomePostsStore } from "../store/postsStore";
import "../index.scss";
import RenderPosts from "@/components/RenderPosts";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { messageReadAllPosts } from "@/config/globalVariables";

export default function Home() {
  const { posts, setPosts, appendPosts, smartObserver, disconnectObserver } =
    useHomePostsStore();
  const user = ownerAccountStore((state) => state.user);
  const [isEndPosts, setIsEndPosts] = useState(false);

  const fetchPosts = async () => {
    const resp = await getPosts(user.userId);
    if (!resp || resp.statusCode !== 200) return;
    if (!posts) {
      setPosts(resp.data);
    } else {
      if (posts.length !== 0 && resp.data.length === 0) {
        setIsEndPosts(true);
        return;
      }
      const shuffle = resp.data.sort(() => Math.random() - 0.5);
      console.log("shuffle is: ", shuffle);

      appendPosts(shuffle);

      //   // --- GHI NHỚ offset ---
      //   const container = containerRef.current;
      //   const target = targetRef.current;
      //   const prevOffset = target ? target.offsetTop - container.scrollTop : 0;

      //   setTimeout(() => {
      //     if (target) {
      //       const newOffset = target.offsetTop - prevOffset;
      //       container.scrollTop = newOffset;
      //     }
      //   }, 0); // Delay để đợi render xong
    }
  };

  // Infinite scroll fetch posts
  const containerRef = useRef();

  useEffect(() => {
    console.log("post change");

    const min = 2;
    const max = 6;
    const node = Array.from(containerRef.current.childNodes).at(
      (Math.random() * (+max - +min) + +min) * -1
    );
    console.log("tar get element: ", node);

    if (node) smartObserver(node, fetchPosts);
    return () => disconnectObserver();
  }, [posts]);

  useEffect(() => {
    if (!user?.userId) return;
    fetchPosts();
  }, [user?.userId]);

  return (
    <div className="bg-background flex flex-grow transition">
      <div className="overflow-y-auto scrollable-div w-full">
        <div
          ref={containerRef}
          className="
					w-full mx-auto
					lg:max-w-[540px]
					md:space-y-4 md:pb-0
					sm:mt-2
					space-y-1.5 pb-12"
        >
          <RenderPosts
            className="sm:rounded shadow-y"
            store={useHomePostsStore}
            fetchPosts={fetchPosts}
          />

          {isEndPosts && (
            <p className="pb-4 text-center text-gray">{messageReadAllPosts}</p>
          )}
        </div>
      </div>
    </div>
  );
}
